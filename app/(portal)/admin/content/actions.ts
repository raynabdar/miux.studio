'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { requireFounder } from '@/lib/auth/session'
import { getDb } from '@/lib/db/client'
import { audit } from '@/lib/security/audit'
import { uploadImage } from '@/lib/cms/storage'
import { CMS_TAGS } from '@/lib/cms/queries'
import {
  blogPostSchema,
  discountSchema,
  parseLines,
  pricingPlanSchema,
  siteContactSchema,
  socialLinkSchema,
  startupSchema,
  testimonialSchema,
} from '@/lib/cms/validation'

function str(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

function dir(formData: FormData): 'up' | 'down' {
  return str(formData, 'direction') === 'up' ? 'up' : 'down'
}

function touch(tag: string, paths: string[]) {
  revalidateTag(tag, 'max')
  for (const path of paths) revalidatePath(path)
}

function touchBlog(slug?: string) {
  revalidateTag(CMS_TAGS.blog, 'max')
  revalidatePath('/blogs')
  if (slug) revalidatePath(`/blogs/${slug}`)
}

async function log(actorClerkId: string, action: string, targetId?: string) {
  await audit({
    actorClerkId,
    actorRole: 'founder',
    action,
    targetType: 'site_content',
    targetId: targetId ?? null,
  })
}

// ── Social ────────────────────────────────────────────────────────────────────

export async function addSocialLink(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const parsed = socialLinkSchema.safeParse({ label: str(formData, 'label'), url: str(formData, 'url') })
  if (!parsed.success) return
  const count = await getDb().socialLink.count()
  const row = await getDb().socialLink.create({
    data: { label: parsed.data.label, url: parsed.data.url, position: count },
  })
  await log(userId, 'cms.social.create', row.id)
  touch(CMS_TAGS.social, ['/', '/contact'])
}

export async function updateSocialLink(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  const parsed = socialLinkSchema.safeParse({ label: str(formData, 'label'), url: str(formData, 'url') })
  if (!id || !parsed.success) return
  await getDb().socialLink.update({ where: { id }, data: parsed.data })
  await log(userId, 'cms.social.update', id)
  touch(CMS_TAGS.social, ['/', '/contact'])
}

export async function deleteSocialLink(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  if (!id) return
  await getDb().socialLink.delete({ where: { id } })
  await log(userId, 'cms.social.delete', id)
  touch(CMS_TAGS.social, ['/', '/contact'])
}

export async function moveSocialLink(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  const rows = await getDb().socialLink.findMany({ orderBy: { position: 'asc' } })
  const index = rows.findIndex((row) => row.id === id)
  const target = dir(formData) === 'up' ? index - 1 : index + 1
  if (index < 0 || target < 0 || target >= rows.length) return
  await getDb().$transaction([
    getDb().socialLink.update({ where: { id: rows[index].id }, data: { position: target } }),
    getDb().socialLink.update({ where: { id: rows[target].id }, data: { position: index } }),
  ])
  await log(userId, 'cms.social.reorder', id)
  touch(CMS_TAGS.social, ['/', '/contact'])
}

// ── Contact ───────────────────────────────────────────────────────────────────

export async function saveSiteContact(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const parsed = siteContactSchema.safeParse({
    email: str(formData, 'email'),
    phone: str(formData, 'phone'),
    responseTime: str(formData, 'responseTime'),
    regionalScope: str(formData, 'regionalScope'),
  })
  if (!parsed.success) return
  await getDb().siteSettings.upsert({
    where: { id: 1 },
    update: { ...parsed.data, updatedBy: userId },
    create: { id: 1, ...parsed.data, updatedBy: userId },
  })
  await log(userId, 'cms.contact.update', '1')
  touch(CMS_TAGS.contact, ['/', '/contact', '/meeting'])
}

// ── Startups ──────────────────────────────────────────────────────────────────

export async function saveStartup(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  const parsed = startupSchema.safeParse({
    name: str(formData, 'name'),
    websiteUrl: str(formData, 'websiteUrl'),
    logoUrl: str(formData, 'logoUrl'),
    description: str(formData, 'description'),
    sector: str(formData, 'sector'),
    region: str(formData, 'region'),
    service: str(formData, 'service'),
  })
  if (!parsed.success) return

  let logoUrl = parsed.data.logoUrl || null
  const file = formData.get('logo')
  if (file instanceof File && file.size > 0) {
    const upload = await uploadImage(file, 'logos')
    if (!upload.ok) return
    logoUrl = upload.url
  }

  const data = {
    name: parsed.data.name,
    websiteUrl: parsed.data.websiteUrl || null,
    logoUrl,
    description: parsed.data.description,
    sector: parsed.data.sector,
    region: parsed.data.region,
    service: parsed.data.service,
  }

  if (id) {
    await getDb().startup.update({ where: { id }, data })
    await log(userId, 'cms.startup.update', id)
  } else {
    const count = await getDb().startup.count()
    const row = await getDb().startup.create({ data: { ...data, position: count } })
    await log(userId, 'cms.startup.create', row.id)
  }
  touch(CMS_TAGS.startups, ['/startups', '/'])
}

export async function deleteStartup(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  if (!id) return
  await getDb().startup.delete({ where: { id } })
  await log(userId, 'cms.startup.delete', id)
  touch(CMS_TAGS.startups, ['/startups', '/'])
}

export async function toggleStartup(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  const row = id ? await getDb().startup.findUnique({ where: { id } }) : null
  if (!row) return
  await getDb().startup.update({ where: { id }, data: { visible: !row.visible } })
  await log(userId, 'cms.startup.toggle', id)
  touch(CMS_TAGS.startups, ['/startups', '/'])
}

export async function moveStartup(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  const rows = await getDb().startup.findMany({ orderBy: { position: 'asc' } })
  const index = rows.findIndex((row) => row.id === id)
  const target = dir(formData) === 'up' ? index - 1 : index + 1
  if (index < 0 || target < 0 || target >= rows.length) return
  await getDb().$transaction([
    getDb().startup.update({ where: { id: rows[index].id }, data: { position: target } }),
    getDb().startup.update({ where: { id: rows[target].id }, data: { position: index } }),
  ])
  await log(userId, 'cms.startup.reorder', id)
  touch(CMS_TAGS.startups, ['/startups', '/'])
}

// ── Testimonials ──────────────────────────────────────────────────────────────

export async function saveTestimonial(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  const parsed = testimonialSchema.safeParse({
    quote: str(formData, 'quote'),
    author: str(formData, 'author'),
    role: str(formData, 'role'),
    company: str(formData, 'company'),
    websiteUrl: str(formData, 'websiteUrl'),
  })
  if (!parsed.success) return
  const data = {
    quote: parsed.data.quote,
    author: parsed.data.author,
    role: parsed.data.role,
    company: parsed.data.company,
    websiteUrl: parsed.data.websiteUrl || null,
  }
  if (id) {
    await getDb().testimonial.update({ where: { id }, data })
    await log(userId, 'cms.testimonial.update', id)
  } else {
    const count = await getDb().testimonial.count()
    const row = await getDb().testimonial.create({ data: { ...data, position: count } })
    await log(userId, 'cms.testimonial.create', row.id)
  }
  touch(CMS_TAGS.testimonials, ['/'])
}

export async function deleteTestimonial(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  if (!id) return
  await getDb().testimonial.delete({ where: { id } })
  await log(userId, 'cms.testimonial.delete', id)
  touch(CMS_TAGS.testimonials, ['/'])
}

export async function toggleTestimonial(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  const row = id ? await getDb().testimonial.findUnique({ where: { id } }) : null
  if (!row) return
  await getDb().testimonial.update({ where: { id }, data: { visible: !row.visible } })
  await log(userId, 'cms.testimonial.toggle', id)
  touch(CMS_TAGS.testimonials, ['/'])
}

export async function moveTestimonial(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  const rows = await getDb().testimonial.findMany({ orderBy: { position: 'asc' } })
  const index = rows.findIndex((row) => row.id === id)
  const target = dir(formData) === 'up' ? index - 1 : index + 1
  if (index < 0 || target < 0 || target >= rows.length) return
  await getDb().$transaction([
    getDb().testimonial.update({ where: { id: rows[index].id }, data: { position: target } }),
    getDb().testimonial.update({ where: { id: rows[target].id }, data: { position: index } }),
  ])
  await log(userId, 'cms.testimonial.reorder', id)
  touch(CMS_TAGS.testimonials, ['/'])
}

// ── Pricing ───────────────────────────────────────────────────────────────────

export async function savePricingPlan(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  const parsed = pricingPlanSchema.safeParse({
    name: str(formData, 'name'),
    price: str(formData, 'price'),
    description: str(formData, 'description'),
    features: str(formData, 'features'),
    includes: str(formData, 'includes'),
  })
  if (!parsed.success) return
  const data = {
    name: parsed.data.name,
    price: parsed.data.price,
    description: parsed.data.description,
    features: parseLines(parsed.data.features),
    includes: parseLines(parsed.data.includes),
  }
  if (id) {
    await getDb().pricingPlan.update({ where: { id }, data })
    await log(userId, 'cms.pricing.update', id)
  } else {
    const count = await getDb().pricingPlan.count()
    const row = await getDb().pricingPlan.create({ data: { ...data, position: count } })
    await log(userId, 'cms.pricing.create', row.id)
  }
  touch(CMS_TAGS.pricing, ['/'])
}

export async function deletePricingPlan(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  if (!id) return
  await getDb().pricingPlan.delete({ where: { id } })
  await log(userId, 'cms.pricing.delete', id)
  touch(CMS_TAGS.pricing, ['/'])
}

export async function togglePricingPlan(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  const row = id ? await getDb().pricingPlan.findUnique({ where: { id } }) : null
  if (!row) return
  await getDb().pricingPlan.update({ where: { id }, data: { visible: !row.visible } })
  await log(userId, 'cms.pricing.toggle', id)
  touch(CMS_TAGS.pricing, ['/'])
}

export async function recommendPricingPlan(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  if (!id) return
  await getDb().$transaction([
    getDb().pricingPlan.updateMany({ data: { recommended: false } }),
    getDb().pricingPlan.update({ where: { id }, data: { recommended: true } }),
  ])
  await log(userId, 'cms.pricing.recommend', id)
  touch(CMS_TAGS.pricing, ['/'])
}

export async function movePricingPlan(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  const rows = await getDb().pricingPlan.findMany({ orderBy: { position: 'asc' } })
  const index = rows.findIndex((row) => row.id === id)
  const target = dir(formData) === 'up' ? index - 1 : index + 1
  if (index < 0 || target < 0 || target >= rows.length) return
  await getDb().$transaction([
    getDb().pricingPlan.update({ where: { id: rows[index].id }, data: { position: target } }),
    getDb().pricingPlan.update({ where: { id: rows[target].id }, data: { position: index } }),
  ])
  await log(userId, 'cms.pricing.reorder', id)
  touch(CMS_TAGS.pricing, ['/'])
}

// ── Discount announcements ────────────────────────────────────────────────────

export async function saveDiscount(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  const parsed = discountSchema.safeParse({
    title: str(formData, 'title'),
    message: str(formData, 'message'),
    amount: str(formData, 'amount'),
    startsAt: str(formData, 'startsAt'),
    endsAt: str(formData, 'endsAt'),
  })
  if (!parsed.success) return
  const data = {
    title: parsed.data.title,
    message: parsed.data.message,
    amount: parsed.data.amount,
    startsAt: new Date(parsed.data.startsAt),
    endsAt: new Date(parsed.data.endsAt),
    active: formData.get('active') === 'on',
  }
  if (id) {
    await getDb().discountAnnouncement.update({ where: { id }, data })
    await log(userId, 'cms.discount.update', id)
  } else {
    const row = await getDb().discountAnnouncement.create({ data })
    await log(userId, 'cms.discount.create', row.id)
  }
  touch(CMS_TAGS.discounts, ['/'])
}

export async function deleteDiscount(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  if (!id) return
  await getDb().discountAnnouncement.delete({ where: { id } })
  await log(userId, 'cms.discount.delete', id)
  touch(CMS_TAGS.discounts, ['/'])
}

export async function toggleDiscount(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  const row = id ? await getDb().discountAnnouncement.findUnique({ where: { id } }) : null
  if (!row) return
  await getDb().discountAnnouncement.update({ where: { id }, data: { active: !row.active } })
  await log(userId, 'cms.discount.toggle', id)
  touch(CMS_TAGS.discounts, ['/'])
}

// ── Blog ──────────────────────────────────────────────────────────────────────

export async function saveBlogPost(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  const payload = str(formData, 'payload')

  let raw: unknown
  try {
    raw = JSON.parse(payload)
  } catch {
    return
  }
  const parsed = blogPostSchema.safeParse(raw)
  if (!parsed.success) return

  const publishAt = parsed.data.publishAt ? new Date(parsed.data.publishAt) : null
  const data = {
    slug: parsed.data.slug,
    title: parsed.data.title,
    excerpt: parsed.data.excerpt,
    category: parsed.data.category,
    image: parsed.data.image || null,
    readTime: parsed.data.readTime || null,
    authorName: parsed.data.authorName || 'Miux Studio',
    authorRole: parsed.data.authorRole,
    blocks: parsed.data.blocks,
    seoTitle: parsed.data.seoTitle || null,
    seoDescription: parsed.data.seoDescription || null,
    status: parsed.data.status,
    publishAt: publishAt && !Number.isNaN(publishAt.getTime()) ? publishAt : null,
  } as const

  try {
    if (id) {
      await getDb().blogPostCms.update({ where: { id }, data: { ...data, blocks: parsed.data.blocks } as never })
      await log(userId, 'cms.blog.update', id)
    } else {
      const row = await getDb().blogPostCms.create({ data: { ...data, blocks: parsed.data.blocks } as never })
      await log(userId, 'cms.blog.create', row.id)
    }
  } catch (error) {
    console.error('[cms] blog save failed', (error as { code?: string }).code ?? (error as Error).message)
    return
  }

  touchBlog(parsed.data.slug)
  revalidatePath('/admin/content/blog')
}

export async function deleteBlogPost(formData: FormData): Promise<void> {
  const { userId } = await requireFounder()
  const id = str(formData, 'id')
  if (!id) return
  const row = await getDb().blogPostCms.findUnique({ where: { id }, select: { slug: true } })
  await getDb().blogPostCms.delete({ where: { id } })
  await log(userId, 'cms.blog.delete', id)
  if (row) revalidatePath(`/blogs/${row.slug}`)
  touchBlog()
  revalidatePath('/admin/content/blog')
}

export async function uploadContentImage(
  formData: FormData
): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
  await requireFounder()
  const file = formData.get('file')
  if (!(file instanceof File)) return { ok: false, message: 'Choose an image file.' }
  return uploadImage(file, 'blog')
}
