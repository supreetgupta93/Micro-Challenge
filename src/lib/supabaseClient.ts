import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://znguflrlxvnyutnsnfww.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuZ3VmbHJseHZueXV0bnNuZnd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjEyMDAsImV4cCI6MjA4Njg5NzIwMH0.mrhLXOdJxWnS0iegOOxFuL-oRrijEwCpxMnI7Vg4g0E'
)
