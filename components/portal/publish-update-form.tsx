'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { publishUpdate } from '@/app/(portal)/team/actions'

export default function PublishUpdateForm({
  projects,
}: {
  projects: { id: string; name: string }[]
}) {
  const router = useRouter()
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [attachmentUrl, setAttachmentUrl] = useState('')
  const [attachmentName, setAttachmentName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (projects.length === 0) {
    return <p className="text-sm text-[#8A857C]">No projects yet. Projects appear here once a client is onboarded.</p>
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setNotice(null)
    startTransition(async () => {
      const result = await publishUpdate({ projectId, title, description, attachmentUrl, attachmentName })
      if (!result.ok) {
        setError(result.message)
        return
      }
      setTitle('')
      setDescription('')
      setAttachmentUrl('')
      setAttachmentName('')
      setNotice('Update published. The client has been notified.')
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {error && (
        <p role="alert" className="text-xs text-red-700">
          {error}
        </p>
      )}
      {notice && <p className="text-xs text-emerald-700">{notice}</p>}

      <label className="block text-xs font-medium text-[#5C5A55]">
        Project
        <select
          value={projectId}
          onChange={(event) => setProjectId(event.target.value)}
          className="mt-1 w-full rounded-xl border border-[#141414]/15 bg-white px-3 py-2 text-sm"
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-xs font-medium text-[#5C5A55]">
        Title
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={160}
          required
          className="mt-1 w-full rounded-xl border border-[#141414]/15 bg-white px-3 py-2 text-sm"
        />
      </label>

      <label className="block text-xs font-medium text-[#5C5A55]">
        Description
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          maxLength={5000}
          required
          className="mt-1 w-full resize-none rounded-xl border border-[#141414]/15 bg-white px-3 py-2 text-sm"
        />
      </label>

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block text-xs font-medium text-[#5C5A55]">
          Attachment URL (optional)
          <input
            value={attachmentUrl}
            onChange={(event) => setAttachmentUrl(event.target.value)}
            type="url"
            placeholder="https://…"
            className="mt-1 w-full rounded-xl border border-[#141414]/15 bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs font-medium text-[#5C5A55]">
          Attachment label (optional)
          <input
            value={attachmentName}
            onChange={(event) => setAttachmentName(event.target.value)}
            maxLength={160}
            className="mt-1 w-full rounded-xl border border-[#141414]/15 bg-white px-3 py-2 text-sm"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-[#141414] px-5 py-2.5 text-sm font-semibold text-[#F6F5F0] transition-transform hover:-translate-y-0.5 disabled:opacity-40"
      >
        {isPending ? 'Publishing…' : 'Publish update'}
      </button>
    </form>
  )
}
