// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables with fallbacks
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://alolksttyxnvbkewjbnw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsb2xrc3R0eXhudmJrZXdqYm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MDQyMjAsImV4cCI6MjA2NzI4MDIyMH0.66l8ORoW7E0DC4cClHOddK-kwSg_jo74uofQ4ogMom8";

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('Missing Supabase configuration. Please check your environment variables.');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // Prevent auto-detection of session in URL
  },
  global: {
    headers: {
      'apikey': SUPABASE_PUBLISHABLE_KEY,
    },
  },
});