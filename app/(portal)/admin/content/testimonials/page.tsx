import type { Metadata } from 'next'
import Link from 'next/link'
import { requireFounder } from '@/lib/auth/session'
import { getDb } from '@/lib/db/client'
import { deleteTestimonial, moveTestimonial, saveTestimonial, toggleTestimonial } from '../actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Testimonials — Miux Studio Admin',
  robots: { index: false, follow: false },
}

const input = 'mt-1 block w-full rounded-xl border border-[#141414]/15 bg-white px-3 py-2 text-sm'
const small = 'rounded-full border border-[#141414]/15 bg-white px-3 py-1 text-xs font-semibold'

function fields(row?: {
  id: string
  quote: string
  author: string
  role: string
  company: string
  websiteUrl: string | null
}) {
  return (
    <>
      {row && <input type="hidden" name="id" value={row.id} />}
      <label className="text-xs text-[#5C5A55] sm:col-span-2">Quote
        <textarea name="quote" defaultValue={row?.quote ?? ''} rows={3} className={input} required />
      </label>
      <label className="text-xs text-[#5C5A55]">Author
        <input name="author" defaultValue={row?.author ?? ''} className={input} required />
      </label>
      <label className="text-xs text-[#5C5A55]">Role
        <input name="role" defaultValue={row?.role ?? ''} className={input} />
      </label>
      <label className="text-xs text-[#5C5A55]">Company
        <input name="company" defaultValue={row?.company ?? ''} className={input} />
      </label>
      <label className="text-xs text-[#5C5A55]">Website
        <input name="websiteUrl" type="url" defaultValue={row?.websiteUrl ?? ''} placeholder="https://" className={input} />
      </label>
    </>
  )
}

export default async function AdminTestimonialsPage() {
  await requireFounder()
  const rows = await getDb().testimonial.findMany({ orderBy: { position: 'asc' } })

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
      <nav className="mb-6 text-xs text-[#8A857C]">
        <Link href="/admin/content" className="hover:text-orange-700">Content</Link>
        <span className="mx-2">/</span>
        <span className="text-[#5C5A55]">Testimonials</span>
      </nav>
      <h1 className="mb-6 text-2xl tracking-tight sm:text-3xl">Testimonials</h1>

      <ul className="space-y-3">
        {rows.map((row, index) => (
          <li key={row.id} className="rounded-2xl border border-[#141414]/10 bg-white/70 p-4">
            <form action={saveTestimonial} className="grid gap-2 sm:grid-cols-2">
              {fields(row)}
              <div className="flex items-center gap-2 sm:col-span-2">
                <button type="submit" className="rounded-full bg-[#141414] px-4 py-2 text-xs font-semibold text-[#F6F5F0]">Save</button>
                <span className="text-[11px] text-[#8A857C]">{row.visible ? 'Visible' : 'Hidden'}</span>
              </div>
            </form>
            <div className="mt-2 flex gap-2">
              <form action={moveTestimonial}>
                <input type="hidden" name="id" value={row.id} />
                <input type="hidden" name="direction" value="up" />
                <button type="submit" disabled={index === 0} className={small}>↑</button>
              </form>
              <form action={moveTestimonial}>
                <input type="hidden" name="id" value={row.id} />
                <input type="hidden" name="direction" value="down" />
                <button type="submit" disabled={index === rows.length - 1} className={small}>↓</button>
              </form>
              <form action={toggleTestimonial}>
                <input type="hidden" name="id" value={row.id} />
                <button type="submit" className={small}>{row.visible ? 'Hide' : 'Show'}</button>
              </form>
              <form action={deleteTestimonial}>
                <input type="hidden" name="id" value={row.id} />
                <button type="submit" className={small}>Delete</button>
              </form>
            </div>
          </li>
        ))}
        {rows.length === 0 && <li className="text-sm text-[#8A857C]">No rows yet — the site shows the built-in testimonials.</li>}
      </ul>

      <section className="mt-8 rounded-2xl border border-[#141414]/10 bg-white/70 p-4">
        <h2 className="mb-3 text-sm font-semibold">Add a testimonial</h2>
        <form action={saveTestimonial} className="grid gap-2 sm:grid-cols-2">
          {fields()}
          <button type="submit" className="w-fit rounded-full bg-[#141414] px-4 py-2 text-xs font-semibold text-[#F6F5F0] sm:col-span-2">Add</button>
        </form>
      </section>
    </main>
  )
}
