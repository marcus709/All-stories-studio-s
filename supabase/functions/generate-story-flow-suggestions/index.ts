import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { storyId, type } = await req.json();
    
    const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);
    
    // Fetch story data
    const { data: story } = await supabase
      .from('stories')
      .select('*, characters(*), plot_events(*)')
      .eq('id', storyId)
      .single();

    if (!story) {
      throw new Error('Story not found');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'timeline') {
      systemPrompt = `You are a creative writing assistant helping to develop story timelines. Consider the following story context:
      Title: ${story.title}
      Description: ${story.description}
      Characters: ${story.characters.map(c => `${c.name} (${c.role}): ${c.traits?.join(', ')}`).join('\n')}
      Current Plot Events: ${story.plot_events.map(e => `${e.title}: ${e.description}`).join('\n')}
      
      Suggest 3-5 additional plot events that would enrich the story, maintaining consistency with existing events and character arcs.
      Format your response as a JSON array of objects with 'title', 'description', and 'stage' properties.`;
      
      userPrompt = "Generate plot event suggestions that build upon the existing narrative while maintaining character consistency.";
    } else if (type === 'relationships') {
      systemPrompt = `You are a character relationship expert. Consider the following story context:
      Title: ${story.title}
      Description: ${story.description}
      Characters: ${story.characters.map(c => `${c.name} (${c.role}): ${c.traits?.join(', ')}`).join('\n')}
      
      Suggest 3-5 potential character relationships that would create interesting dynamics and conflicts.
      Format your response as a JSON array of objects with 'character1', 'character2', 'relationshipType', and 'description' properties.`;
      
      userPrompt = "Generate relationship suggestions that would create compelling character dynamics.";
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await response.json();
    const suggestions = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(suggestions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-story-flow-suggestions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});