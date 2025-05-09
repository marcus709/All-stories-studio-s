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
    const { timePeriod, documentContent, analysisConfig } = await req.json();
    
    console.log('Analyzing time period:', timePeriod);
    console.log('Analysis config:', analysisConfig);

    if (!timePeriod?.trim()) {
      throw new Error('Time period is required');
    }

    if (!documentContent?.trim()) {
      throw new Error('Document content is required for analysis');
    }

    // Build the system prompt based on configuration
    const focusAreasPrompt = analysisConfig.focusAreas
      .map(area => `- Detailed analysis of ${area.toLowerCase()} during this period`)
      .join('\n');

    const depthInstructions = {
      basic: "Provide a basic overview focusing on the most important aspects.",
      detailed: "Conduct a thorough analysis with specific examples and explanations.",
      comprehensive: "Perform an in-depth analysis covering all aspects with historical references and detailed context."
    }[analysisConfig.analysisDepth];

    const customInstructions = analysisConfig.customInstructions
      ? `\nAdditional focus areas:\n${analysisConfig.customInstructions}`
      : '';

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
            ${depthInstructions}
            Focus on these specific areas:
            ${focusAreasPrompt}
            ${customInstructions}
            
            You must ONLY return a valid JSON object with exactly this structure:
            {
              "language": "your analysis of language usage and authenticity for the time period, highlighting any anachronistic terms",
              "culture": "your analysis of cultural references and historical accuracy, noting any inconsistencies",
              "environment": "your analysis of environmental and setting details, pointing out any historical inaccuracies",
              "warnings": ["list of specific warnings about historical inaccuracies", "each as a separate string"]
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
      contextInfo = JSON.parse(data.choices[0].message.content);
      
      if (!contextInfo.language || !contextInfo.culture || !contextInfo.environment || !Array.isArray(contextInfo.warnings)) {
        throw new Error('Invalid response structure');
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.log('Raw response content:', data.choices[0].message.content);
      
      contextInfo = {
        language: "Could not analyze language usage.",
        culture: "Could not analyze cultural context.",
        environment: "Could not analyze environmental details.",
        warnings: ["Analysis failed to process properly"]
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
      contextInfo: {
        language: "Analysis failed",
        culture: "Analysis failed",
        environment: "Analysis failed",
        warnings: [error.message]
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});