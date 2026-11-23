import { getDb } from '@/lib/db/client'
import { auditSafe } from '@/lib/security/audit'

export const dynamic = 'force-dynamic'

// Reset demo data nightly (Vercel Hobby allows one run per day).
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const authorization = request.headers.get('authorization')
  if (!secret || authorization !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const db = getDb()
  const demoUsers = await db.user.findMany({
    where: { isDemo: true },
    select: { clerkId: true },
  })
  const clerkIds = demoUsers.map((user) => user.clerkId)

  let deletedSubmissions = 0
  if (clerkIds.length > 0) {
    const deleted = await db.onboardingSubmission.deleteMany({
      where: { clerkUserId: { in: clerkIds } },
    })
    deletedSubmissions = deleted.count
  }

  const reset = await db.user.updateMany({
    where: { isDemo: true },
    data: { status: 'active' },
  })

  await auditSafe({
    actorRole: 'system',
    action: 'demo.reset',
    targetType: 'system',
    metadata: { demoUsers: reset.count, deletedSubmissions },
  })

  return Response.json({ ok: true, demoUsers: reset.count, deletedSubmissions })
}
