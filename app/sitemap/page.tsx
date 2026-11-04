import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar, Footer } from '@/components/site-shell'
import { ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sitemap | MIUX STUDIO',
  description: 'Overview and site architecture of MIUX STUDIO pages, case studies, client services, and legal documentation.',
  alternates: {
    canonical: '/sitemap',
  },
}

const SITEMAP_GROUPS = [
  {
    title: 'Primary Pages',
    links: [
      { label: 'Homepage', href: '/', description: 'Websites for brands and digital businesses' },
      { label: 'About Us', href: '/#about', description: '#1 premier creative agency in Bangladesh' },
      { label: 'Work & Portfolio', href: '/#work', description: 'Selected case studies and digital products' },
      { label: 'Pricing & Retainers', href: '/#pricing', description: 'Starter, Business, and Enterprise plans' },
      { label: 'Client Endorsements', href: '/#testimonials', description: 'Leader reviews and conversion results' },
      { label: 'Frequently Asked Questions', href: '/#faq', description: 'Answers regarding sprints, tech stack, and scope' },
      { label: 'Book a 45-min Call', href: '/meeting', description: 'Direct Cal.com strategy consultation' },
      { label: 'Contact & Enquiries', href: '/contact', description: 'General enquiries and project briefs' },
      { label: 'Client Onboarding', href: '/onboarding', description: 'New project kickoff and asset handoff' },
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
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />

      <main className="px-5 pb-28 pt-36 sm:pt-44">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#707070]">
            Architecture &amp; Index
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">
            Sitemap
          </h1>
          <p className="mt-4 text-base text-[#A3A3A3] max-w-xl leading-relaxed">
            Quick directory to explore all pages, case studies, service categories, and legal governance across MIUX STUDIO.
          </p>

          <div className="mt-14 space-y-12">
            {SITEMAP_GROUPS.map((group) => (
              <section key={group.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#707070] mb-6">
                  {group.title}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {group.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="group flex flex-col justify-between rounded-xl border border-white/[0.06] bg-[#171717] p-4 transition-all duration-200 hover:border-orange-500/40 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white group-hover:text-orange-400 transition-colors">
                          {link.label}
                        </span>
                        <ArrowUpRight className="size-4 text-[#707070] group-hover:text-orange-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>
                      <p className="mt-2 text-xs text-[#A3A3A3] leading-relaxed">
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
