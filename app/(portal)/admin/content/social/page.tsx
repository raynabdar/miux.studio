import type { Metadata } from 'next'
import Link from 'next/link'
import { requireFounder } from '@/lib/auth/session'
import { getDb } from '@/lib/db/client'
import { addSocialLink, deleteSocialLink, moveSocialLink, updateSocialLink } from '../actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Social links — Miux Studio Admin',
  robots: { index: false, follow: false },
}

const input = 'rounded-xl border border-[#141414]/15 bg-white px-3 py-2 text-sm'
const small = 'rounded-full border border-[#141414]/15 bg-white px-3 py-1 text-xs font-semibold'

export default async function AdminSocialPage() {
  await requireFounder()
  const links = await getDb().socialLink.findMany({ orderBy: { position: 'asc' } })

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
      <nav className="mb-6 text-xs text-[#8A857C]">
        <Link href="/admin/content" className="hover:text-orange-700">Content</Link>
        <span className="mx-2">/</span>
        <span className="text-[#5C5A55]">Social links</span>
      </nav>
      <h1 className="mb-6 text-2xl tracking-tight sm:text-3xl">Social links</h1>

      <ul className="space-y-3">
        {links.map((link, index) => (
          <li key={link.id} className="rounded-2xl border border-[#141414]/10 bg-white/70 p-4">
            <form action={updateSocialLink} className="flex flex-wrap items-end gap-2">
              <input type="hidden" name="id" value={link.id} />
              <label className="text-xs text-[#5C5A55]">Label
                <input name="label" defaultValue={link.label} className={`mt-1 block w-32 ${input}`} required />
              </label>
              <label className="min-w-0 flex-1 text-xs text-[#5C5A55]">URL
                <input name="url" defaultValue={link.url} type="url" className={`mt-1 block w-full ${input}`} required />
              </label>
              <button type="submit" className={small}>Save</button>
            </form>
            <div className="mt-2 flex gap-2">
              <form action={moveSocialLink}>
                <input type="hidden" name="id" value={link.id} />
                <input type="hidden" name="direction" value="up" />
                <button type="submit" disabled={index === 0} className={small}>↑</button>
              </form>
              <form action={moveSocialLink}>
                <input type="hidden" name="id" value={link.id} />
                <input type="hidden" name="direction" value="down" />
                <button type="submit" disabled={index === links.length - 1} className={small}>↓</button>
              </form>
              <form action={deleteSocialLink}>
                <input type="hidden" name="id" value={link.id} />
                <button type="submit" className={small}>Delete</button>
              </form>
            </div>
          </li>
        ))}
        {links.length === 0 && <li className="text-sm text-[#8A857C]">No rows yet — the site shows the built-in links.</li>}
      </ul>

      <section className="mt-8 rounded-2xl border border-[#141414]/10 bg-white/70 p-4">
        <h2 className="mb-3 text-sm font-semibold">Add a link</h2>
        <form action={addSocialLink} className="flex flex-wrap items-end gap-2">
          <label className="text-xs text-[#5C5A55]">Label
            <input name="label" className={`mt-1 block w-32 ${input}`} required />
          </label>
          <label className="min-w-0 flex-1 text-xs text-[#5C5A55]">URL
            <input name="url" type="url" placeholder="https://" className={`mt-1 block w-full ${input}`} required />
          </label>
          <button type="submit" className="rounded-full bg-[#141414] px-4 py-2 text-xs font-semibold text-[#F6F5F0]">Add</button>
        </form>
      </section>
    </main>
  )
}
