import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tfqwjsevhsfbsfhvhgfd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmcXdqc2V2aHNmYnNmaHZoZ2ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NjQ4NzcsImV4cCI6MjA4MzI0MDg3N30.p0caBDNt_GYtZ-IyDcFCNHySH1MycKE0WIfVCkO46bI';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
