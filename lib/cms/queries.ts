import { unstable_cache } from 'next/cache'
import { getDb } from '@/lib/db/client'
import {
  DEFAULT_PLANS,
  DEFAULT_POSTS,
  DEFAULT_SITE_CONTACT,
  DEFAULT_SOCIAL,
  DEFAULT_STARTUPS,
  DEFAULT_TESTIMONIALS,
  ANNUAL_DISCOUNT,
  type ContentBlock,
  type PublicPlan,
  type PublicPost,
  type PublicStartup,
  type PublicTestimonial,
  type SiteContact,
  type SocialEntry,
} from './defaults'

export const CMS_TAGS = {
  contact: 'cms:contact',
  social: 'cms:social',
  startups: 'cms:startups',
  testimonials: 'cms:testimonials',
  pricing: 'cms:pricing',
  discounts: 'cms:discounts',
  blog: 'cms:blog',
} as const

async function readOrFallback<T>(read: () => Promise<T>, fallback: T): Promise<T> {
  if (!process.env.DATABASE_URL) return fallback
  try {
    return await read()
  } catch (error) {
    console.error('[cms] read failed; using static content', (error as Error).message)
    return fallback
  }
}

const annual = (monthly: number) => Math.round(monthly * (1 - ANNUAL_DISCOUNT))

export const getSiteContact = unstable_cache(
  () =>
    readOrFallback(async () => {
      const row = await getDb().siteSettings.findUnique({ where: { id: 1 } })
      if (!row?.email) return DEFAULT_SITE_CONTACT
      return {
        email: row.email,
        phone: row.phone || DEFAULT_SITE_CONTACT.phone,
        phoneTel: (row.phone || DEFAULT_SITE_CONTACT.phone).replace(/[^\d+]/g, ''),
        responseTime: row.responseTime || DEFAULT_SITE_CONTACT.responseTime,
        regionalScope: row.regionalScope || DEFAULT_SITE_CONTACT.regionalScope,
      } satisfies SiteContact
    }, DEFAULT_SITE_CONTACT),
  ['cms-site-contact'],
  { tags: [CMS_TAGS.contact] }
)

export const getSocialLinks = unstable_cache(
  () =>
    readOrFallback(async () => {
      const rows = await getDb().socialLink.findMany({ orderBy: { position: 'asc' } })
      if (rows.length === 0) return DEFAULT_SOCIAL
      return rows.map((row) => ({ label: row.label, href: row.url })) satisfies SocialEntry[]
    }, DEFAULT_SOCIAL),
  ['cms-social'],
  { tags: [CMS_TAGS.social] }
)

export const getStartups = unstable_cache(
  () =>
    readOrFallback(async () => {
      const rows = await getDb().startup.findMany({
        where: { visible: true },
        orderBy: { position: 'asc' },
      })
      if (rows.length === 0) return DEFAULT_STARTUPS
      return rows.map(
        (row) =>
          ({
            id: row.id,
            name: row.name,
            logoUrl: row.logoUrl,
            websiteUrl: row.websiteUrl,
            description: row.description,
            sector: row.sector,
            region: row.region,
            service: row.service,
            slug: row.slug,
          }) satisfies PublicStartup
      )
    }, DEFAULT_STARTUPS),
  ['cms-startups'],
  { tags: [CMS_TAGS.startups] }
)

export const getTestimonials = unstable_cache(
  () =>
    readOrFallback(async () => {
      const rows = await getDb().testimonial.findMany({
        where: { visible: true },
        orderBy: { position: 'asc' },
      })
      if (rows.length === 0) return DEFAULT_TESTIMONIALS
      return rows.map(
        (row) =>
          ({
            quote: row.quote,
            author: row.author,
            role: row.role,
            company: row.company,
            websiteUrl: row.websiteUrl,
          }) satisfies PublicTestimonial
      )
    }, DEFAULT_TESTIMONIALS),
  ['cms-testimonials'],
  { tags: [CMS_TAGS.testimonials] }
)

export const getPricingPlans = unstable_cache(
  () =>
    readOrFallback(async () => {
      const rows = await getDb().pricingPlan.findMany({
        where: { visible: true },
        orderBy: { position: 'asc' },
      })
      if (rows.length === 0) return DEFAULT_PLANS
      return rows.map(
        (row) =>
          ({
            name: row.name,
            price: row.price,
            yearlyPrice: annual(row.price),
            description: row.description,
            features: row.features,
            includes: row.includes,
            recommended: row.recommended,
          }) satisfies PublicPlan
      )
    }, DEFAULT_PLANS),
  ['cms-pricing'],
  { tags: [CMS_TAGS.pricing] }
)

export type ActiveDiscount = { id: string; title: string; message: string; amount: string; endsAt: Date }

export const getActiveDiscount = unstable_cache(
  () =>
    readOrFallback(async (): Promise<ActiveDiscount | null> => {
      const now = new Date()
      const row = await getDb().discountAnnouncement.findFirst({
        where: { active: true, startsAt: { lte: now }, endsAt: { gte: now } },
        orderBy: { createdAt: 'desc' },
      })
      if (!row) return null
      return { id: row.id, title: row.title, message: row.message, amount: row.amount, endsAt: row.endsAt }
    }, null),
  ['cms-discount'],
  { tags: [CMS_TAGS.discounts], revalidate: 60 }
)

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

export const getPublishedPosts = unstable_cache(
  () =>
    readOrFallback(async () => {
      const now = new Date()
      const rows = await getDb().blogPostCms.findMany({
        where: {
          status: 'published',
          OR: [{ publishAt: null }, { publishAt: { lte: now } }],
        },
        orderBy: [{ publishAt: 'desc' }, { createdAt: 'desc' }],
      })
      if (rows.length === 0) return DEFAULT_POSTS
      return rows.map(
        (row) =>
          ({
            id: row.id,
            slug: row.slug,
            title: row.title,
            excerpt: row.excerpt,
            category: row.category,
            image: row.image ?? '',
            readTime: row.readTime ?? '',
            author: { name: row.authorName, role: row.authorRole },
            date: formatDate(row.publishAt ?? row.createdAt),
            blocks: row.blocks as ContentBlock[],
            seoTitle: row.seoTitle,
            seoDescription: row.seoDescription,
          }) satisfies PublicPost
      )
    }, DEFAULT_POSTS),
  ['cms-blog'],
  { tags: [CMS_TAGS.blog] }
)

export async function getPostBySlug(slug: string): Promise<PublicPost | null> {
  const posts = await getPublishedPosts()
  return posts.find((post) => post.slug === slug) ?? null
}

export type PublicContent = {
  site: SiteContact
  social: SocialEntry[]
  plans: PublicPlan[]
  testimonials: PublicTestimonial[]
  discount: ActiveDiscount | null
}

export async function getPublicContent(): Promise<PublicContent> {
  const [site, social, plans, testimonials, discount] = await Promise.all([
    getSiteContact(),
    getSocialLinks(),
    getPricingPlans(),
    getTestimonials(),
    getActiveDiscount(),
  ])
  return { site, social, plans, testimonials, discount }
}
