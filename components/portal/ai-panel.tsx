'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { askAssistant } from '@/app/(portal)/client/actions'

export default function AiPanel({
  projectId,
  disabledReason,
}: {
  projectId: string
  disabledReason?: string
}) {
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const message = question.trim()
    if (!message) return
    setError(null)
    startTransition(async () => {
      const result = await askAssistant({ projectId, message, history: [] })
      if (!result.ok) {
        setError(result.message)
        return
      }
      setQuestion('')
      router.refresh()
    })
  }

  return (
    <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-5 backdrop-blur-xl">
      <h2 className="text-base font-semibold">Project assistant</h2>
      <p className="mt-1 text-sm text-[#5C5A55]">
        Ask about your project status, updates or next steps. Answers appear in your conversation.
      </p>

      {disabledReason ? (
        <p className="mt-4 rounded-2xl bg-[#F6F5F0] px-4 py-3 text-sm text-[#8A857C]">{disabledReason}</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 space-y-2">
          {error && (
            <p role="alert" className="text-xs text-red-700">
              {error}
            </p>
          )}
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            rows={2}
            maxLength={2000}
            placeholder="e.g. What did the last update cover?"
            className="w-full resize-none rounded-2xl border border-[#141414]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500/60"
          />
          <button
            type="submit"
            disabled={pending || !question.trim()}
            className="rounded-full bg-[#141414] px-5 py-2.5 text-sm font-semibold text-[#F6F5F0] transition-transform hover:-translate-y-0.5 disabled:opacity-40"
          >
            {pending ? 'Thinking…' : 'Ask the assistant'}
          </button>
        </form>
      )}
    </section>
  )
}
