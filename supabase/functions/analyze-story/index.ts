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

// Valid issue types according to the database enum
const validIssueTypes = [
  'plot_hole',
  'timeline_inconsistency',
  'pov_inconsistency',
  'character_inconsistency',
  'setting_inconsistency',
  'logic_flaw'
] as const;

type StoryIssueType = typeof validIssueTypes[number];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId, storyId, userId } = await req.json();
    console.log('Received request:', { documentId, storyId, userId });

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

    console.log('Created analysis:', analysis);

    // Analyze content with OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
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
              - Issue type (exactly one of: plot_hole, timeline_inconsistency, pov_inconsistency, character_inconsistency, setting_inconsistency, logic_flaw)
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
    console.log('AI Response:', aiResponse);

    let parsedContent;
    try {
      parsedContent = JSON.parse(aiResponse.choices[0].message.content);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Invalid response format from AI');
    }

    if (!Array.isArray(parsedContent.issues)) {
      console.error('Invalid issues array:', parsedContent);
      throw new Error('Invalid response format from AI - issues is not an array');
    }

    // Process and validate each issue before inserting
    const validatedIssues = parsedContent.issues.map(issue => {
      // Ensure issue type is valid
      const rawType = issue.type?.toString().toLowerCase() || 'plot_hole';
      let issueType: StoryIssueType = 'plot_hole';
      
      if (validIssueTypes.includes(rawType as StoryIssueType)) {
        issueType = rawType as StoryIssueType;
      } else {
        console.warn(`Invalid issue type "${rawType}", defaulting to plot_hole`);
      }

      // Validate and normalize severity
      const severity = Math.min(Math.max(1, parseInt(issue.severity?.toString() || '5') || 5), 10);

      return {
        analysis_id: analysis.id,
        issue_type: issueType,
        description: issue.description?.toString() || 'No description provided',
        location: issue.location?.toString() || 'Unknown location',
        severity,
        status: 'open'
      };
    });

    console.log('Validated issues:', validatedIssues);

    // Insert issues one by one to better handle errors
    for (const issue of validatedIssues) {
      const { error: issueError } = await supabase
        .from('story_issues')
        .insert(issue);

      if (issueError) {
        console.error('Error inserting issue:', issueError, 'Issue data:', issue);
        throw new Error(`Failed to save analysis issue: ${issueError.message}`);
      }
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