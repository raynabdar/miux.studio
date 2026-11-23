'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { requestMeeting } from '@/app/(portal)/client/actions'

export default function MeetingRequestForm({
  projectId,
  pendingRequest,
  disabledReason,
}: {
  projectId?: string
  pendingRequest: boolean
  disabledReason?: string
}) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (disabledReason) {
    return <p className="text-sm text-[#8A857C]">{disabledReason}</p>
  }

  if (pendingRequest || sent) {
    return (
      <div className="rounded-2xl bg-[#F6F5F0] px-4 py-3 text-sm text-[#5C5A55]">
        <p className="font-medium text-[#141414]">
          {sent ? 'Our team will get back to you within 20 minutes.' : 'Request sent.'}
        </p>
        <p className="mt-1 text-xs text-[#8A857C]">
          You can request another meeting after the team has reviewed this one.
        </p>
        <button
          type="button"
          disabled
          className="mt-3 rounded-full bg-[#141414] px-5 py-2 text-sm font-semibold text-[#F6F5F0] opacity-40"
        >
          Request a meeting
        </button>
      </div>
    )
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const body = message.trim()
    if (body.length < 10) {
      setError('Please add a short note (at least 10 characters) so we know what to prepare.')
      return
    }
    setError(null)
    startTransition(async () => {
      const result = await requestMeeting({ projectId, message: body })
      if (!result.ok) {
        setError(result.message)
        return
      }
      setSent(true)
      setMessage('')
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      {error && (
        <p role="alert" className="text-xs text-red-700">
          {error}
        </p>
      )}
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        rows={3}
        maxLength={1000}
        placeholder="What would you like to discuss with the team?"
        className="w-full resize-none rounded-2xl border border-[#141414]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500/60"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-[#141414] px-5 py-2.5 text-sm font-semibold text-[#F6F5F0] transition-transform hover:-translate-y-0.5 disabled:opacity-40"
      >
        {isPending ? 'Requesting…' : 'Request a meeting'}
      </button>
    </form>
  )
}
