import type { Metadata } from 'next'
import Link from 'next/link'
import { requireFounder } from '@/lib/auth/session'
import { getDb } from '@/lib/db/client'
import { isDiscountActive } from '@/lib/cms/validation'
import { deleteDiscount, saveDiscount, toggleDiscount } from '../actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Discounts — Miux Studio Admin',
  robots: { index: false, follow: false },
}

const input = 'mt-1 block w-full rounded-xl border border-[#141414]/15 bg-white px-3 py-2 text-sm'
const small = 'rounded-full border border-[#141414]/15 bg-white px-3 py-1 text-xs font-semibold'

const toLocal = (date: Date | null) => (date ? date.toISOString().slice(0, 16) : '')

export default async function AdminDiscountsPage() {
  await requireFounder()
  const rows = await getDb().discountAnnouncement.findMany({ orderBy: { startsAt: 'desc' } })

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
      <nav className="mb-6 text-xs text-[#8A857C]">
        <Link href="/admin/content" className="hover:text-orange-700">Content</Link>
        <span className="mx-2">/</span>
        <span className="text-[#5C5A55]">Discounts</span>
      </nav>
      <h1 className="mb-2 text-2xl tracking-tight sm:text-3xl">Discount announcements</h1>
      <p className="mb-6 text-xs text-[#8A857C]">
        The banner only appears on the site while an announcement is active and inside its date range.
      </p>

      <ul className="space-y-3">
        {rows.map((row) => (
          <li key={row.id} className="rounded-2xl border border-[#141414]/10 bg-white/70 p-4">
            <form action={saveDiscount} className="grid gap-2 sm:grid-cols-2">
              <input type="hidden" name="id" value={row.id} />
              <label className="text-xs text-[#5C5A55]">Title
                <input name="title" defaultValue={row.title} className={input} required />
              </label>
              <label className="text-xs text-[#5C5A55]">Amount / percentage
                <input name="amount" defaultValue={row.amount} placeholder="20%" className={input} required />
              </label>
              <label className="text-xs text-[#5C5A55] sm:col-span-2">Message
                <input name="message" defaultValue={row.message} className={input} required />
              </label>
              <label className="text-xs text-[#5C5A55]">Starts
                <input name="startsAt" type="datetime-local" defaultValue={toLocal(row.startsAt)} className={input} required />
              </label>
              <label className="text-xs text-[#5C5A55]">Ends
                <input name="endsAt" type="datetime-local" defaultValue={toLocal(row.endsAt)} className={input} required />
              </label>
              <label className="flex items-center gap-2 text-xs text-[#5C5A55] sm:col-span-2">
                <input type="checkbox" name="active" defaultChecked={row.active} className="h-4 w-4 accent-orange-600" />
                Enabled
              </label>
              <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
                <button type="submit" className="rounded-full bg-[#141414] px-4 py-2 text-xs font-semibold text-[#F6F5F0]">Save</button>
                <span className="text-[11px] text-[#8A857C]">
                  {isDiscountActive(row) ? 'Live now' : row.active ? 'Scheduled / expired' : 'Disabled'}
                </span>
              </div>
            </form>
            <div className="mt-2 flex gap-2">
              <form action={toggleDiscount}>
                <input type="hidden" name="id" value={row.id} />
                <button type="submit" className={small}>{row.active ? 'Disable' : 'Enable'}</button>
              </form>
              <form action={deleteDiscount}>
                <input type="hidden" name="id" value={row.id} />
                <button type="submit" className={small}>Delete</button>
              </form>
            </div>
          </li>
        ))}
        {rows.length === 0 && <li className="text-sm text-[#8A857C]">No announcements yet.</li>}
      </ul>

      <section className="mt-8 rounded-2xl border border-[#141414]/10 bg-white/70 p-4">
        <h2 className="mb-3 text-sm font-semibold">Add an announcement</h2>
        <form action={saveDiscount} className="grid gap-2 sm:grid-cols-2">
          <label className="text-xs text-[#5C5A55]">Title
            <input name="title" className={input} required />
          </label>
          <label className="text-xs text-[#5C5A55]">Amount / percentage
            <input name="amount" placeholder="20%" className={input} required />
          </label>
          <label className="text-xs text-[#5C5A55] sm:col-span-2">Message
            <input name="message" className={input} required />
          </label>
          <label className="text-xs text-[#5C5A55]">Starts
            <input name="startsAt" type="datetime-local" className={input} required />
          </label>
          <label className="text-xs text-[#5C5A55]">Ends
            <input name="endsAt" type="datetime-local" className={input} required />
          </label>
          <label className="flex items-center gap-2 text-xs text-[#5C5A55] sm:col-span-2">
            <input type="checkbox" name="active" className="h-4 w-4 accent-orange-600" />
            Enabled
          </label>
          <button type="submit" className="w-fit rounded-full bg-[#141414] px-4 py-2 text-xs font-semibold text-[#F6F5F0] sm:col-span-2">Add</button>
        </form>
      </section>
    </main>
  )
}
