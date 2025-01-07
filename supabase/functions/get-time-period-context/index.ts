import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { timePeriod, documentContent } = await req.json();

    console.log('Analyzing time period:', timePeriod);
    console.log('Document content:', documentContent);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a historical context expert. Analyze the provided text content and verify its historical accuracy for the specified time period. 
            Return a JSON object with three properties:
            - language: analysis of language usage and authenticity for the time period
            - culture: analysis of cultural references and historical accuracy
            - environment: analysis of environmental and setting details
            Keep each analysis concise but informative.`
          },
          {
            role: 'user',
            content: `Time Period: ${timePeriod}\n\nDocument Content: ${documentContent}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', data);

    // Extract the content and parse it as JSON
    const analysisText = data.choices[0].message.content;
    let contextInfo;
    
    try {
      // Try to parse the response directly
      contextInfo = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      // Fallback to a structured response if parsing fails
      contextInfo = {
        language: "Could not analyze language usage.",
        culture: "Could not analyze cultural context.",
        environment: "Could not analyze environmental details."
      };
    }

    return new Response(JSON.stringify({ contextInfo }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-time-period-context function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Failed to process time period analysis request"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});