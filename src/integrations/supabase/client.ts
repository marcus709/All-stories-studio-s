import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ymcgqalkdhxqjsodshgi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltY2dxYWxrZGh4cWpzb2RzaGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MjQ4NzksImV4cCI6MjA1MTQwMDg3OX0.ipwgKtO06y_Y49tnKH8ewoBYWS9rrGQ9UshQAJoau24";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: window.localStorage,
      storageKey: 'supabase.auth.token',
      debug: true
    },
    global: {
      headers: {
        'x-client-info': 'lovable-app',
      },
    },
    // Add retry configuration
    db: {
      schema: 'public'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

// Add error handling for fetch operations
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);
    if (!response.ok) {
      console.error('Fetch error:', {
        status: response.status,
        statusText: response.statusText,
        url: args[0]
      });
    }
    return response;
  } catch (error) {
    console.error('Network error:', error);
    // Retry the request once after a short delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      return await originalFetch(...args);
    } catch (retryError) {
      console.error('Retry failed:', retryError);
      throw retryError;
    }
  }
};