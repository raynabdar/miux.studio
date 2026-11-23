import type { Metadata } from 'next'
import Link from 'next/link'
import { requireFounder } from '@/lib/auth/session'
import { getDb } from '@/lib/db/client'
import { DEFAULT_SITE_CONTACT } from '@/lib/cms/defaults'
import { saveSiteContact } from '../actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contact information — Miux Studio Admin',
  robots: { index: false, follow: false },
}

const input = 'mt-1 block w-full rounded-xl border border-[#141414]/15 bg-white px-3 py-2 text-sm'

export default async function AdminContactPage() {
  await requireFounder()
  const row = await getDb().siteSettings.findUnique({ where: { id: 1 } })
  const defaults = {
    email: row?.email || DEFAULT_SITE_CONTACT.email,
    phone: row?.phone || DEFAULT_SITE_CONTACT.phone,
    responseTime: row?.responseTime || DEFAULT_SITE_CONTACT.responseTime,
    regionalScope: row?.regionalScope || DEFAULT_SITE_CONTACT.regionalScope,
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      <nav className="mb-6 text-xs text-[#8A857C]">
        <Link href="/admin/content" className="hover:text-orange-700">Content</Link>
        <span className="mx-2">/</span>
        <span className="text-[#5C5A55]">Contact</span>
      </nav>
      <h1 className="mb-6 text-2xl tracking-tight sm:text-3xl">Contact information</h1>

      <form action={saveSiteContact} className="space-y-3 rounded-[24px] border border-[#141414]/10 bg-white/70 p-6">
        <label className="block text-xs text-[#5C5A55]">Email
          <input name="email" type="email" defaultValue={defaults.email} className={input} required />
        </label>
        <label className="block text-xs text-[#5C5A55]">Phone
          <input name="phone" defaultValue={defaults.phone} className={input} />
        </label>
        <label className="block text-xs text-[#5C5A55]">Response time
          <input name="responseTime" defaultValue={defaults.responseTime} className={input} />
        </label>
        <label className="block text-xs text-[#5C5A55]">Regional scope
          <input name="regionalScope" defaultValue={defaults.regionalScope} className={input} />
        </label>
        <button type="submit" className="rounded-full bg-[#141414] px-5 py-2 text-xs font-semibold text-[#F6F5F0]">
          Save contact information
        </button>
      </form>
    </main>
  )
}
