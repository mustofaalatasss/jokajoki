"use server"

import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"

export async function getJokis() {
  const user = await getCurrentUser()
  if (user.role !== "ADMIN") throw new Error("Unauthorized")

  return prisma.user.findMany({
    where: { role: "JOKI" },
    include: {
      liveSessionsCreated: {
        select: { totalRevenue: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })
}

export async function extendSubscription(userId: string, months: number) {
  const admin = await getCurrentUser()
  if (admin.role !== "ADMIN") throw new Error("Unauthorized")

  const joki = await prisma.user.findUnique({ where: { id: userId } })
  if (!joki) throw new Error("Joki tidak ditemukan")

  let newEnd = joki.subscriptionEndsAt ? new Date(joki.subscriptionEndsAt) : new Date()
  if (newEnd < new Date()) {
    newEnd = new Date()
  }
  
  newEnd.setMonth(newEnd.getMonth() + months)

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionEndsAt: newEnd,
      subscriptionStatus: "ACTIVE"
    }
  })

  return { success: true }
}

export async function extendSubscriptionDays(userId: string, days: number) {
  const admin = await getCurrentUser()
  if (admin.role !== "ADMIN") throw new Error("Unauthorized")

  const joki = await prisma.user.findUnique({ where: { id: userId } })
  if (!joki) throw new Error("Joki tidak ditemukan")

  let newEnd = joki.subscriptionEndsAt ? new Date(joki.subscriptionEndsAt) : new Date()
  if (newEnd < new Date()) {
    newEnd = new Date()
  }
  
  newEnd.setDate(newEnd.getDate() + days)

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionEndsAt: newEnd,
      subscriptionStatus: "ACTIVE"
    }
  })

  return { success: true }
}

export async function blockJoki(userId: string) {
  const admin = await getCurrentUser()
  if (admin.role !== "ADMIN") throw new Error("Unauthorized")

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionEndsAt: new Date(Date.now() - 86400000), // Kemarin (Sudah kedaluwarsa)
      subscriptionStatus: "EXPIRED"
    }
  })

  return { success: true }
}
