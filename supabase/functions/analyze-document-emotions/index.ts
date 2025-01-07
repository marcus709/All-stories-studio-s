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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get document content
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('content')
      .eq('id', documentId)
      .single()

    if (docError) throw docError

    // Analyze emotions for each plot event
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are an expert at analyzing emotional arcs in stories. For each plot event in the story structure, analyze the emotional intensity for both characters and readers on a scale of 1-10. Consider:
            1. Character emotions: How intensely are the characters feeling in this moment?
            2. Reader emotions: What emotional impact would this have on readers?
            
            Structure your response as a JSON array of objects with plot_event_id, character_emotion, reader_emotion, and intensity fields.`
          },
          {
            role: 'user',
            content: `Analyze this text and assign emotional values for these plot events in the ${structure} structure:
            
            Text: ${document.content}
            
            Events: ${JSON.stringify(plotEvents)}`
          }
        ],
        temperature: 0.7,
      }),
    })

    const aiResponse = await response.json()
    const analysis = JSON.parse(aiResponse.choices[0].message.content)

    // Store emotion analysis results
    const emotionPromises = analysis.map(async (emotion: any) => {
      const { data, error } = await supabase
        .from('plot_emotions')
        .upsert({
          plot_event_id: emotion.plot_event_id,
          character_emotion: emotion.character_emotion,
          reader_emotion: emotion.reader_emotion,
          intensity: emotion.intensity,
          document_id: documentId,
        })
        .select()

      if (error) throw error
      return data
    })

    await Promise.all(emotionPromises)

    return new Response(
      JSON.stringify({ success: true, emotions: analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})