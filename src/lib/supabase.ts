import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',  // URL will be loaded from environment
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''  // Anon key will be loaded from environment
)