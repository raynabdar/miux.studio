'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { markClientConversationRead, sendClientMessage } from '@/app/(portal)/client/actions'
import { markTeamConversationRead, sendTeamReply } from '@/app/(portal)/team/actions'
import { createRealtimeClient } from '@/lib/supabase/client'

type ChatMessage = {
  id: string
  senderRole: 'client' | 'team_member' | 'assistant'
  body: string
  createdAt: Date | string
}

export default function ChatPanel({
  projectId,
  conversationId,
  messages,
  viewer,
  readOnly = false,
}: {
  projectId: string
  conversationId: string | null
  messages: ChatMessage[]
  viewer: 'client' | 'team_member'
  readOnly?: boolean
}) {
  const { getToken } = useAuth()
  const router = useRouter()
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages.length])

  useEffect(() => {
    const markRead = viewer === 'client' ? markClientConversationRead : markTeamConversationRead
    void markRead(projectId)
  }, [projectId, viewer])

  useEffect(() => {
    const supabase = createRealtimeClient(() => getToken({ template: 'supabase' }))
    if (!supabase) {
      const interval = setInterval(() => router.refresh(), 8000)
      return () => clearInterval(interval)
    }
    if (!conversationId) {
      const interval = setInterval(() => router.refresh(), 8000)
      return () => clearInterval(interval)
    }
    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversationId=eq.${conversationId}` },
        () => router.refresh()
      )
      .subscribe()
    const interval = setInterval(() => router.refresh(), 30000)
    return () => {
      clearInterval(interval)
      void supabase.removeChannel(channel)
    }
  }, [conversationId, router, getToken])

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body = text.trim()
    if (!body) return
    setError(null)
    startTransition(async () => {
      const action = viewer === 'client' ? sendClientMessage : sendTeamReply
      const result = await action({ projectId, body })
      if (!result.ok) {
        setError(result.message)
        return
      }
      setText('')
      router.refresh()
    })
  }

  return (
    <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 backdrop-blur-xl">
      <header className="flex items-center justify-between border-b border-[#141414]/10 px-5 py-4">
        <h2 className="text-base font-semibold">Conversation</h2>
        <span className="text-[11px] uppercase tracking-[0.14em] text-[#8A857C]">
          {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Live' : 'Auto-refresh'}
        </span>
      </header>

      <div ref={listRef} className="max-h-[420px] min-h-[180px] space-y-3 overflow-y-auto px-5 py-4">
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-[#8A857C]">
            No messages yet. Say hello — our team replies here and by email.
          </p>
        )}
        {messages.map((message) => {
          const mine = message.senderRole === viewer
          return (
            <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  message.senderRole === 'assistant'
                    ? 'border border-orange-500/25 bg-orange-50 text-[#3D3226]'
                    : mine
                      ? 'bg-[#141414] text-[#F6F5F0]'
                      : 'bg-[#F6F5F0] text-[#3D3226]'
                }`}
              >
                {message.senderRole === 'assistant' && (
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-700">
                    Miux Assistant
                  </p>
                )}
                <p className="whitespace-pre-wrap break-words">{message.body}</p>
                <p className={`mt-1 text-[10px] ${mine ? 'text-[#F6F5F0]/60' : 'text-[#8A857C]'}`}>
                  {new Date(message.createdAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <form onSubmit={onSubmit} className="border-t border-[#141414]/10 px-5 py-4">
        {readOnly && (
          <p className="mb-2 rounded-xl bg-[#F6F5F0] px-3 py-2 text-xs text-[#8A857C]">
            Demo mode is read-only. Messaging is disabled.
          </p>
        )}
        {error && (
          <p role="alert" className="mb-2 text-xs text-red-700">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={2}
            maxLength={2000}
            placeholder="Write a message…"
            className="min-h-[44px] flex-1 resize-none rounded-2xl border border-[#141414]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500/60"
          />
          <button
            type="submit"
            disabled={pending || readOnly || !text.trim()}
            className="self-end rounded-full bg-[#141414] px-5 py-2.5 text-sm font-semibold text-[#F6F5F0] transition-transform hover:-translate-y-0.5 disabled:opacity-40"
          >
            {pending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </form>
    </section>
  )
}
