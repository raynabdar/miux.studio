import type { Metadata } from 'next'
import Link from 'next/link'
import { requireFounder } from '@/lib/auth/session'
import { getAdminOverview } from '@/lib/admin/queries'
import SignOutButton from '@/components/portal/sign-out-button'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin — Miux Studio',
  robots: { index: false, follow: false },
}

const STATUS_LABEL: Record<string, string> = {
  pending_verification: 'Pending',
  active: 'Active',
  suspended: 'Suspended',
}

export default async function AdminPage() {
  await requireFounder()
  const { clients, activeClients, pendingRequests, projects, submissions, latestClients } =
    await getAdminOverview()

  const stats = [
    { label: 'Clients', value: clients },
    { label: 'Active clients', value: activeClients },
    { label: 'Pending meeting requests', value: pendingRequests },
    { label: 'Projects', value: projects },
    { label: 'New submissions', value: submissions },
  ]

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A857C]">
            Administration
          </p>
          <h1 className="mt-1 text-2xl tracking-tight sm:text-3xl">Studio admin</h1>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <Link href="/admin/meetings" className="rounded-full border border-[#141414]/15 bg-white px-4 py-2 hover:border-orange-500/50">
            Meetings
          </Link>
          <Link href="/admin/submissions" className="rounded-full border border-[#141414]/15 bg-white px-4 py-2 hover:border-orange-500/50">
            Submissions
          </Link>
          <Link href="/admin/audit" className="rounded-full border border-[#141414]/15 bg-white px-4 py-2 hover:border-orange-500/50">
            Audit log
          </Link>
          <Link href="/founder" className="rounded-full border border-[#141414]/15 bg-white px-4 py-2 hover:border-orange-500/50">
            Founder settings
          </Link>
          <SignOutButton />
        </div>
      </header>

      <div className="mb-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[#141414]/10 bg-white/70 px-4 py-3 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A857C]">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 text-base font-semibold">Clients</h2>
      {latestClients.length === 0 ? (
        <p className="text-sm text-[#8A857C]">No client accounts yet.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {latestClients.map((client) => (
            <li key={client.clerkId}>
              <Link
                href={`/admin/clients/${client.clerkId}`}
                className="block rounded-[24px] border border-[#141414]/10 bg-white/70 p-5 backdrop-blur-xl transition-colors hover:border-orange-500/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {client.fullName ?? client.email}
                    </p>
                    <p className="truncate text-xs text-[#8A857C]">
                      {client.company ?? client.email}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#F6F5F0] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#5C5A55]">
                    {STATUS_LABEL[client.status] ?? client.status}
                  </span>
                </div>
                <p className="mt-3 text-xs text-[#5C5A55]">
                  {client._count.projects} project{client._count.projects === 1 ? '' : 's'}
                  {client.isDemo ? ' · demo' : ''}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
