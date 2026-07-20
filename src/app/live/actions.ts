"use server"

import prisma from "@/lib/prisma"

export async function getLiveState(nickname: string) {
  const user = await prisma.user.findFirst({
    where: { nickname, role: "JOKI" },
    include: { organizationMembers: { include: { organization: true } } }
  })

  if (!user || !user.organizationMembers[0]) {
    return { currentMatch: null, queues: [], totalWaiting: 0 }
  }

  const orgId = user.organizationMembers[0].organizationId

  const session = await prisma.liveSession.findFirst({
    where: { organizationId: orgId, status: { in: ["aktif", "istirahat", "belum_dimulai"] } },
    orderBy: { createdAt: "desc" }
  })

  if (!session) {
    return { currentMatch: null, queues: [], totalWaiting: 0 }
  }

  const currentMatch = await prisma.mabarMatch.findFirst({
    where: { liveSessionId: session.id, status: "sedang_berjalan" },
    include: {
      matchPlayers: {
        include: { customer: true }
      }
    },
    orderBy: { startedAt: "desc" }
  })

  let formattedMatch = null
  if (currentMatch) {
    formattedMatch = {
      id: currentMatch.id,
      startedAt: currentMatch.startedAt,
      players: currentMatch.matchPlayers.map(mp => ({
        id: mp.customerId,
        nickname: mp.customer.mlNickname,
        role: "USER"
      }))
    }
  }

  const entries = await prisma.mabarEntry.findMany({
    where: { liveSessionId: session.id, status: { in: ["menunggu_antrean", "menunggu_pergantian"] } },
    orderBy: [
      { serviceType: "asc" },
      { registrationNumber: "asc" }
    ],
    take: 10,
    include: {
      customer: true
    }
  })

  const queues = entries.map(entry => ({
    id: entry.id,
    type: entry.serviceType === "fast_track" ? "FAST_TRACK" : "REGULAR",
    createdAt: entry.registeredAt,
    user: {
      id: entry.customerId,
      nickname: entry.customer.mlNickname,
      role: "USER"
    }
  }))

  const totalWaiting = await prisma.mabarEntry.count({
    where: { liveSessionId: session.id, status: { in: ["menunggu_antrean", "menunggu_pergantian"] } }
  })

  return { currentMatch: formattedMatch, queues, totalWaiting }
}
