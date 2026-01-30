
import { createClient } from '@supabase/supabase-js';

// Fallback to placeholder strings if environment variables are missing to prevent initialization crash.
// Note: The app will boot, but Supabase operations will fail until valid credentials are provided in the environment.
const supabaseUrl = process.env.SUPABASE_URL || 'https://ctaahgjbsknvpnqhtxrf.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0YWFoZ2pic2tudnBucWh0eHJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MjgyMjcsImV4cCI6MjA4NTMwNDIyN30.zXLC5iBIgLd0BV93IVCTQFXBDjTz6GdtXVlxm6TSuAo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
