import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePageRole } from '@/lib/auth/session'
import { loadTeamProject } from '@/lib/portal/access'
import { getProjectWorkspace } from '@/lib/portal/queries'
import ChatPanel from '@/components/portal/chat-panel'
import PublishUpdateForm from '@/components/portal/publish-update-form'
import DemoModeBanner from '@/components/portal/demo-banner'
import RealtimeRefresh from '@/components/portal/realtime-refresh'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Project — Miux Studio Team',
  robots: { index: false, follow: false },
}

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default async function TeamProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requirePageRole('team_member')
  const project = await loadTeamProject(user.clerkId, id)
  if (!project) notFound()

  const { conversation, updates, messages } = await getProjectWorkspace(project.id)

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <RealtimeRefresh filter={`recipientClerkId=eq.${user.clerkId}`} />
      {user.isDemo && <DemoModeBanner label="the project workspace" />}

      <nav className="mb-6 text-xs text-[#8A857C]">
        <Link href="/team" className="hover:text-orange-700">
          Team workspace
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#5C5A55]">{project.name}</span>
      </nav>

      <header className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A857C]">
          {project.status.replaceAll('_', ' ')}
        </p>
        <h1 className="mt-1 text-2xl tracking-tight sm:text-3xl">{project.name}</h1>
        <p className="mt-1 text-sm text-[#5C5A55]">
          {project.client.fullName ?? project.client.email}
          {project.client.company ? ` · ${project.client.company}` : ''}
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5C5A55]">{project.description}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <ChatPanel
          projectId={project.id}
          conversationId={conversation?.id ?? null}
          messages={messages}
          viewer="team_member"
          readOnly={user.isDemo}
        />

        <div className="space-y-6">
          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-3 text-base font-semibold">Publish an update</h2>
            <PublishUpdateForm projects={[{ id: project.id, name: project.name }]} />
          </section>

          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-3 text-base font-semibold">Timeline</h2>
            {updates.length === 0 ? (
              <p className="text-sm text-[#8A857C]">No updates published yet.</p>
            ) : (
              <ol className="space-y-3">
                {updates.map((update) => (
                  <li key={update.id} className="rounded-2xl bg-[#F6F5F0] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A857C]">
                      {dateFmt.format(update.createdAt)}
                    </p>
                    <p className="mt-1 text-sm font-semibold">{update.title}</p>
                    <p className="mt-1 line-clamp-3 text-sm text-[#5C5A55]">{update.description}</p>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
