import { config as loadEnv } from 'dotenv'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import {
  DEFAULT_PLANS,
  DEFAULT_POSTS,
  DEFAULT_SITE_CONTACT,
  DEFAULT_SOCIAL,
  DEFAULT_STARTUPS,
  DEFAULT_TESTIMONIALS,
} from '../lib/cms/defaults'

loadEnv({ path: '.env.local', quiet: true })
loadEnv({ quiet: true })

// Seed: settings singleton + the two demo accounts (read-only in the app).
// Demo credentials come from the environment at runtime and are never printed.
async function main() {
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL
  if (!connectionString) {
    console.warn('[seed] No database URL configured; skipping.')
    return
  }

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })

  try {
    await prisma.applicationSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, earlySignUpEnabled: false },
    })
    console.log('[seed] settings ready')

    await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        email: DEFAULT_SITE_CONTACT.email,
        phone: DEFAULT_SITE_CONTACT.phone,
        responseTime: DEFAULT_SITE_CONTACT.responseTime,
        regionalScope: DEFAULT_SITE_CONTACT.regionalScope,
      },
    })

    if ((await prisma.socialLink.count()) === 0) {
      await prisma.socialLink.createMany({
        data: DEFAULT_SOCIAL.map((link, index) => ({ label: link.label, url: link.href, position: index })),
      })
    }
    if ((await prisma.startup.count()) === 0) {
      await prisma.startup.createMany({
        data: DEFAULT_STARTUPS.map((entry, index) => ({
          name: entry.name,
          logoUrl: entry.logoUrl,
          websiteUrl: entry.websiteUrl,
          description: entry.description,
          sector: entry.sector,
          region: entry.region,
          service: entry.service,
          slug: entry.slug,
          position: index,
        })),
      })
    }
    if ((await prisma.testimonial.count()) === 0) {
      await prisma.testimonial.createMany({
        data: DEFAULT_TESTIMONIALS.map((item, index) => ({
          quote: item.quote,
          author: item.author,
          role: item.role,
          company: item.company,
          websiteUrl: item.websiteUrl,
          position: index,
        })),
      })
    }
    if ((await prisma.pricingPlan.count()) === 0) {
      await prisma.pricingPlan.createMany({
        data: DEFAULT_PLANS.map((plan, index) => ({
          name: plan.name,
          price: plan.price,
          description: plan.description,
          features: plan.features,
          includes: plan.includes,
          recommended: plan.recommended,
          position: index,
        })),
      })
    }
    if ((await prisma.blogPostCms.count()) === 0) {
      await prisma.blogPostCms.createMany({
        data: DEFAULT_POSTS.map((post) => ({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          category: post.category,
          image: post.image || null,
          readTime: post.readTime || null,
          authorName: post.author.name,
          authorRole: post.author.role,
          blocks: post.blocks as never,
          status: 'published',
          publishAt: new Date(post.date),
        })),
      })
    }
    console.log('[seed] CMS content ready')

    const demoAccounts: Array<{
      email: string | undefined
      password: string | undefined
      role: 'client' | 'team_member'
      name: string
    }> = [
      {
        email: process.env.DEMO_TEAM_EMAIL,
        password: process.env.DEMO_TEAM_PASSWORD,
        role: 'team_member',
        name: 'Demo Team',
      },
      {
        email: process.env.DEMO_CLIENT_EMAIL,
        password: process.env.DEMO_CLIENT_PASSWORD,
        role: 'client',
        name: 'Demo Client',
      },
    ]

    if (!process.env.CLERK_SECRET_KEY) {
      console.warn('[seed] CLERK_SECRET_KEY missing; demo accounts not created.')
      return
    }

    const { clerkClient } = await import('@clerk/nextjs/server')
    const clerk = await clerkClient()

    for (const account of demoAccounts) {
      if (!account.email || !account.password) {
        console.warn(`[seed] Skipping ${account.role} demo: credentials not set in env.`)
        continue
      }

      const email = account.email.trim().toLowerCase()
      const existingList = await clerk.users.getUserList({ emailAddress: [email] })
      const existing = existingList.data[0]

      const clerkUser =
        existing ??
        (await clerk.users.createUser({
          emailAddress: [email],
          password: account.password,
          firstName: account.name,
          publicMetadata: { isDemo: true },
        }))

      await prisma.user.upsert({
        where: { clerkId: clerkUser.id },
        update: {
          isDemo: true,
          role: account.role,
          status: 'active',
          email,
          fullName: account.name,
          emailVerifiedAt: new Date(),
          ownerVerifiedAt: new Date(),
        },
        create: {
          clerkId: clerkUser.id,
          email,
          fullName: account.name,
          role: account.role,
          status: 'active',
          isDemo: true,
          emailVerifiedAt: new Date(),
          ownerVerifiedAt: new Date(),
          verifiedBy: 'seed',
        },
      })
      console.log(`[seed] demo ${account.role} ready`)
    }
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error('[seed] failed', (error as Error).message)
  process.exitCode = 1
})
