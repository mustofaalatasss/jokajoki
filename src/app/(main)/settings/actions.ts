"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateSettings(nickname: string, jokiRole: string, rateCardPrice: number = 10000, rateCardFastTrack: number = 15000) {
  const { getCurrentUser } = await import("@/lib/session")
  const currentUser = await getCurrentUser()
  
  if (currentUser) {
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { nickname, jokiRole, rateCardPrice, rateCardFastTrack }
    })
  }

  revalidatePath("/dashboard")
  revalidatePath("/live")
  revalidatePath("/settings")
  revalidatePath("/", "layout")
  
  return { success: true }
}
