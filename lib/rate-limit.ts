const buckets = new Map<string, number>()

export function getClientIp(request: Request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

/**
 * Per-instance in-memory limiter. It resets on cold start and is not shared
 * between serverless instances, so it slows casual abuse rather than
 * guaranteeing a global rate.
 */
export function rateLimit(key: string, windowMs: number): number {
  const now = Date.now()
  const last = buckets.get(key) ?? 0
  const elapsed = now - last

  if (elapsed < windowMs) {
    return Math.ceil((windowMs - elapsed) / 1000)
  }

  buckets.set(key, now)
  return 0
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return true

  try {
    return new URL(origin).host === request.headers.get('host')
  } catch {
    return false
  }
}
