import { getDb } from '@/lib/db/client'

export async function getAdminOverview() {
  const db = getDb()
  const [clients, activeClients, pendingRequests, projects, submissions, latestClients] =
    await Promise.all([
      db.user.count({ where: { role: 'client' } }),
      db.user.count({ where: { role: 'client', status: 'active' } }),
      db.meetingRequest.count({ where: { status: 'pending' } }),
      db.project.count(),
      db.onboardingSubmission.count({ where: { status: 'submitted' } }),
      db.user.findMany({
        where: { role: 'client' },
        orderBy: { createdAt: 'desc' },
        take: 24,
        select: {
          clerkId: true,
          fullName: true,
          email: true,
          company: true,
          status: true,
          isDemo: true,
          createdAt: true,
          _count: { select: { projects: true } },
        },
      }),
    ])

  return { clients, activeClients, pendingRequests, projects, submissions, latestClients }
}

export async function getClientDetail(clerkId: string) {
  const db = getDb()
  const user = await db.user.findUnique({
    where: { clerkId },
    include: {
      submissions: { orderBy: { createdAt: 'desc' }, take: 5 },
      projects: {
        orderBy: { updatedAt: 'desc' },
        include: { updates: { orderBy: { createdAt: 'desc' }, take: 20 } },
      },
      meetingRequests: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { project: { select: { name: true } } },
      },
      notifications: { orderBy: { createdAt: 'desc' }, take: 30 },
      clientNotes: { orderBy: { createdAt: 'desc' }, take: 50 },
    },
  })
  if (!user) return null

  const conversations = await db.conversation.findMany({
    where: { project: { clientId: clerkId } },
    orderBy: { lastMessageAt: 'desc' },
    include: {
      project: { select: { name: true } },
      messages: { orderBy: { createdAt: 'asc' }, take: 200 },
    },
  })

  return { user, conversations }
}

export async function listMeetingRequests() {
  return getDb().meetingRequest.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    take: 50,
    include: {
      client: { select: { fullName: true, email: true, company: true } },
      project: { select: { id: true, name: true } },
    },
  })
}

export async function listSubmissions() {
  return getDb().onboardingSubmission.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
}

export async function listAuditLogs() {
  return getDb().auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 })
}
