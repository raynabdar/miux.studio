'use server'

import { revalidatePath } from 'next/cache'
import { getDb } from '@/lib/db/client'
import { requireFounder } from '@/lib/auth/session'
import { statusAfterVerification } from '@/lib/auth/status'
import { audit } from '@/lib/security/audit'

export async function setEarlySignUp(formData: FormData) {
  const { userId } = await requireFounder()
  const enabled = formData.get('enabled') === 'on'

  await getDb().applicationSettings.upsert({
    where: { id: 1 },
    update: { earlySignUpEnabled: enabled, updatedBy: userId },
    create: { id: 1, earlySignUpEnabled: enabled, updatedBy: userId },
  })

  await audit({
    actorClerkId: userId,
    actorRole: 'founder',
    action: 'founder.settings_change',
    targetType: 'application_settings',
    targetId: '1',
    metadata: { earlySignUpEnabled: enabled },
  })

  revalidatePath('/founder')
}

export async function setAccountVerification(formData: FormData) {
  const { userId } = await requireFounder()
  const clerkId = String(formData.get('clerkId') ?? '')
  const mode = String(formData.get('mode') ?? '')

  if (!clerkId || (mode !== 'verify' && mode !== 'unverify')) return

  const target = await getDb().user.findUnique({ where: { clerkId } })
  if (!target) return

  const ownerVerifiedAt = mode === 'verify' ? new Date() : null
  const status = statusAfterVerification({
    current: target.status,
    emailVerifiedAt: target.emailVerifiedAt,
    ownerVerifiedAt,
  })

  await getDb().user.update({
    where: { id: target.id },
    data: {
      ownerVerifiedAt,
      verifiedBy: mode === 'verify' ? userId : null,
      status,
    },
  })

  await audit({
    actorClerkId: userId,
    actorRole: 'founder',
    action: mode === 'verify' ? 'account.verify' : 'account.unverify',
    targetType: 'user',
    targetId: target.clerkId,
    metadata: { status },
  })

  revalidatePath('/founder')
}
