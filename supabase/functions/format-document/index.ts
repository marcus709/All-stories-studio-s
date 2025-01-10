import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface BookSize {
  width: number;
  height: number;
  name: string;
}

interface MarginSettings {
  top: number;
  bottom: number;
  inner: number;
  outer: number;
}

function calculateMargins(bookSize: BookSize): MarginSettings {
  // Standard margin ratios based on professional book design
  const smallerDimension = Math.min(bookSize.width, bookSize.height);
  
  return {
    top: smallerDimension * 0.125,    // 1/8 of page
    bottom: smallerDimension * 0.167,  // 1/6 of page
    inner: smallerDimension * 0.167,   // 1/6 of page
    outer: smallerDimension * 0.125,   // 1/8 of page
  };
}

function handleWidowsAndOrphans(content: string): string {
  const paragraphs = content.split('\n\n');
  
  return paragraphs.map(paragraph => {
    // Add non-breaking space between last words to prevent widows
    const words = paragraph.split(' ');
    if (words.length > 1) {
      const lastIndex = words.length - 2;
      words[lastIndex] = words[lastIndex] + '\u00A0';
    }
    return words.join(' ');
  }).join('\n\n');
}

function generateHeaderFooter(pageNumber: number, bookTitle: string, authorName: string, isRightPage: boolean): string {
  const header = isRightPage ? bookTitle : authorName;
  return `
    <header class="running-head">${header}</header>
    <footer class="page-number">${pageNumber}</footer>
  `;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { documentId, bookSize, content, title = '', author = '' } = await req.json()
    console.log('Processing document:', documentId, 'with size:', bookSize)

    if (!documentId || !bookSize) {
      throw new Error('Document ID and book size are required')
    }

    const margins = calculateMargins(bookSize);
    const processedContent = handleWidowsAndOrphans(content);

    // Generate CSS for professional book formatting
    const styles = `
      @page {
        size: ${bookSize.width}in ${bookSize.height}in;
        margin-top: ${margins.top}in;
        margin-bottom: ${margins.bottom}in;
        margin-inside: ${margins.inner}in;
        margin-outside: ${margins.outer}in;
        @top-center { content: element(running-head); }
        @bottom-center { content: counter(page); }
      }

      body {
        font-family: "Crimson Pro", serif;
        font-size: 11pt;
        line-height: 1.5;
        text-align: justify;
        hyphens: auto;
        orphans: 3;
        widows: 3;
      }

      .running-head {
        position: running(running-head);
        text-align: center;
        font-size: 9pt;
        font-style: italic;
      }

      .page-number {
        text-align: center;
        font-size: 10pt;
      }

      p {
        text-indent: 1.5em;
        margin: 0;
      }

      h1, h2, h3 {
        break-after: avoid;
      }
    `;

    // Format the content with proper HTML structure
    const formattedContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${styles}</style>
          <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
        </head>
        <body>
          ${processedContent}
        </body>
      </html>
    `;

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey)
    console.log('Supabase client initialized')

    // Store the formatted content
    const fileName = `${documentId}.pdf`
    const { error: uploadError } = await supabaseClient.storage
      .from('formatted-docs')
      .upload(fileName, formattedContent, {
        contentType: 'application/pdf',
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
        message: 'Document formatted successfully'
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