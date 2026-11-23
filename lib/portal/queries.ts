import { getDb } from '@/lib/db/client'
import { isFounder } from '@/lib/auth/session'

const EPOCH = new Date(0)

export async function getClientOverview(clerkId: string) {
  const db = getDb()

  const [projects, updates, notifications, conversations, pendingMeeting] = await Promise.all([
    db.project.findMany({
      where: { clientId: clerkId },
      orderBy: { updatedAt: 'desc' },
      take: 6,
      select: { id: true, name: true, status: true, expectedCompletion: true },
    }),
    db.projectUpdate.findMany({
      where: { project: { clientId: clerkId } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        createdAt: true,
        projectId: true,
        project: { select: { name: true } },
      },
    }),
    db.notification.findMany({
      where: { recipientClerkId: clerkId, readAt: null },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { id: true, type: true, title: true, body: true, linkUrl: true, createdAt: true },
    }),
    db.conversation.findMany({
      where: { project: { clientId: clerkId } },
      orderBy: { lastMessageAt: 'desc' },
      take: 5,
      select: {
        id: true,
        projectId: true,
        lastMessageAt: true,
        clientLastReadAt: true,
        project: { select: { name: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { body: true, senderRole: true, createdAt: true },
        },
      },
    }),
    db.meetingRequest.findFirst({
      where: { clientId: clerkId, status: 'pending' },
      select: { id: true, createdAt: true },
    }),
  ])

  const unreadByConversation = await Promise.all(
    conversations.map((conversation) =>
      db.message.count({
        where: {
          conversationId: conversation.id,
          senderRole: 'team_member',
          createdAt: { gt: conversation.clientLastReadAt ?? EPOCH },
        },
      })
    )
  )

  return {
    projects,
    updates,
    notifications,
    conversations: conversations.map((conversation, index) => ({
      ...conversation,
      unread: unreadByConversation[index] ?? 0,
    })),
    pendingMeeting,
  }
}

export async function getProjectWorkspace(projectId: string) {
  const db = getDb()
  const conversation = await db.conversation.findUnique({ where: { projectId } })

  const [updates, messages, pendingMeeting] = await Promise.all([
    db.projectUpdate.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        title: true,
        description: true,
        attachmentPath: true,
        attachmentName: true,
        authorClerkId: true,
        createdAt: true,
      },
    }),
    conversation
      ? db.message.findMany({
          where: { conversationId: conversation.id },
          orderBy: { createdAt: 'asc' },
          take: 200,
          select: { id: true, senderClerkId: true, senderRole: true, body: true, createdAt: true },
        })
      : Promise.resolve([]),
    db.meetingRequest.findFirst({
      where: { projectId, status: 'pending' },
      select: { id: true, createdAt: true },
    }),
  ])

  return { conversation, updates, messages, pendingMeeting }
}

export async function getTeamOverview(clerkId: string) {
  const db = getDb()
  const scope = isFounder(clerkId) ? {} : { members: { some: { clerkId } } }
  const [projects, pendingRequests, updates] = await Promise.all([
    db.project.findMany({
      where: scope,
      orderBy: { updatedAt: 'desc' },
      take: 30,
      select: {
        id: true,
        name: true,
        status: true,
        client: { select: { fullName: true, company: true, email: true } },
        _count: { select: { updates: true } },
      },
    }),
    db.meetingRequest.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'asc' },
      take: 20,
      select: {
        id: true,
        message: true,
        createdAt: true,
        client: { select: { fullName: true, email: true, company: true } },
        project: { select: { id: true, name: true } },
      },
    }),
    db.projectUpdate.findMany({
      where: { project: scope },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true, createdAt: true, project: { select: { name: true } } },
    }),
  ])
  return { projects, pendingRequests, updates }
}
