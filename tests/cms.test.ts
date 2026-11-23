import { describe, expect, it } from 'vitest'
import {
  blogPostSchema,
  discountSchema,
  isDiscountActive,
  pricingPlanSchema,
  socialLinkSchema,
  testimonialSchema,
} from '@/lib/cms/validation'

const block = { type: 'paragraph' as const, text: 'Body copy.' }

const basePost = {
  slug: 'design-systems-at-scale',
  title: 'Design systems at scale',
  excerpt: 'How we keep a system alive.',
  category: 'Design Systems',
  image: '',
  readTime: '6 min read',
  authorName: 'Miux Studio',
  authorRole: 'Studio',
  seoTitle: '',
  seoDescription: '',
  status: 'draft' as const,
  publishAt: '',
  blocks: [block],
}

describe('cms validation', () => {
  it('accepts a well-formed post and rejects bad slugs', () => {
    expect(blogPostSchema.safeParse(basePost).success).toBe(true)
    expect(blogPostSchema.safeParse({ ...basePost, slug: 'Not A Slug' }).success).toBe(false)
    expect(blogPostSchema.safeParse({ ...basePost, slug: 'double--dash' }).success).toBe(false)
  })

  it('requires at least one block and rejects non-http image URLs', () => {
    expect(blogPostSchema.safeParse({ ...basePost, blocks: [] }).success).toBe(false)
    expect(
      blogPostSchema.safeParse({
        ...basePost,
        blocks: [{ type: 'image', url: 'javascript:alert(1)', alt: '' }],
      }).success
    ).toBe(false)
  })

  it('validates every supported block type', () => {
    const blocks = [
      { type: 'heading', text: 'Heading' },
      { type: 'paragraph', text: 'Paragraph' },
      { type: 'image', url: 'https://example.com/a.png', alt: 'A' },
      { type: 'quote', text: 'Quote', cite: 'Someone' },
      { type: 'code', code: 'const x = 1', language: 'ts' },
      { type: 'ordered-list', items: ['One', 'Two'] },
      { type: 'unordered-list', items: ['One'] },
    ]
    expect(blogPostSchema.safeParse({ ...basePost, blocks }).success).toBe(true)
  })

  it('rejects non-http social and testimonial URLs', () => {
    expect(socialLinkSchema.safeParse({ label: 'X', url: 'javascript:alert(1)' }).success).toBe(false)
    expect(socialLinkSchema.safeParse({ label: 'X', url: 'https://x.com/miux' }).success).toBe(true)
    expect(
      testimonialSchema.safeParse({
        quote: 'Great work from the team.',
        author: 'A',
        role: '',
        company: '',
        websiteUrl: 'ftp://example.com',
      }).success
    ).toBe(false)
  })

  it('coerces pricing values and requires a description', () => {
    const parsed = pricingPlanSchema.safeParse({
      name: 'Growth',
      price: '4800',
      description: 'Everything to scale.',
      features: 'A\nB',
      includes: '',
    })
    expect(parsed.success).toBe(true)
    if (parsed.success) expect(parsed.data.price).toBe(4800)
    expect(
      pricingPlanSchema.safeParse({ name: 'Growth', price: 10, description: '', features: '', includes: '' }).success
    ).toBe(false)
  })

  it('requires the discount window to end after it starts', () => {
    expect(
      discountSchema.safeParse({
        title: 'Launch offer',
        message: '20% off',
        amount: '20%',
        startsAt: '2026-12-01T00:00',
        endsAt: '2026-12-31T00:00',
      }).success
    ).toBe(true)
    expect(
      discountSchema.safeParse({
        title: 'Launch offer',
        message: '20% off',
        amount: '20%',
        startsAt: '2026-12-31T00:00',
        endsAt: '2026-12-01T00:00',
      }).success
    ).toBe(false)
  })

  it('only shows discounts that are enabled and inside their window', () => {
    const now = new Date('2026-12-15T12:00:00Z')
    const base = {
      active: true,
      startsAt: new Date('2026-12-01T00:00:00Z'),
      endsAt: new Date('2026-12-31T00:00:00Z'),
    }
    expect(isDiscountActive(base, now)).toBe(true)
    expect(isDiscountActive({ ...base, active: false }, now)).toBe(false)
    expect(isDiscountActive({ ...base, startsAt: new Date('2026-12-20T00:00:00Z') }, now)).toBe(false)
    expect(isDiscountActive({ ...base, endsAt: new Date('2026-12-10T00:00:00Z') }, now)).toBe(false)
  })
})
