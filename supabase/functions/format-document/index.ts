import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { documentId, config } = await req.json()
    console.log('Processing document:', documentId)

    if (!documentId) {
      throw new Error('Document ID is required')
    }

    // Initialize Supabase client with environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey)
    console.log('Supabase client initialized')

    // Fetch the document
    const { data: document, error: fetchError } = await supabaseClient
      .from('documents')
      .select('content')
      .eq('id', documentId)
      .single()

    if (fetchError || !document) {
      console.error('Error fetching document:', fetchError)
      throw new Error('Failed to fetch document')
    }

    // Format the content
    const formattedContent = await formatContent(document.content, config)
    console.log('Content formatted successfully')

    // Update the document with formatted content
    const { error: updateError } = await supabaseClient
      .from('documents')
      .update({ content: formattedContent })
      .eq('id', documentId)

    if (updateError) {
      console.error('Error updating document:', updateError)
      throw updateError
    }

    // Generate download URL
    const downloadUrl = `${supabaseUrl}/storage/v1/object/public/formatted-docs/${documentId}.pdf`
    
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
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred while processing the document',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

// Helper function to format content based on config
async function formatContent(content: string, config: any): Promise<string> {
  // For now, we'll just return the content as is
  // You can implement more sophisticated formatting logic here based on the config
  return content
}