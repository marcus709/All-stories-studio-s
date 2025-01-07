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
    const { documentId, storyId, userId } = await req.json();

    if (!documentId || !storyId || !userId) {
      throw new Error('Missing required parameters');
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);

    // Fetch document content
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('content')
      .eq('id', documentId)
      .single();

    if (docError) {
      console.error('Error fetching document:', docError);
      throw new Error('Failed to fetch document');
    }

    // Create analysis record
    const { data: analysis, error: analysisError } = await supabase
      .from('story_analysis')
      .insert({
        story_id: storyId,
        user_id: userId,
      })
      .select()
      .single();

    if (analysisError) {
      console.error('Error creating analysis:', analysisError);
      throw new Error('Failed to create analysis');
    }

    // Analyze content with OpenAI
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
              3. POV inconsistencies
              4. Character inconsistencies
              5. Setting inconsistencies
              6. Logic flaws
              
              For each issue found, provide:
              - Issue type (one of the above categories)
              - Description
              - Location in the story (approximate)
              - Severity (1-10)
              
              Format your response as a JSON array of objects with these properties.`
          },
          {
            role: 'user',
            content: document.content
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to analyze story');
    }

    const aiResponse = await response.json();
    console.log('AI Response:', aiResponse); // Add logging for debugging

    // Ensure we have a valid response with issues array
    const issues = JSON.parse(aiResponse.choices[0].message.content).issues;
    
    if (!Array.isArray(issues)) {
      throw new Error('Invalid response format from AI');
    }

    // Process and validate each issue before inserting
    const validatedIssues = issues.map(issue => {
      // Ensure issue type is valid and properly formatted
      const rawType = (issue.type || '').toString().toLowerCase().replace(/ /g, '_');
      let issueType = 'plot_hole'; // Default type

      // Map the raw type to valid issue types
      if (rawType.includes('timeline')) issueType = 'timeline_inconsistency';
      else if (rawType.includes('pov')) issueType = 'pov_inconsistency';
      else if (rawType.includes('character')) issueType = 'character_inconsistency';
      else if (rawType.includes('setting')) issueType = 'setting_inconsistency';
      else if (rawType.includes('logic')) issueType = 'logic_flaw';

      return {
        analysis_id: analysis.id,
        issue_type: issueType,
        description: issue.description || 'No description provided',
        location: issue.location || 'Unknown location',
        severity: Math.min(Math.max(1, parseInt(issue.severity) || 5), 10), // Ensure severity is between 1-10
        status: 'open'
      };
    });

    // Insert issues
    const { error: issuesError } = await supabase
      .from('story_issues')
      .insert(validatedIssues);

    if (issuesError) {
      console.error('Error inserting issues:', issuesError);
      throw new Error('Failed to save analysis issues');
    }

    return new Response(
      JSON.stringify({ success: true, analysisId: analysis.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-story function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});