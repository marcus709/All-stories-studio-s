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
            content: `You are a historical context expert. You must analyze the provided text content and verify its historical accuracy for the specified time period.
            You must ONLY return a valid JSON object with exactly this structure:
            {
              "language": "your analysis of language usage and authenticity for the time period",
              "culture": "your analysis of cultural references and historical accuracy",
              "environment": "your analysis of environmental and setting details"
            }
            Keep each analysis concise but informative. Do not include any markdown, code blocks, or additional formatting.
            IMPORTANT: Your response must be a valid JSON object that can be parsed directly.`
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

    let contextInfo;
    try {
      // First try to parse the response content directly
      contextInfo = JSON.parse(data.choices[0].message.content);
      
      // Validate the response structure
      if (!contextInfo.language || !contextInfo.culture || !contextInfo.environment) {
        throw new Error('Invalid response structure');
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.log('Raw response content:', data.choices[0].message.content);
      
      // Extract content using regex as fallback
      const content = data.choices[0].message.content;
      contextInfo = {
        language: content.match(/\"language\":\s*\"([^\"]+)\"/)?.pop() || "Could not analyze language usage.",
        culture: content.match(/\"culture\":\s*\"([^\"]+)\"/)?.pop() || "Could not analyze cultural context.",
        environment: content.match(/\"environment\":\s*\"([^\"]+)\"/)?.pop() || "Could not analyze environmental details."
      };
    }

    return new Response(JSON.stringify({ contextInfo }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-time-period-context function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Failed to process time period analysis request",
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});