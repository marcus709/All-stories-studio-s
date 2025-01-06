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
    const { storyId, documentContent } = await req.json();
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize OpenAI analysis
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
            content: `You are a story analysis expert. Analyze the following story content for:
              1. Plot holes
              2. Timeline inconsistencies
              3. POV confusion
              4. Character inconsistencies
              
              For each issue found, provide:
              - Issue type
              - Description
              - Location in the story
              - Severity (1-10)
              
              Format your response as a JSON array of objects with these properties.`
          },
          {
            role: 'user',
            content: documentContent
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const aiResponse = await response.json();
    const analysisResults = JSON.parse(aiResponse.choices[0].message.content);

    // Store analysis results in Supabase
    const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);
    
    const { data: analysis, error: analysisError } = await supabase
      .from('story_analysis')
      .insert({
        story_id: storyId,
        user_id: (await req.json()).user_id
      })
      .select()
      .single();

    if (analysisError) throw analysisError;

    // Insert issues found by AI
    const issuePromises = analysisResults.issues.map(async (issue: any) => {
      await supabase
        .from('story_issues')
        .insert({
          analysis_id: analysis.id,
          issue_type: issue.type,
          description: issue.description,
          location: issue.location,
          severity: issue.severity,
          status: 'open'
        });
    });

    await Promise.all(issuePromises);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-story-logic function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});