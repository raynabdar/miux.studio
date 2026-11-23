import type { Metadata } from 'next'
import Link from 'next/link'
import { requireFounder } from '@/lib/auth/session'
import { getDb } from '@/lib/db/client'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Content — Miux Studio Admin',
  robots: { index: false, follow: false },
}

const SECTIONS = [
  { href: '/admin/content/social', label: 'Social links', key: 'social' },
  { href: '/admin/content/contact', label: 'Contact information', key: 'contact' },
  { href: '/admin/content/startups', label: 'Startups & partners', key: 'startups' },
  { href: '/admin/content/testimonials', label: 'Testimonials', key: 'testimonials' },
  { href: '/admin/content/pricing', label: 'Pricing', key: 'pricing' },
  { href: '/admin/content/discounts', label: 'Discount announcements', key: 'discounts' },
  { href: '/admin/content/blog', label: 'Blog', key: 'blog' },
] as const

export default async function AdminContentPage() {
  await requireFounder()
  const db = getDb()
  const [social, startups, testimonials, plans, discounts, posts] = await Promise.all([
    db.socialLink.count(),
    db.startup.count(),
    db.testimonial.count(),
    db.pricingPlan.count(),
    db.discountAnnouncement.count(),
    db.blogPostCms.count(),
  ])
  const counts: Record<string, number> = {
    social,
    contact: 1,
    startups,
    testimonials,
    pricing: plans,
    discounts,
    blog: posts,
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <nav className="mb-6 text-xs text-[#8A857C]">
        <Link href="/admin" className="hover:text-orange-700">
          Admin
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#5C5A55]">Content</span>
      </nav>
      <h1 className="mb-2 text-2xl tracking-tight sm:text-3xl">Site content</h1>
      <p className="mb-8 text-sm text-[#5C5A55]">
        Saved changes revalidate the tagged caches and appear on the live site without a deployment.
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <li key={section.href}>
            <Link
              href={section.href}
              className="flex items-center justify-between rounded-[24px] border border-[#141414]/10 bg-white/70 px-5 py-4 backdrop-blur-xl hover:border-orange-500/40"
            >
              <span className="text-sm font-semibold">{section.label}</span>
              <span className="text-xs text-[#8A857C]">{counts[section.key]} rows</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
