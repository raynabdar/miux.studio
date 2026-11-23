import type { Metadata } from 'next'
import Link from 'next/link'
import { requirePageRole, isFounder } from '@/lib/auth/session'
import { getTeamOverview } from '@/lib/portal/queries'
import DemoModeBanner from '@/components/portal/demo-banner'
import RealtimeRefresh from '@/components/portal/realtime-refresh'
import SignOutButton from '@/components/portal/sign-out-button'
import PublishUpdateForm from '@/components/portal/publish-update-form'
import { markMeetingSeenForm } from './actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Team Workspace — Miux Studio',
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

export default async function TeamDashboardPage() {
  const user = await requirePageRole('team_member')
  const founder = isFounder(user.clerkId)
  const { projects, pendingRequests, updates } = await getTeamOverview(user.clerkId)

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <RealtimeRefresh filter={`recipientClerkId=eq.${user.clerkId}`} />
      {user.isDemo && <DemoModeBanner label="the team workspace" />}

      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A857C]">
            Team workspace
          </p>
          <h1 className="mt-1 text-2xl tracking-tight sm:text-3xl">
            Welcome, {user.fullName ?? user.email}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {founder && (
            <Link
              href="/founder"
              className="rounded-full border border-[#141414]/15 bg-white px-4 py-2 text-xs font-semibold hover:border-orange-500/50"
            >
              Founder panel
            </Link>
          )}
          <SignOutButton />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-base font-semibold">Projects</h2>
            {projects.length === 0 ? (
              <p className="text-sm text-[#8A857C]">No projects yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-[0.14em] text-[#8A857C]">
                      <th className="pb-2 pr-4 font-medium">Project</th>
                      <th className="pb-2 pr-4 font-medium">Client</th>
                      <th className="pb-2 pr-4 font-medium">Status</th>
                      <th className="pb-2 font-medium">Updates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} className="border-t border-[#141414]/5">
                        <td className="py-3 pr-4">
                          <Link
                            href={`/team/projects/${project.id}`}
                            className="font-medium hover:text-orange-700"
                          >
                            {project.name}
                          </Link>
                        </td>
                        <td className="py-3 pr-4 text-[#5C5A55]">
                          {project.client.company ?? project.client.fullName ?? project.client.email}
                        </td>
                        <td className="py-3 pr-4">
                          <span className="rounded-full bg-[#F6F5F0] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5C5A55]">
                            {STATUS_LABEL[project.status] ?? project.status}
                          </span>
                        </td>
                        <td className="py-3 text-[#5C5A55]">{project._count.updates}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-base font-semibold">Publish an update</h2>
            <PublishUpdateForm projects={projects.map((project) => ({ id: project.id, name: project.name }))} />
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-3 text-base font-semibold">Meeting requests</h2>
            {pendingRequests.length === 0 ? (
              <p className="text-sm text-[#8A857C]">No pending meeting requests.</p>
            ) : (
              <ul className="space-y-3">
                {pendingRequests.map((request) => (
                  <li key={request.id} className="rounded-2xl border border-orange-500/20 bg-orange-50/60 px-4 py-3">
                    <p className="text-sm font-medium">
                      {request.client.fullName ?? request.client.email}
                      {request.client.company ? ` · ${request.client.company}` : ''}
                    </p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-[#8A857C]">
                      {dateFmt.format(request.createdAt)}
                      {request.project ? ` · ${request.project.name}` : ''}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-[#3D3226]">{request.message}</p>
                    <form action={markMeetingSeenForm} className="mt-2">
                      <input type="hidden" name="requestId" value={request.id} />
                      <button
                        type="submit"
                        className="rounded-full bg-[#141414] px-4 py-1.5 text-xs font-semibold text-[#F6F5F0] disabled:opacity-40"
                      >
                        Mark as reviewed
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-3 text-base font-semibold">Recent activity</h2>
            {updates.length === 0 ? (
              <p className="text-sm text-[#8A857C]">No updates published yet.</p>
            ) : (
              <ul className="space-y-2">
                {updates.map((update) => (
                  <li key={update.id} className="rounded-2xl bg-[#F6F5F0] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A857C]">
                      {update.project.name} · {dateFmt.format(update.createdAt)}
                    </p>
                    <p className="mt-1 text-sm font-medium">{update.title}</p>
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
