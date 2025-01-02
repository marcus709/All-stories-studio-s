import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client
export const supabase = createClient(
  'https://your-project-url.supabase.co',  // Replace this with your project URL
  'your-anon-key'  // Replace this with your anon key
)