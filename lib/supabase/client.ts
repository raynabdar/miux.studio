import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Browser client for Supabase Realtime only. Authentication is delegated to
// Clerk through a JWT template named "supabase"; returns null when Supabase is
// not configured so components can fall back to polling.

export type TokenGetter = () => Promise<string | null>

export function createRealtimeClient(getToken: TokenGetter): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const apiKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !apiKey) return null

  return createClient(url, apiKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    accessToken: async () => (await getToken()) ?? null,
  })
}
