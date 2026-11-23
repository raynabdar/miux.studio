import { getRedisClient } from '@/lib/ratelimit'

const MAX_FAILURES = 5
const WINDOW_SECONDS = 15 * 60

function keyFor(email: string) {
  return `miux:lockout:${email.trim().toLowerCase()}`
}

// Fail open if Redis is unavailable: Clerk's own attack protection remains in
// place, and lockout is a defence-in-depth layer, not the only gate.
export async function isSignInLocked(email: string): Promise<boolean> {
  const redis = getRedisClient()
  if (!redis) return false
  try {
    const count = await redis.get<number>(keyFor(email))
    return typeof count === 'number' && count >= MAX_FAILURES
  } catch {
    return false
  }
}

export async function recordSignInFailure(email: string): Promise<{ locked: boolean }> {
  const redis = getRedisClient()
  if (!redis) return { locked: false }
  try {
    const key = keyFor(email)
    const count = await redis.incr(key)
    if (count === 1) await redis.expire(key, WINDOW_SECONDS)
    return { locked: count >= MAX_FAILURES }
  } catch {
    return { locked: false }
  }
}

export async function clearSignInFailures(email: string): Promise<void> {
  const redis = getRedisClient()
  if (!redis) return
  try {
    await redis.del(keyFor(email))
  } catch {
    // no-op
  }
}
