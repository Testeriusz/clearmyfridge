import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uieizghdunljspqayrtr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZWl6Z2hkdW5sanNwcWF5cnRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNjMwNzAsImV4cCI6MjA5NjYzOTA3MH0.RPkGHIfLHbkDf6UVmxPp0fnNoubNtf5Yrl8JbONoyP8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
})
