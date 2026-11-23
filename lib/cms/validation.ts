import { z } from 'zod'

const httpUrl = z
  .string()
  .trim()
  .max(2000)
  .refine((value) => {
    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }, 'Enter a valid http(s) link.')

const optionalHttpUrl = z.union([httpUrl, z.literal('')]).default('')

export const socialLinkSchema = z.object({
  label: z.string().trim().min(1, 'Add a label.').max(40),
  url: httpUrl,
})

export const siteContactSchema = z.object({
  email: z.string().trim().email('Enter a valid email.'),
  phone: z.string().trim().max(40).default(''),
  responseTime: z.string().trim().max(120).default(''),
  regionalScope: z.string().trim().max(200).default(''),
})

export const startupSchema = z.object({
  name: z.string().trim().min(1, 'Add a name.').max(120),
  websiteUrl: optionalHttpUrl,
  logoUrl: optionalHttpUrl,
  description: z.string().trim().max(600).default(''),
  sector: z.string().trim().max(80).default(''),
  region: z.string().trim().max(80).default(''),
  service: z.string().trim().max(80).default(''),
})

export const testimonialSchema = z.object({
  quote: z.string().trim().min(5, 'Add the quote.').max(600),
  author: z.string().trim().min(1, 'Add the author.').max(120),
  role: z.string().trim().max(80).default(''),
  company: z.string().trim().max(80).default(''),
  websiteUrl: optionalHttpUrl,
})

export const pricingPlanSchema = z.object({
  name: z.string().trim().min(1, 'Add a plan name.').max(60),
  price: z.coerce.number().int().min(0).max(1_000_000),
  description: z.string().trim().min(1, 'Add a description.').max(400),
  features: z.string().max(2000).default(''),
  includes: z.string().max(2000).default(''),
})

export const discountSchema = z
  .object({
    title: z.string().trim().min(1, 'Add a title.').max(120),
    message: z.string().trim().min(1, 'Add a message.').max(400),
    amount: z.string().trim().min(1, 'Add an amount or percentage.').max(40),
    startsAt: z.string().min(1, 'Add a start date.'),
    endsAt: z.string().min(1, 'Add an end date.'),
  })
  .refine((value) => new Date(value.endsAt) > new Date(value.startsAt), {
    message: 'The end date must be after the start date.',
    path: ['endsAt'],
  })

export const blogBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('heading'), text: z.string().trim().min(1).max(200) }),
  z.object({ type: z.literal('paragraph'), text: z.string().trim().min(1).max(5000) }),
  z.object({ type: z.literal('image'), url: httpUrl, alt: z.string().trim().max(200).default('') }),
  z.object({ type: z.literal('quote'), text: z.string().trim().min(1).max(1000), cite: z.string().trim().max(120).default('') }),
  z.object({ type: z.literal('code'), code: z.string().max(8000), language: z.string().trim().max(30).default('') }),
  z.object({ type: z.literal('ordered-list'), items: z.array(z.string().trim().min(1).max(1000)).min(1).max(50) }),
  z.object({ type: z.literal('unordered-list'), items: z.array(z.string().trim().min(1).max(1000)).min(1).max(50) }),
])

export const blogPostSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, 'Add a slug.')
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens.'),
  title: z.string().trim().min(1, 'Add a title.').max(200),
  excerpt: z.string().trim().min(1, 'Add an excerpt.').max(400),
  category: z.string().trim().max(80).default(''),
  image: optionalHttpUrl,
  readTime: z.string().trim().max(40).default(''),
  authorName: z.string().trim().max(120).default('Miux Studio'),
  authorRole: z.string().trim().max(120).default(''),
  seoTitle: z.string().trim().max(200).default(''),
  seoDescription: z.string().trim().max(300).default(''),
  status: z.enum(['draft', 'published']),
  publishAt: z.string().default(''),
  blocks: z.array(blogBlockSchema).min(1, 'Add at least one content block.').max(200),
})

export type BlogBlockInput = z.infer<typeof blogBlockSchema>

export function parseLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function isDiscountActive(
  announcement: { active: boolean; startsAt: Date; endsAt: Date },
  now: Date = new Date()
): boolean {
  return announcement.active && announcement.startsAt <= now && announcement.endsAt >= now
}
