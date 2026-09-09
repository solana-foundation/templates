import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

let client: SupabaseClient<Database> | null | undefined

export function getSupabaseBrowserClient() {
  if (client !== undefined) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  client = url && anonKey ? createClient<Database>(url, anonKey) : null
  return client
}
