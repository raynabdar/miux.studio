'use client'

import { useClerk } from '@clerk/nextjs'

export default function SignOutButton() {
  const { signOut } = useClerk()
  return (
    <button
      type="button"
      onClick={() => signOut({ redirectUrl: '/' })}
      className="inline-flex items-center justify-center rounded-full border border-[#141414]/15 bg-white px-4 py-2 text-xs font-semibold text-[#141414] transition-all hover:border-orange-500/50"
    >
      Sign out
    </button>
  )
}
