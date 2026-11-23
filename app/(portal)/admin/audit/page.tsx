import type { Metadata } from 'next'
import Link from 'next/link'
import { requireFounder } from '@/lib/auth/session'
import { listAuditLogs } from '@/lib/admin/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Audit log — Miux Studio Admin',
  robots: { index: false, follow: false },
}

const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export default async function AdminAuditPage() {
  await requireFounder()
  const entries = await listAuditLogs()

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <nav className="mb-6 text-xs text-[#8A857C]">
        <Link href="/admin" className="hover:text-orange-700">
          Admin
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#5C5A55]">Audit log</span>
      </nav>
      <h1 className="mb-2 text-2xl tracking-tight sm:text-3xl">Audit log</h1>
      <p className="mb-6 text-sm text-[#5C5A55]">
        Append-only records. Updates and deletes are blocked at the database level.
      </p>

      {entries.length === 0 ? (
        <p className="text-sm text-[#8A857C]">No audit entries yet.</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id.toString()} className="rounded-2xl border border-[#141414]/10 bg-white/70 px-4 py-3 backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">{entry.action}</p>
                <p className="text-[11px] text-[#8A857C]">{dateFmt.format(entry.createdAt)}</p>
              </div>
              <p className="mt-1 text-xs text-[#5C5A55]">
                {entry.actorRole}
                {entry.actorClerkId ? ` · ${entry.actorClerkId}` : ''} · {entry.targetType}
                {entry.targetId ? ` · ${entry.targetId}` : ''}
              </p>
              {entry.metadata && (
                <pre className="mt-2 overflow-x-auto rounded-xl bg-[#F6F5F0] px-3 py-2 text-[11px] text-[#5C5A55]">
                  {JSON.stringify(entry.metadata)}
                </pre>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
