import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { documentId, config, content } = await req.json()
    
    console.log('Formatting document:', { documentId, config })

    if (!documentId) {
      throw new Error('Document ID is required')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Format the content based on config
    const formattedContent = await formatContent(content, config)
    console.log('Content formatted successfully')

    // Update the document with formatted content
    const { error: updateError } = await supabaseClient
      .from('documents')
      .update({ content: formattedContent })
      .eq('id', documentId)

    if (updateError) {
      console.error('Error updating document:', updateError)
      throw new Error('Failed to update document')
    }

    // Generate download URL (this is a placeholder - implement actual file generation)
    const downloadUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/formatted-docs/${documentId}.pdf`
    
    console.log('Document updated successfully')

    return new Response(
      JSON.stringify({ 
        success: true,
        downloadUrl,
        message: 'Document formatted successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in format-document function:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred while formatting the document',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

// Helper function to format content based on config
async function formatContent(content: string, config: any): Promise<string> {
  // This is where you would implement the actual formatting logic
  // For now, we'll just return the content as is
  return content
}