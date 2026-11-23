import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured')
  }
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

// Lazy singleton: keeps `next build` working before credentials exist,
// and survives dev hot reloads.
export function getDb(): PrismaClient {
  return (globalForPrisma.prisma ??= createClient())
}
