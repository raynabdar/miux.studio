import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server'

// Public marketing surface + auth entry points + endpoints that verify their
// own requests (webhooks, cron, legacy Resend routes).
const isPublicRoute = createRouteMatcher([
  '/',
  '/start',
  '/blog(.*)',
  '/blogs(.*)',
  '/work(.*)',
  '/projects(.*)',
  '/startups(.*)',
  '/contact(.*)',
  '/meeting(.*)',
  '/onboarding(.*)',
  '/privacy(.*)',
  '/privacy-policy(.*)',
  '/terms(.*)',
  '/client-terms(.*)',
  '/teardown(.*)',
  '/sitemap(.*)',
  '/opengraph-image(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/reset-password(.*)',
  '/api(.*)',
])

// Marketing pages never read Clerk state, so skipping the middleware there drops
// the dev-instance handshake redirect chain that otherwise runs before first paint.
const isMarketingRoute = createRouteMatcher([
  '/',
  '/start',
  '/blog(.*)',
  '/blogs(.*)',
  '/work(.*)',
  '/projects(.*)',
  '/startups(.*)',
  '/contact(.*)',
  '/meeting(.*)',
  '/privacy(.*)',
  '/privacy-policy(.*)',
  '/terms(.*)',
  '/client-terms(.*)',
  '/teardown(.*)',
  '/sitemap(.*)',
  '/opengraph-image(.*)',
  '/api(.*)',
])

const isClerkConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY)

type ProxyHandler = (
  request: NextRequest,
  event: NextFetchEvent
) => Promise<Response | void> | Response | void

// Built lazily so a deployment without Clerk keys still serves the marketing
// site instead of throwing on every request.
let clerkHandler: ProxyHandler | null = null

function withClerk(request: NextRequest, event: NextFetchEvent) {
  clerkHandler ??= clerkMiddleware(async (auth, req) => {
    if (isPublicRoute(req)) return

    const { userId } = await auth()
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url)
      signInUrl.searchParams.set('redirect_url', req.url)
      return NextResponse.redirect(signInUrl)
    }
  }) as unknown as ProxyHandler
  return clerkHandler(request, event)
}

// Proxy adds the first cheap layer only. Every protected page/action re-checks
// the session and stored role server-side (see lib/auth/session.ts).
export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (isMarketingRoute(request)) {
    return NextResponse.next()
  }

  if (isClerkConfigured()) {
    return withClerk(request, event)
  }

  if (isPublicRoute(request)) {
    return NextResponse.next()
  }

  const signInUrl = new URL('/sign-in', request.url)
  signInUrl.searchParams.set('redirect_url', request.url)
  return NextResponse.redirect(signInUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
