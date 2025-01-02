import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const SupabaseTest = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('_test').select('*').limit(1);
        if (error) throw error;
        setStatus('connected');
      } catch (error) {
        console.error('Supabase connection error:', error);
        setStatus('error');
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="p-4 text-center">
      {status === 'checking' && <p>Checking Supabase connection...</p>}
      {status === 'connected' && <p className="text-green-600">✓ Connected to Supabase</p>}
      {status === 'error' && <p className="text-red-600">× Error connecting to Supabase</p>}
    </div>
  );
};