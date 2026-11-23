import type { Metadata } from 'next'
import AuthShell from '@/components/portal/auth-shell'
import ResetPasswordForm from '@/components/portal/reset-password-form'

export const metadata: Metadata = {
  title: 'Reset Password — Miux Studio',
  robots: { index: false, follow: false },
}

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="We will email you a code, then you can set a new password."
    >
      <ResetPasswordForm />
    </AuthShell>
  )
}
