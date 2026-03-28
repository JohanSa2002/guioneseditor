import { createClient } from '@supabase/supabase-js'

// Service Role key: bypasea RLS, solo usar en backend
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
