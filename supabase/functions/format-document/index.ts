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

    // If content is provided, use it directly
    const formattedContent = content ? await formatContent(content, config) : null
    console.log('Content formatted successfully')

    if (formattedContent) {
      // Update the document with formatted content
      const { error: updateError } = await supabaseClient
        .from('documents')
        .update({ content: formattedContent })
        .eq('id', documentId)

      if (updateError) {
        console.error('Error updating document:', updateError)
        throw updateError
      }
    }

    // Generate download URL
    const downloadUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/formatted-docs/${documentId}.pdf`
    
    console.log('Document processed successfully')

    return new Response(
      JSON.stringify({ 
        success: true,
        downloadUrl,
        formattedContent,
        message: 'Document processed successfully'
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
        error: error.message || 'An error occurred while processing the document',
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
  // For now, we'll just return the content as is
  // You can implement more sophisticated formatting logic here based on the config
  return content
}