'use client'

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { createRealtimeClient } from '@/lib/supabase/client'

// Refreshes the current server component when a new notification arrives for
// this user. Falls back to polling when Supabase Realtime is not configured.
export default function RealtimeRefresh({
  filter,
  intervalMs = 15000,
}: {
  filter: string
  intervalMs?: number
}) {
  const { getToken } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const supabase = createRealtimeClient(() => getToken({ template: 'supabase' }))
    if (!supabase) {
      const interval = setInterval(() => router.refresh(), intervalMs)
      return () => clearInterval(interval)
    }

    const channel = supabase
      .channel(`notifications:${filter}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter },
        () => router.refresh()
      )
      .subscribe()
    const interval = setInterval(() => router.refresh(), Math.max(intervalMs, 30000))

    return () => {
      clearInterval(interval)
      void supabase.removeChannel(channel)
    }
  }, [filter, intervalMs, router, getToken])

  return null
}
