import { ClerkProvider } from '@clerk/nextjs'

// Clerk loads only inside the portal/auth route group — the marketing site
// must not ship Clerk JS. Keep this layout dynamic so builds never prerender
// Clerk components without keys.
export const dynamic = 'force-dynamic'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F5F0] px-6 text-[#141414]">
        <div className="max-w-md rounded-[28px] border border-[#141414]/10 bg-white/70 p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8A857C]">
            Portal
          </p>
          <h1 className="mt-2 text-xl tracking-tight">Authentication is not configured</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#5C5A55]">
            Set <code className="font-mono text-xs">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and{' '}
            <code className="font-mono text-xs">CLERK_SECRET_KEY</code> to enable sign-in and the
            client portal.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ClerkProvider>
      <div className="min-h-screen bg-[#F6F5F0] text-[#141414]">{children}</div>
    </ClerkProvider>
  )
}
