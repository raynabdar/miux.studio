import { config as loadEnv } from 'dotenv'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

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
