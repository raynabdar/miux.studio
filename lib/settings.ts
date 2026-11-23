import { getDb } from '@/lib/db/client'

export async function getEarlySignUpEnabled(): Promise<boolean> {
  // Public pages must render before the database is configured; the safe
  // default is off.
  if (!process.env.DATABASE_URL) return false
  const settings = await getDb().applicationSettings.findUnique({ where: { id: 1 } })
  return settings?.earlySignUpEnabled ?? false
}
