import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { documentId, plotEvents, structure } = await req.json()

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get document content with timeout
    const { data: document, error: docError } = await Promise.race([
      supabase
        .from('documents')
        .select('content')
        .eq('id', documentId)
        .single(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 15000)
      )
    ])

    if (docError) throw docError

    // Analyze emotions with timeout
    const response = await Promise.race([
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are an expert at analyzing emotional arcs in stories. Analyze emotional intensity for characters and readers (1-10).'
            },
            {
              role: 'user',
              content: `Return a JSON array of objects for these plot events. Each object must have this exact structure:
              {
                "plot_event_id": string,
                "character_emotion": number,
                "reader_emotion": number,
                "intensity": number
              }
              
              Text: ${document.content}
              Events: ${JSON.stringify(plotEvents)}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('OpenAI API timeout')), 25000)
      )
    ])

    const aiResponse = await response.json()
    
    // Parse AI response with validation
    let analysis
    try {
      const content = aiResponse.choices[0].message.content.trim()
      analysis = JSON.parse(content.replace(/```json\n|\n```/g, ''))
      
      if (!Array.isArray(analysis)) {
        throw new Error('Invalid response format')
      }

      // Validate each emotion object
      analysis = analysis.map(emotion => ({
        plot_event_id: String(emotion.plot_event_id),
        character_emotion: Number(emotion.character_emotion),
        reader_emotion: Number(emotion.reader_emotion),
        intensity: Number(emotion.intensity)
      }))
    } catch (error) {
      console.error('Error parsing AI response:', error)
      throw new Error('Failed to parse emotional analysis results')
    }

    // Store results with timeout
    const emotionPromises = analysis.map(emotion => 
      Promise.race([
        supabase
          .from('plot_emotions')
          .upsert({
            plot_event_id: emotion.plot_event_id,
            character_emotion: emotion.character_emotion,
            reader_emotion: emotion.reader_emotion,
            intensity: emotion.intensity,
            document_id: documentId,
          })
          .select(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 15000)
        )
      ])
    )

    await Promise.all(emotionPromises)

    return new Response(
      JSON.stringify({ success: true, emotions: analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})