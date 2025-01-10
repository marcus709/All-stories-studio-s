import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { documentId, format = 'pdf', bookSize, deviceSettings } = await req.json()
    console.log('Processing document:', documentId, 'format:', format)

    if (!documentId) {
      throw new Error('Document ID is required')
    }

    // Initialize Supabase client
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

    // Format the content based on the selected format and settings
    const formattedContent = await formatContent(document.content, format, bookSize, deviceSettings)
    console.log('Content formatted successfully for', format)

    // Generate the appropriate file extension
    const fileExtension = getFileExtension(format)
    const fileName = `${documentId}.${fileExtension}`

    // Store the formatted content
    const { error: uploadError } = await supabaseClient.storage
      .from('formatted-docs')
      .upload(fileName, formattedContent, {
        contentType: getContentType(format),
        upsert: true
      })

    if (uploadError) {
      console.error('Error uploading formatted document:', uploadError)
      throw uploadError
    }

    // Get the public URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from('formatted-docs')
      .getPublicUrl(fileName)

    console.log('Document processed successfully')

    return new Response(
      JSON.stringify({ 
        success: true,
        downloadUrl: publicUrl,
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

// Helper function to format content based on format and settings
async function formatContent(
  content: string, 
  format: string,
  bookSize?: { width: number, height: number },
  deviceSettings?: any
): Promise<string> {
  // For now, we'll just return HTML content with applied styles
  // In a production environment, you'd want to use proper libraries for each format
  const styles = `
    @page {
      size: ${bookSize ? `${bookSize.width}in ${bookSize.height}in` : 'auto'};
      margin: 1in;
    }
    body {
      font-family: "Times New Roman", serif;
      font-size: 12pt;
      line-height: 1.6;
    }
  `
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${styles}</style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `
}

function getFileExtension(format: string): string {
  switch (format.toLowerCase()) {
    case 'epub':
      return 'epub'
    case 'mobi':
    case 'kpf':
      return 'kpf'
    case 'html':
      return 'html'
    default:
      return 'pdf'
  }
}

function getContentType(format: string): string {
  switch (format.toLowerCase()) {
    case 'epub':
      return 'application/epub+zip'
    case 'mobi':
    case 'kpf':
      return 'application/x-mobipocket-ebook'
    case 'html':
      return 'text/html'
    default:
      return 'application/pdf'
  }
}