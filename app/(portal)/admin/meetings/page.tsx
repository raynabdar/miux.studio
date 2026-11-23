import type { Metadata } from 'next'
import Link from 'next/link'
import { requireFounder } from '@/lib/auth/session'
import { listMeetingRequests } from '@/lib/admin/queries'
import { markMeetingSeenAdmin } from '../actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Meeting requests — Miux Studio Admin',
  robots: { index: false, follow: false },
}

const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export default async function AdminMeetingsPage() {
  await requireFounder()
  const requests = await listMeetingRequests()

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <nav className="mb-6 text-xs text-[#8A857C]">
        <Link href="/admin" className="hover:text-orange-700">
          Admin
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#5C5A55]">Meeting requests</span>
      </nav>
      <h1 className="mb-6 text-2xl tracking-tight sm:text-3xl">Meeting requests</h1>

      {requests.length === 0 ? (
        <p className="text-sm text-[#8A857C]">No meeting requests yet.</p>
      ) : (
        <ul className="space-y-3">
          {requests.map((request) => (
            <li key={request.id} className="rounded-[24px] border border-[#141414]/10 bg-white/70 p-5 backdrop-blur-xl">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    {request.client.fullName ?? request.client.email}
                    {request.client.company ? ` · ${request.client.company}` : ''}
                  </p>
                  <p className="text-xs text-[#8A857C]">{request.client.email}</p>
                  <p className="mt-1 text-xs text-[#5C5A55]">
                    {dateFmt.format(request.createdAt)}
                    {request.project ? ` · ${request.project.name}` : ' · no project'}
                  </p>
                </div>
                <span className="rounded-full bg-[#F6F5F0] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#5C5A55]">
                  {request.status}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-[#3D3226]">{request.message}</p>
              {request.status === 'pending' && (
                <form action={markMeetingSeenAdmin} className="mt-3">
                  <input type="hidden" name="requestId" value={request.id} />
                  <button
                    type="submit"
                    className="rounded-full bg-[#141414] px-4 py-1.5 text-xs font-semibold text-[#F6F5F0]"
                  >
                    Mark as reviewed
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
