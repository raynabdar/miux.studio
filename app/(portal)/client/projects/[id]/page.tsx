import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePageRole } from '@/lib/auth/session'
import { loadClientProject } from '@/lib/portal/access'
import { getProjectWorkspace } from '@/lib/portal/queries'
import ChatPanel from '@/components/portal/chat-panel'
import AiPanel from '@/components/portal/ai-panel'
import MeetingRequestForm from '@/components/portal/meeting-request-form'
import DemoModeBanner from '@/components/portal/demo-banner'
import RealtimeRefresh from '@/components/portal/realtime-refresh'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Project — Miux Studio',
  robots: { index: false, follow: false },
}

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const STATUS_LABEL: Record<string, string> = {
  discovery: 'Discovery',
  design: 'Design',
  development: 'Development',
  review: 'Review',
  launched: 'Launched',
  on_hold: 'On hold',
}

export default async function ClientProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requirePageRole('client')
  const project = await loadClientProject(user.clerkId, id)
  if (!project) notFound()

  const { conversation, updates, messages, pendingMeeting } = await getProjectWorkspace(project.id)

  const files = updates.flatMap((update) =>
    update.attachmentPath && /^https?:\/\//.test(update.attachmentPath)
      ? [{ url: update.attachmentPath, name: update.attachmentName || 'Attachment', at: update.createdAt }]
      : []
  )

  const assistantDisabledReason = user.isDemo
    ? 'Demo mode is read-only. The assistant is disabled.'
    : process.env.GEMINI_API_KEY
      ? undefined
      : 'The assistant is not configured in this environment yet.'

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <RealtimeRefresh filter={`recipientClerkId=eq.${user.clerkId}`} />
      {user.isDemo && <DemoModeBanner label="the project workspace" />}

      <nav className="mb-6 text-xs text-[#8A857C]">
        <Link href="/client" className="hover:text-orange-700">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#5C5A55]">{project.name}</span>
      </nav>

      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A857C]">
            {STATUS_LABEL[project.status] ?? project.status}
          </p>
          <h1 className="mt-1 text-2xl tracking-tight sm:text-3xl">{project.name}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5C5A55]">{project.description}</p>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-[#F6F5F0] px-4 py-3">
            <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8A857C]">Started</dt>
            <dd className="mt-1">{project.startDate ? dateFmt.format(project.startDate) : 'TBC'}</dd>
          </div>
          <div className="rounded-2xl bg-[#F6F5F0] px-4 py-3">
            <dt className="text-[11px] uppercase tracking-[0.14em] text-[#8A857C]">Completion</dt>
            <dd className="mt-1">
              {project.expectedCompletion ? dateFmt.format(project.expectedCompletion) : 'TBC'}
            </dd>
          </div>
        </dl>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-6">
          <ChatPanel
            projectId={project.id}
            conversationId={conversation?.id ?? null}
            messages={messages}
            viewer="client"
            readOnly={user.isDemo}
          />

          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-base font-semibold">Timeline</h2>
            {updates.length === 0 ? (
              <p className="text-sm text-[#8A857C]">Updates will appear here as work progresses.</p>
            ) : (
              <ol className="space-y-4">
                {updates.map((update) => (
                  <li key={update.id} className="relative rounded-2xl bg-[#F6F5F0] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A857C]">
                      {dateFmt.format(update.createdAt)}
                    </p>
                    <p className="mt-1 text-sm font-semibold">{update.title}</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-[#5C5A55]">
                      {update.description}
                    </p>
                    {update.attachmentPath?.startsWith('https://') || update.attachmentPath?.startsWith('http://') ? (
                      <a
                        href={update.attachmentPath}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="mt-2 inline-block text-xs font-semibold text-orange-700 hover:underline"
                      >
                        {update.attachmentName || 'View attachment'}
                      </a>
                    ) : null}
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <AiPanel projectId={project.id} disabledReason={assistantDisabledReason} />

          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-2 text-base font-semibold">Request a meeting</h2>
            <MeetingRequestForm
              projectId={project.id}
              pendingRequest={Boolean(pendingMeeting)}
              disabledReason={user.isDemo ? 'Demo mode is read-only. Meeting requests are disabled.' : undefined}
            />
          </section>

          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-2 text-base font-semibold">Files</h2>
            {files.length === 0 ? (
              <p className="text-sm text-[#8A857C]">Shared files will appear here.</p>
            ) : (
              <ul className="space-y-2">
                {files.map((file) => (
                  <li key={`${file.url}-${file.at.toISOString()}`}>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="flex items-center justify-between gap-2 rounded-2xl bg-[#F6F5F0] px-4 py-2 text-sm hover:bg-orange-50"
                    >
                      <span className="truncate">{file.name}</span>
                      <span className="shrink-0 text-xs text-[#8A857C]">{dateFmt.format(file.at)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-2 text-base font-semibold">Your team</h2>
            <ul className="space-y-2 text-sm text-[#5C5A55]">
              {project.members.length === 0 && <li>Assignments will be shown here.</li>}
              {project.members.map((member) => (
                <li key={member.id} className="rounded-2xl bg-[#F6F5F0] px-4 py-2">
                  {member.roleLabel ?? 'Team member'}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}
