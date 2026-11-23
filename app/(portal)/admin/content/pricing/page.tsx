import type { Metadata } from 'next'
import Link from 'next/link'
import { requireFounder } from '@/lib/auth/session'
import { getDb } from '@/lib/db/client'
import {
  deletePricingPlan,
  movePricingPlan,
  recommendPricingPlan,
  savePricingPlan,
  togglePricingPlan,
} from '../actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Pricing — Miux Studio Admin',
  robots: { index: false, follow: false },
}

const input = 'mt-1 block w-full rounded-xl border border-[#141414]/15 bg-white px-3 py-2 text-sm'
const small = 'rounded-full border border-[#141414]/15 bg-white px-3 py-1 text-xs font-semibold'

export default async function AdminPricingPage() {
  await requireFounder()
  const rows = await getDb().pricingPlan.findMany({ orderBy: { position: 'asc' } })

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
      <nav className="mb-6 text-xs text-[#8A857C]">
        <Link href="/admin/content" className="hover:text-orange-700">Content</Link>
        <span className="mx-2">/</span>
        <span className="text-[#5C5A55]">Pricing</span>
      </nav>
      <h1 className="mb-2 text-2xl tracking-tight sm:text-3xl">Pricing plans</h1>
      <p className="mb-6 text-xs text-[#8A857C]">
        The custom-plan card is fixed in the site layout and is not managed here.
      </p>

      <ul className="space-y-3">
        {rows.map((row, index) => (
          <li key={row.id} className="rounded-2xl border border-[#141414]/10 bg-white/70 p-4">
            <form action={savePricingPlan} className="grid gap-2 sm:grid-cols-2">
              <input type="hidden" name="id" value={row.id} />
              <label className="text-xs text-[#5C5A55]">Plan name
                <input name="name" defaultValue={row.name} className={input} required />
              </label>
              <label className="text-xs text-[#5C5A55]">Price (BDT/month)
                <input name="price" type="number" min={0} defaultValue={row.price} className={input} required />
              </label>
              <label className="text-xs text-[#5C5A55] sm:col-span-2">Description
                <input name="description" defaultValue={row.description} className={input} required />
              </label>
              <label className="text-xs text-[#5C5A55]">Features (one per line)
                <textarea name="features" defaultValue={row.features.join('\n')} rows={4} className={input} />
              </label>
              <label className="text-xs text-[#5C5A55]">Includes (one per line)
                <textarea name="includes" defaultValue={row.includes.join('\n')} rows={4} className={input} />
              </label>
              <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
                <button type="submit" className="rounded-full bg-[#141414] px-4 py-2 text-xs font-semibold text-[#F6F5F0]">Save</button>
                {row.recommended && <span className="text-[11px] font-semibold text-orange-700">Recommended</span>}
                <span className="text-[11px] text-[#8A857C]">{row.visible ? 'Visible' : 'Hidden'}</span>
              </div>
            </form>
            <div className="mt-2 flex flex-wrap gap-2">
              <form action={movePricingPlan}>
                <input type="hidden" name="id" value={row.id} />
                <input type="hidden" name="direction" value="up" />
                <button type="submit" disabled={index === 0} className={small}>↑</button>
              </form>
              <form action={movePricingPlan}>
                <input type="hidden" name="id" value={row.id} />
                <input type="hidden" name="direction" value="down" />
                <button type="submit" disabled={index === rows.length - 1} className={small}>↓</button>
              </form>
              <form action={togglePricingPlan}>
                <input type="hidden" name="id" value={row.id} />
                <button type="submit" className={small}>{row.visible ? 'Hide' : 'Show'}</button>
              </form>
              <form action={recommendPricingPlan}>
                <input type="hidden" name="id" value={row.id} />
                <button type="submit" className={small}>Recommend</button>
              </form>
              <form action={deletePricingPlan}>
                <input type="hidden" name="id" value={row.id} />
                <button type="submit" className={small}>Delete</button>
              </form>
            </div>
          </li>
        ))}
        {rows.length === 0 && <li className="text-sm text-[#8A857C]">No rows yet — the site shows the built-in plans.</li>}
      </ul>

      <section className="mt-8 rounded-2xl border border-[#141414]/10 bg-white/70 p-4">
        <h2 className="mb-3 text-sm font-semibold">Add a plan</h2>
        <form action={savePricingPlan} className="grid gap-2 sm:grid-cols-2">
          <label className="text-xs text-[#5C5A55]">Plan name
            <input name="name" className={input} required />
          </label>
          <label className="text-xs text-[#5C5A55]">Price (BDT/month)
            <input name="price" type="number" min={0} className={input} required />
          </label>
          <label className="text-xs text-[#5C5A55] sm:col-span-2">Description
            <input name="description" className={input} required />
          </label>
          <label className="text-xs text-[#5C5A55]">Features (one per line)
            <textarea name="features" rows={3} className={input} />
          </label>
          <label className="text-xs text-[#5C5A55]">Includes (one per line)
            <textarea name="includes" rows={3} className={input} />
          </label>
          <button type="submit" className="w-fit rounded-full bg-[#141414] px-4 py-2 text-xs font-semibold text-[#F6F5F0] sm:col-span-2">Add</button>
        </form>
      </section>
    </main>
  )
}
