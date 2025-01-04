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
    const { prompt, type, context, aiConfig } = await req.json();

    // Build a dynamic system prompt based on AI configuration
    const buildSystemPrompt = (type: string, context: any) => {
      const basePrompt = systemPrompts[type] || systemPrompts.suggestions;
      
      // Add configuration-specific instructions
      const configInstructions = [];
      
      if (context?.aiConfig?.focus_area) {
        configInstructions.push(`Focus specifically on ${context.aiConfig.focus_area}.`);
      }
      
      if (context?.aiConfig?.tone) {
        configInstructions.push(`Maintain a ${context.aiConfig.tone} tone in your responses.`);
      }
      
      if (context?.aiConfig?.point_of_view) {
        configInstructions.push(`Frame suggestions from ${context.aiConfig.point_of_view}.`);
      }
      
      if (context?.aiConfig?.genre) {
        configInstructions.push(`Consider the ${context.aiConfig.genre} genre conventions.`);
      }

      // Add rules and keywords
      if (context?.aiConfig?.character_rules?.length > 0) {
        configInstructions.push("Character rules to follow:\n" + 
          context.aiConfig.character_rules.map((rule: string) => `- ${rule}`).join("\n"));
      }

      if (context?.aiConfig?.plot_rules?.length > 0) {
        configInstructions.push("Plot rules to follow:\n" + 
          context.aiConfig.plot_rules.map((rule: string) => `- ${rule}`).join("\n"));
      }

      if (context?.aiConfig?.keywords_include?.length > 0) {
        configInstructions.push("Try to incorporate these elements:\n" + 
          context.aiConfig.keywords_include.join(", "));
      }

      if (context?.aiConfig?.keywords_avoid?.length > 0) {
        configInstructions.push("Avoid using these elements:\n" + 
          context.aiConfig.keywords_avoid.join(", "));
      }

      // Add custom prompt if provided
      if (context?.aiConfig?.custom_prompt) {
        configInstructions.push(`Additional instructions: ${context.aiConfig.custom_prompt}`);
      }

      return `${basePrompt}\n\n${configInstructions.join("\n\n")}`;
    };

    const systemPrompts = {
      suggestions: `You are a creative writing assistant. Consider the following context about the story and its characters:
        ${context?.storyDescription || ''}
        ${context?.characters ? `Characters in the story: ${context.characters}` : ''}
        
        Provide helpful suggestions for improving the story while maintaining the author's voice. Format your response in clear sections:

        PLOT SUGGESTIONS:
        [Your plot-related suggestions]

        CHARACTER DEVELOPMENT:
        [Your character-related suggestions]

        WRITING STYLE:
        [Your style-related suggestions]`,

      traits: `You are a character development expert. Consider the following story context:
        ${context?.storyDescription || ''}
        ${context?.aiConfig?.system_prompt || ''}
        
        Suggest 5 unique and compelling character traits that would enrich the story and create interesting dynamics with existing characters.
        Format your response as a bullet-pointed list.`,

      goals: `You are a story planning assistant. Consider the following context:
        Story: ${context?.storyDescription || ''}
        Character traits: ${context?.traits || ''}
        ${context?.aiConfig?.system_prompt || ''}
        
        Suggest meaningful character goals and motivations that align with their traits and would drive the narrative forward.
        Format your response in sections:

        SHORT-TERM GOALS:
        - [Goal 1]
        - [Goal 2]

        LONG-TERM GOALS:
        - [Goal 1]
        - [Goal 2]

        INTERNAL MOTIVATIONS:
        - [Motivation 1]
        - [Motivation 2]`,
    };

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
            content: buildSystemPrompt(type, context)
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: context?.aiConfig?.creativity_level ? context.aiConfig.creativity_level / 10 : 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ai-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});