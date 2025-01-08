import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database.types';

const supabaseUrl = 'https://ymcgqalkdhxqjsodshgi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltY2dxYWxrZGh4cWpzb2RzaGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ3MjY1NzksImV4cCI6MjAyMDMwMjU3OX0.aqMKvpxGDVXh_ZZBtj4MvKJ5BXUZYUbhY9mRHsRXEWY';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
});