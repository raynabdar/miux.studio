import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'prisma/config'

// Prisma CLI only (migrations, generate, seed). Load local overrides first.
loadEnv({ path: '.env.local', quiet: true })
loadEnv({ quiet: true })

// Migrations must use the direct (non-pooled) connection.
// Fallback keeps `prisma generate` usable in builds before credentials exist.
const directUrl =
  process.env.DIRECT_URL ?? 'postgresql://placeholder:placeholder@localhost:5432/placeholder'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: directUrl,
  },
})
