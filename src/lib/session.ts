import prisma from "./prisma"
import { cache } from "react"
import { cookies } from "next/headers"
import { verifyToken } from "./jwt"

/**
 * Mendapatkan User (Joki) yang sedang login berdasarkan cookie session.
 * Mendukung JWT (baru) dan JSON (lama, backward compatible).
 */
export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies()
  const sessionData = cookieStore.get("jokajoki-session")?.value
  if (!sessionData) throw new Error("Not authenticated")
  
  let role: string
  let userId: string

  try {
    // Coba verifikasi sebagai JWT terlebih dahulu (format baru, aman)
    const payload = await verifyToken(sessionData)
    role = payload.role
    userId = payload.userId
  } catch {
    // Fallback: coba parse sebagai JSON lama (backward compatibility)
    try {
      const parsed = JSON.parse(sessionData)
      if (!parsed.userId || !parsed.role) throw new Error("Invalid session format")
      role = parsed.role
      userId = parsed.userId
    } catch {
      throw new Error("Invalid session")
    }
  }

  // For Super Admin fallback
  if (role === "ADMIN" && userId === "admin") {
    let admin = await prisma.user.findFirst({ where: { role: "ADMIN" } })
    if (!admin) {
      admin = await prisma.user.create({
        data: {
          id: "admin-system",
          name: "Super Admin",
          email: "owner@jokajoki.com",
          emailVerified: true,
          role: "ADMIN"
        }
      })
    }
    return admin
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error("User not found")
  return user
})

/**
 * Mendapatkan Organization untuk user (Joki) yang sedang login.
 */
export const getOrganizationForUser = cache(async (userId: string) => {
  const member = await prisma.organizationMember.findFirst({
    where: { userId },
    include: { organization: true }
  })
  
  if (!member) {
    throw new Error("Organisasi tidak ditemukan untuk user ini. Silakan hubungi Owner.")
  }

  return member.organization
})

/**
 * Mendapatkan LiveSession aktif untuk hari ini.
 * Jika tidak ada sesi aktif, otomatis membuat sesi baru.
 * Jika ada pelanggan carry_over dari sesi sebelumnya, otomatis pindahkan ke sesi baru.
 */
export const getActiveLiveSession = cache(async (orgId: string, adminUserId: string) => {
  let session = await prisma.liveSession.findFirst({
    where: { 
      organizationId: orgId,
      status: { in: ["belum_dimulai", "aktif", "istirahat"] }
    },
    orderBy: { createdAt: "desc" }
  })

  // HELPER: Normalize Role (sama seperti di actions.ts)
  function normalizeRole(role: string | null): string {
    const r = (role || "").toLowerCase().trim()
    if (r.includes("mage") || r.includes("mid")) return "mid laner"
    if (r.includes("tank") || r.includes("roam")) return "roamer"
    if (r.includes("marksman") || r.includes("gold")) return "gold laner"
    if (r.includes("fighter") || r.includes("exp")) return "exp laner"
    if (r.includes("jungler") || r.includes("hyper") || r.includes("assassin") || r.includes("core")) return "jungler"
    return "flex"
  }

  if (!session) {
    // Create new session
    session = await prisma.liveSession.create({
      data: {
        organizationId: orgId,
        sessionName: `Sesi Mabar ${new Date().toLocaleDateString("id-ID")}`,
        status: "aktif",
        defaultPricePerMatch: 15000,
        defaultFastTrackFee: 10000,
        maximumActiveSlots: 4,
        startedAt: new Date(),
        createdBy: adminUserId
      }
    })

    // Create session counter
    await prisma.sessionCounter.create({
      data: { liveSessionId: session.id }
    })

    // === CARRY-OVER LOGIC ===
    // Find carry_over entries from the most recent closed session
    const lastClosedSession = await prisma.liveSession.findFirst({
      where: { organizationId: orgId, status: "selesai" },
      orderBy: { endedAt: "desc" }
    })

    if (lastClosedSession) {
      const carryOverEntries = await prisma.mabarEntry.findMany({
        where: { liveSessionId: lastClosedSession.id, status: "carry_over" },
        orderBy: { registrationNumber: "asc" }
      })

      if (carryOverEntries.length > 0) {
        // Get or create session counter for registration numbers
        let counter = await prisma.sessionCounter.findUnique({
          where: { liveSessionId: session.id }
        })
        
        let regNum = counter?.nextRegistrationNumber || 1
        let squadCount = 0
        const filledRoles: string[] = [] // Lacak role yang sudah ada di skuad sesi baru

        for (const entry of carryOverEntries) {
          // Determine new status: first 4 go to squad, rest to queue
          let newStatus = "menunggu_antrean"
          let newSlot: number | null = null

          if (squadCount < 4) {
            const normalizedRole = normalizeRole(entry.primaryRole || "Flex")
            // Hanya masukkan ke skuad jika rolenya belum terisi (atau flex)
            if (normalizedRole === "flex" || !filledRoles.includes(normalizedRole)) {
              newStatus = "naik_ke_squad"
              newSlot = squadCount + 1
              squadCount++
              if (normalizedRole !== "flex") filledRoles.push(normalizedRole)
            }
          }

          // Create new entry in new session (clone from old one)
          await prisma.mabarEntry.create({
            data: {
              organizationId: orgId,
              liveSessionId: session.id,
              customerId: entry.customerId,
              registrationNumber: regNum,
              serviceType: entry.serviceType,
              status: newStatus,
              primaryRole: entry.primaryRole,
              secondaryRole: entry.secondaryRole,
              rankSnapshot: entry.rankSnapshot,
              matchesPurchased: entry.matchesRemaining, // Only remaining matches carry over
              matchesCompleted: 0,
              matchesRemaining: entry.matchesRemaining,
              activeSlot: newSlot,
              squadJoinedAt: newSlot ? new Date() : null,
              notes: `[Carry-over dari ${lastClosedSession.sessionName}]`,
              createdBy: adminUserId
            }
          })

          // Mark old entry as fully transferred
          await prisma.mabarEntry.update({
            where: { id: entry.id },
            data: { status: "selesai", notes: (entry.notes || "") + " | [Dipindah ke sesi baru]" }
          })

          regNum++
        }

        // Update session counter
        await prisma.sessionCounter.update({
          where: { liveSessionId: session.id },
          data: { nextRegistrationNumber: regNum }
        })
      }
    }
  } else if (session.status === "belum_dimulai") {
    // Otomatis aktifkan
    session = await prisma.liveSession.update({
      where: { id: session.id },
      data: { status: "aktif", startedAt: new Date() }
    })
  }

  return session
})
