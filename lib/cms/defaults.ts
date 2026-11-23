import { SITE, SOCIAL_LINKS, blogPosts } from '@/lib/data'
import { startupEntries } from '@/lib/startups'
import { testimonials } from '@/lib/testimonials'

// Static fallbacks used when the database is unavailable or a table is empty.
// They mirror the content that shipped before the CMS so the site looks
// identical until the owner edits something.

export type SocialEntry = { label: string; href: string }

export type SiteContact = {
  email: string
  phone: string
  phoneTel: string
  responseTime: string
  regionalScope: string
}

export type PublicPlan = {
  name: string
  price: number
  yearlyPrice: number
  description: string
  features: string[]
  includes: string[]
  recommended: boolean
}

export type PublicTestimonial = {
  quote: string
  author: string
  role: string
  company: string
  websiteUrl: string | null
}

export type PublicStartup = {
  id: string
  name: string
  logoUrl: string | null
  websiteUrl: string | null
  description: string
  sector: string
  region: string
  service: string
  slug: string | null
}

export type ContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; url: string; alt: string }
  | { type: 'quote'; text: string; cite: string }
  | { type: 'code'; code: string; language: string }
  | { type: 'ordered-list'; items: string[] }
  | { type: 'unordered-list'; items: string[] }

export type PublicPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  image: string
  readTime: string
  author: { name: string; role: string }
  date: string
  blocks: ContentBlock[]
  seoTitle?: string | null
  seoDescription?: string | null
}

export const ANNUAL_DISCOUNT = 0.2
const annual = (monthly: number) => Math.round(monthly * (1 - ANNUAL_DISCOUNT))

export const DEFAULT_SITE_CONTACT: SiteContact = {
  email: SITE.email,
  phone: SITE.phone,
  phoneTel: SITE.phoneTel,
  responseTime: 'Within 24 hours',
  regionalScope: SITE.scopeLabel,
}

export const DEFAULT_SOCIAL: SocialEntry[] = SOCIAL_LINKS.map((link) => ({
  label: link.label,
  href: link.href,
}))

export const DEFAULT_PLANS: PublicPlan[] = [
  {
    name: 'Starter',
    price: 2400,
    yearlyPrice: annual(2400),
    description: 'Brand identity and modern web build for emerging businesses ready to launch fast.',
    features: [
      'Brand Identity & Design System',
      'Responsive Next.js Architecture',
      'Core SEO & Speed Optimization',
    ],
    includes: [
      'Starter includes:',
      'Custom brand system & UI kit',
      'Full responsive web build',
      'Analytics & performance tuning',
      'Direct senior partner lead',
      '30-day post-launch support',
    ],
    recommended: false,
  },
  {
    name: 'Growth',
    price: 4800,
    yearlyPrice: annual(4800),
    description: 'Full-scale web platform engineered to drive conversions, motion, and sustained growth.',
    features: [
      'Full Brand & Web Application',
      'Custom CMS & API Integrations',
      'Conversion Optimization & Motion',
    ],
    includes: [
      'Everything in Starter, plus:',
      'Multi-page custom platform',
      'Interactive motion design',
      'CRO & funnel setup',
      'Campaign assets & templates',
      'Bi-weekly strategic reviews',
    ],
    recommended: true,
  },
  {
    name: 'Enterprise',
    price: 8900,
    yearlyPrice: annual(8900),
    description: 'Dedicated design and engineering squad with priority SLA for category leaders.',
    features: ['Dedicated Product Team', 'Custom Software Engineering', '24/7 Priority SLA & Support'],
    includes: [
      'Everything in Growth, plus:',
      'Custom application build',
      'Multi-region localization',
      '24/7 priority SLA support',
      'Continuous sprint iteration',
      'Private studio Slack channel',
    ],
    recommended: false,
  },
]

export const DEFAULT_TESTIMONIALS: PublicTestimonial[] = testimonials.map((item) => ({
  quote: item.quote,
  author: item.name,
  role: item.role,
  company: item.company,
  websiteUrl: item.website,
}))

export const DEFAULT_STARTUPS: PublicStartup[] = startupEntries.map((entry, index) => ({
  id: entry.id,
  name: entry.name,
  logoUrl: null,
  websiteUrl: entry.slug ? `${SITE.url}/work/${entry.slug}` : null,
  description: entry.note,
  sector: entry.sector,
  region: entry.region,
  service: entry.service,
  slug: entry.slug ?? null,
  position: index,
}))

export const DEFAULT_POSTS: PublicPost[] = blogPosts.map((post) => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  category: post.category,
  image: post.image,
  readTime: post.readTime,
  author: post.author,
  date: post.date,
  blocks: post.content.flatMap((section) => [
    { type: 'heading' as const, text: section.heading },
    { type: 'paragraph' as const, text: section.body },
  ]),
  seoTitle: null,
  seoDescription: null,
}))
