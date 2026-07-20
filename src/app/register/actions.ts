"use server"

import prisma from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"

export async function registerJoki(formData: FormData) {
  const nickname = formData.get("nickname") as string
  const password = formData.get("password") as string
  const email = formData.get("email") as string

  if (!nickname || !password) {
    return { error: "Nickname dan Password wajib diisi!" }
  }

  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ nickname }, { email: email || `${nickname}@jokajoki.com` }] }
    })
    
    if (existing) {
      return { error: "Nickname sudah dipakai, silakan gunakan yang lain." }
    }

    // Tidak ada free trial, default belum bayar (EXPIRED)

    const fallbackEmail = email || `${nickname.replace(/\s+/g, "").toLowerCase()}@jokajoki.com`

    await prisma.$transaction(async (tx) => {
      // 1. Buat User (Joki)
      const user = await tx.user.create({
        data: {
          name: nickname,
          nickname: nickname,
          email: fallbackEmail,
          emailVerified: false,
          role: "JOKI",
          rawPassword: password, // SESUAI REQUEST: Simpan secara transparan untuk Owner
          subscriptionEndsAt: null, // Belum bayar / belum diaktifkan
          subscriptionStatus: "EXPIRED"
        }
      })

      // 2. Buat Organisasi unik untuk Joki ini (SaaS Isolation)
      const org = await tx.organization.create({
        data: {
          name: `Org ${nickname}`,
          slug: `${nickname.replace(/\s+/g, "-").toLowerCase()}-${uuidv4().slice(0,6)}`,
        }
      })

      // 3. Gabungkan Joki sebagai pemilik organisasi
      await tx.organizationMember.create({
        data: {
          userId: user.id,
          organizationId: org.id,
          role: "pemilik" // Owner of their own tenant
        }
      })

      // 4. Buat Live Session Default
      const liveSession = await tx.liveSession.create({
        data: {
          organizationId: org.id,
          sessionName: "Sesi Live Default",
          status: "aktif",
          startedAt: new Date(),
          createdBy: user.id
        }
      })

      await tx.sessionCounter.create({
        data: {
          liveSessionId: liveSession.id,
          nextRegistrationNumber: 1,
          nextMatchNumber: 1
        }
      })
    })

    return { success: true }
  } catch (err: any) {
    console.error("Register Error:", err)
    return { error: "Gagal membuat akun." }
  }
}
