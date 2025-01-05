import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ymcgqalkdhxqjsodshgi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltY2dxYWxrZGh4cWpzb2RzaGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MjQ4NzksImV4cCI6MjA1MTQwMDg3OX0.ipwgKtO06y_Y49tnKH8ewoBYWS9rrGQ9UshQAJoau24";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: window.localStorage
    }
  }
);