import type { Metadata } from 'next'
import Link from 'next/link'
import { requirePageRole } from '@/lib/auth/session'
import { getClientOverview } from '@/lib/portal/queries'
import DemoModeBanner from '@/components/portal/demo-banner'
import RealtimeRefresh from '@/components/portal/realtime-refresh'
import SignOutButton from '@/components/portal/sign-out-button'
import { readNotifications } from './actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Client Dashboard — Miux Studio',
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

export default async function ClientDashboardPage() {
  const user = await requirePageRole('client')
  const { projects, updates, notifications, conversations, pendingMeeting } = await getClientOverview(
    user.clerkId
  )

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <RealtimeRefresh filter={`recipientClerkId=eq.${user.clerkId}`} />
      {user.isDemo && <DemoModeBanner label="the client dashboard" />}

      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A857C]">
            Client workspace
          </p>
          <h1 className="mt-1 text-2xl tracking-tight sm:text-3xl">
            Welcome, {user.fullName ?? user.email}
          </h1>
        </div>
        <SignOutButton />
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-base font-semibold">Your projects</h2>
            {projects.length === 0 ? (
              <p className="text-sm text-[#5C5A55]">
                No projects yet. Once your project starts, its timeline and updates appear here.
              </p>
            ) : (
              <ul className="space-y-2">
                {projects.map((project) => (
                  <li key={project.id}>
                    <Link
                      href={`/client/projects/${project.id}`}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#F6F5F0] px-4 py-3 transition-colors hover:bg-orange-50"
                    >
                      <div>
                        <p className="text-sm font-medium">{project.name}</p>
                        {project.expectedCompletion && (
                          <p className="mt-0.5 text-xs text-[#8A857C]">
                            Expected completion {dateFmt.format(project.expectedCompletion)}
                          </p>
                        )}
                      </div>
                      <span className="rounded-full border border-[#141414]/10 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5C5A55]">
                        {STATUS_LABEL[project.status] ?? project.status}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-base font-semibold">Recent updates</h2>
            {updates.length === 0 ? (
              <p className="text-sm text-[#5C5A55]">Project updates will appear here as work progresses.</p>
            ) : (
              <ul className="space-y-3">
                {updates.map((update) => (
                  <li key={update.id} className="rounded-2xl bg-[#F6F5F0] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A857C]">
                      {update.project.name} · {dateFmt.format(update.createdAt)}
                    </p>
                    <p className="mt-1 text-sm font-medium">{update.title}</p>
                    <Link
                      href={`/client/projects/${update.projectId}`}
                      className="mt-1 inline-block text-xs font-semibold text-orange-700 hover:underline"
                    >
                      Open project
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold">Notifications</h2>
              {notifications.length > 0 && (
                <form action={readNotifications}>
                  <button
                    type="submit"
                    className="text-xs font-semibold text-orange-700 hover:underline"
                  >
                    Mark all read
                  </button>
                </form>
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-[#8A857C]">You are all caught up.</p>
            ) : (
              <ul className="space-y-2">
                {notifications.map((notification) => (
                  <li key={notification.id} className="rounded-2xl border border-orange-500/20 bg-orange-50/60 px-4 py-3">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[#5C5A55]">{notification.body}</p>
                    {notification.linkUrl && (
                      <Link
                        href={notification.linkUrl}
                        className="mt-1 inline-block text-xs font-semibold text-orange-700 hover:underline"
                      >
                        View
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-3 text-base font-semibold">Conversations</h2>
            {conversations.length === 0 ? (
              <p className="text-sm text-[#8A857C]">No conversations yet.</p>
            ) : (
              <ul className="space-y-2">
                {conversations.map((conversation) => (
                  <li key={conversation.id}>
                    <Link
                      href={`/client/projects/${conversation.projectId}`}
                      className="flex items-start justify-between gap-2 rounded-2xl bg-[#F6F5F0] px-4 py-3 hover:bg-orange-50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{conversation.project.name}</p>
                        <p className="mt-0.5 truncate text-xs text-[#8A857C]">
                          {conversation.messages[0]?.body ?? 'No messages yet'}
                        </p>
                      </div>
                      {conversation.unread > 0 && (
                        <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          {conversation.unread}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-[28px] border border-[#141414]/10 bg-white/70 p-6 backdrop-blur-xl">
            <h2 className="mb-2 text-base font-semibold">Meetings</h2>
            <p className="text-sm text-[#5C5A55]">
              {pendingMeeting
                ? `Your meeting request from ${dateFmt.format(pendingMeeting.createdAt)} is pending review. You can request another once the team has responded.`
                : 'Need to talk something through? Request a meeting from any project page.'}
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
