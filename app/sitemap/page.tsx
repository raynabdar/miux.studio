import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar, Footer } from '@/components/site-shell'
import { ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sitemap | Miux Studio',
  description: 'Index of Miux Studio pages, selected work, services, and legal documentation.',
  alternates: {
    canonical: '/sitemap',
  },
}

const SITEMAP_GROUPS = [
  {
    title: 'Primary Pages',
    links: [
      { label: 'Homepage', href: '/', description: 'Websites for brands and digital businesses' },
      { label: 'About Us', href: '/#about', description: 'A design and engineering studio based in Bangladesh' },
      { label: 'Work & Portfolio', href: '/work', description: 'Selected case studies and digital products' },
      { label: 'Startups & Businesses', href: '/startups', description: 'Roster of 48+ startups and businesses we have worked with' },
      { label: 'Pricing & Retainers', href: '/#pricing', description: 'Starter, Growth, and Enterprise plans' },
      { label: 'Client Endorsements', href: '/#testimonials', description: 'Leader reviews and conversion results' },
      { label: 'Frequently Asked Questions', href: '/#faq', description: 'Answers regarding sprints, tech stack, and scope' },
      { label: 'Book a 45-min Call', href: '/meeting', description: 'Direct Cal.com strategy consultation' },
      { label: 'Free Website Teardown', href: '/teardown', description: 'Five-point written review of your live site within two working days' },
      { label: 'Contact & Enquiries', href: '/contact', description: 'General enquiries and project briefs' },
      { label: 'Journal', href: '/blogs', description: 'Notes on design systems, conversion, and brand strategy' },
    ],
  },
  {
    title: 'Services & Capabilities',
    links: [
      { label: 'Brand Design and Identity', href: '/#pricing', description: 'Visual identities, typography, brand systems' },
      { label: 'Web Design', href: '/#work', description: 'Art direction, interactive prototypes, high-conversion layouts' },
      { label: 'Web Development', href: '/#work', description: 'Next.js, React 19, Tailwind CSS, TypeScript architecture' },
      { label: 'UI/UX Design', href: '/#work', description: 'Design systems, dashboards, mobile-first SaaS products' },
      { label: 'Ads and Marketing Campaigns', href: '/#pricing', description: 'Creative direction, social media collateral, landing funnels' },
    ],
  },
  {
    title: 'Governance & Others',
    links: [
      { label: 'Client Terms', href: '/client-terms', description: 'Sprint governance, milestone payments, and IP transfer' },
      { label: 'Privacy Policy', href: '/privacy-policy', description: 'Data protection, confidentiality, and cookie transparency' },
      { label: 'Terms of Service', href: '/terms', description: 'General website terms and contractual conditions' },
      { label: 'XML Sitemap', href: '/sitemap.xml', description: 'Machine-readable search engine index' },
    ],
  },
]

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-[#F6F5F0] text-[#141414]">
      <Navbar />

      <main className="relative px-5 pb-28 pt-36 sm:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[400px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.1)_0%,transparent_70%)] blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#78756E]">
            Architecture &amp; Index
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#141414] sm:text-6xl">
            Sitemap
          </h1>
          <p className="mt-4 text-base text-[#5C5A55] max-w-xl leading-relaxed">
            A quick directory of every page, service area, and legal document on the site.
          </p>

          <div className="mt-14 space-y-12">
            {SITEMAP_GROUPS.map((group) => (
              <section key={group.title} className="rounded-2xl border border-[#141414]/[0.10] bg-white/80 p-6 sm:p-8 shadow-sm backdrop-blur-xl">
                <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
                  {group.title}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {group.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="group flex flex-col justify-between rounded-xl border border-[#141414]/[0.08] bg-[#F6F5F0]/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500/50 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#141414] group-hover:text-orange-600 transition-colors">
                          {link.label}
                        </span>
                        <ArrowUpRight className="size-4 text-[#78756E] group-hover:text-orange-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>
                      <p className="mt-2 text-xs text-[#5C5A55] leading-relaxed">
                        {link.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
