import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireFounder } from '@/lib/auth/session'
import { getClientDetail } from '@/lib/admin/queries'
import { addNoteForm, changeRoleForm, verifyAccountForm } from '../../actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Client — Miux Studio Admin',
  robots: { index: false, follow: false },
}

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const timeFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const STATUS_LABEL: Record<string, string> = {
  pending_verification: 'Pending verification',
  active: 'Active',
  suspended: 'Suspended',
}

export default async function AdminClientPage({ params }: { params: Promise<{ clerkId: string }> }) {
  const { clerkId } = await params
  await requireFounder()
  const detail = await getClientDetail(clerkId)
  if (!detail) notFound()

  const { user, conversations } = detail
  const verified = Boolean(user.ownerVerifiedAt)

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <nav className="mb-6 text-xs text-[#8A857C]">
        <Link href="/admin" className="hover:text-orange-700">
          Admin
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#5C5A55]">{user.fullName ?? user.email}</span>
      </nav>

      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl tracking-tight sm:text-3xl">{user.fullName ?? user.email}</h1>
          <p className="mt-1 text-sm text-[#5C5A55]">
            {user.company ?? 'No company'} · {user.email}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.08em]">
            <span className="rounded-full bg-[#F6F5F0] px-2.5 py-1 text-[#5C5A55]">
              {STATUS_LABEL[user.status] ?? user.status}
            </span>
            <span className="rounded-full bg-[#F6F5F0] px-2.5 py-1 text-[#5C5A55]">
              {verified ? 'Owner verified' : 'Awaiting owner verification'}
            </span>
            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-orange-700">role: {user.role}</span>
            {user.isDemo && <span className="rounded-full bg-[#F6F5F0] px-2.5 py-1 text-[#5C5A55]">demo</span>}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <form action={verifyAccountForm}>
            <input type="hidden" name="clerkId" value={user.clerkId} />
            <input type="hidden" name="mode" value={verified ? 'unverify' : 'verify'} />
            <button
              type="submit"
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                verified
                  ? 'border border-[#141414]/15 bg-white text-[#141414]'
                  : 'bg-[#141414] text-[#F6F5F0]'
              }`}
            >
              {verified ? 'Unverify account' : 'Verify account'}
            </button>
          </form>

          <form action={changeRoleForm} className="flex items-center gap-2">
            <input type="hidden" name="clerkId" value={user.clerkId} />
            <select
              name="role"
              defaultValue={user.role}
              className="rounded-xl border border-[#141414]/15 bg-white px-3 py-1.5 text-xs"
            >
              <option value="client">client</option>
              <option value="team_member">team_member</option>
            </select>
            <button
              type="submit"
              className="rounded-full border border-[#141414]/15 bg-white px-3 py-1.5 text-xs font-semibold hover:border-orange-500/50"
            >
              Update role
            </button>
          </form>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-3 text-base font-semibold">Onboarding submissions</h2>
            {user.submissions.length === 0 ? (
              <p className="text-sm text-[#8A857C]">No submissions linked to this account.</p>
            ) : (
              <ul className="space-y-3">
                {user.submissions.map((submission) => (
                  <li key={submission.id} className="rounded-2xl bg-[#F6F5F0] px-4 py-3 text-sm">
                    <p className="font-mono text-[11px] text-[#8A857C]">{submission.referenceId}</p>
                    <p className="mt-1 text-xs text-[#8A857C]">
                      {dateFmt.format(submission.createdAt)} · {submission.service} · {submission.budgetRange}
                    </p>
                    <p className="mt-1 text-xs text-[#5C5A55]">
                      meeting {submission.meetingPreference} · booking {submission.bookingState} · status{' '}
                      {submission.status}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-[#3D3226]">{submission.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-3 text-base font-semibold">Projects</h2>
            {user.projects.length === 0 ? (
              <p className="text-sm text-[#8A857C]">No projects.</p>
            ) : (
              <ul className="space-y-3">
                {user.projects.map((project) => (
                  <li key={project.id} className="rounded-2xl bg-[#F6F5F0] px-4 py-3 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{project.name}</p>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#5C5A55]">
                        {project.status.replaceAll('_', ' ')}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[#8A857C]">
                      {project.startDate ? dateFmt.format(project.startDate) : 'TBC'} →{' '}
                      {project.expectedCompletion ? dateFmt.format(project.expectedCompletion) : 'TBC'}
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-[#5C5A55]">
                      {project.updates.map((update) => (
                        <li key={update.id}>
                          {dateFmt.format(update.createdAt)} · {update.title}
                          {update.attachmentPath ? ' · file' : ''}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/team/projects/${project.id}`}
                      className="mt-2 inline-block text-xs font-semibold text-orange-700 hover:underline"
                    >
                      Open in team workspace
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-3 text-base font-semibold">Internal notes</h2>
            <form action={addNoteForm} className="space-y-2">
              <input type="hidden" name="clientId" value={user.clerkId} />
              <textarea
                name="body"
                rows={3}
                required
                maxLength={4000}
                placeholder="Owner-only note (never visible to the client)…"
                className="w-full resize-none rounded-2xl border border-[#141414]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500/60"
              />
              <button
                type="submit"
                className="rounded-full bg-[#141414] px-4 py-2 text-xs font-semibold text-[#F6F5F0]"
              >
                Add note
              </button>
            </form>
            {user.clientNotes.length > 0 && (
              <ul className="mt-4 space-y-2">
                {user.clientNotes.map((note) => (
                  <li key={note.id} className="rounded-2xl bg-[#F6F5F0] px-4 py-3 text-sm">
                    <p className="whitespace-pre-wrap text-[#3D3226]">{note.body}</p>
                    <p className="mt-1 text-[11px] text-[#8A857C]">{timeFmt.format(note.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-3 text-base font-semibold">Chat history</h2>
            {conversations.length === 0 ? (
              <p className="text-sm text-[#8A857C]">No conversations yet.</p>
            ) : (
              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <div key={conversation.id}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A857C]">
                      {conversation.project.name}
                    </p>
                    <ul className="mt-2 max-h-64 space-y-2 overflow-y-auto">
                      {conversation.messages.map((message) => (
                        <li key={message.id} className="rounded-xl bg-[#F6F5F0] px-3 py-2 text-xs">
                          <p className="font-semibold text-[#5C5A55]">
                            {message.senderRole} · {timeFmt.format(message.createdAt)}
                          </p>
                          <p className="mt-0.5 whitespace-pre-wrap text-[#3D3226]">{message.body}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-3 text-base font-semibold">Meeting history</h2>
            {user.meetingRequests.length === 0 ? (
              <p className="text-sm text-[#8A857C]">No meeting requests.</p>
            ) : (
              <ul className="space-y-2">
                {user.meetingRequests.map((request) => (
                  <li key={request.id} className="rounded-2xl bg-[#F6F5F0] px-4 py-3 text-sm">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold uppercase tracking-[0.08em] text-[#5C5A55]">
                        {request.status}
                      </span>
                      <span className="text-[#8A857C]">{timeFmt.format(request.createdAt)}</span>
                    </div>
                    {request.project && (
                      <p className="mt-1 text-xs text-[#8A857C]">{request.project.name}</p>
                    )}
                    <p className="mt-1 whitespace-pre-wrap text-[#3D3226]">{request.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-3 text-base font-semibold">Notifications history</h2>
            {user.notifications.length === 0 ? (
              <p className="text-sm text-[#8A857C]">No notifications sent.</p>
            ) : (
              <ul className="space-y-2">
                {user.notifications.map((notification) => (
                  <li key={notification.id} className="rounded-2xl bg-[#F6F5F0] px-4 py-2 text-xs">
                    <p className="font-medium text-[#141414]">{notification.title}</p>
                    <p className="text-[#5C5A55]">{notification.body}</p>
                    <p className="mt-1 text-[#8A857C]">
                      {timeFmt.format(notification.createdAt)}
                      {notification.readAt ? ' · read' : ' · unread'}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
