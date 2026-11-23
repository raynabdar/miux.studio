import type { Metadata } from 'next'
import AuthShell from '@/components/portal/auth-shell'
import SignInForm from '@/components/portal/sign-in-form'

export const metadata: Metadata = {
  title: 'Sign In — Miux Studio',
  robots: { index: false, follow: false },
}

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Miux account. Sessions are managed by Clerk."
    >
      <SignInForm />
    </AuthShell>
  )
}
