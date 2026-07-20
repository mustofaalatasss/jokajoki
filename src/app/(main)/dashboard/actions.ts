"use server"
import { checkDemoMutation } from "@/lib/checkDemo"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { getOrganizationForUser, getActiveLiveSession, getCurrentUser } from "@/lib/session"

import { cache } from "react"

// -------------------------------------------------------------
// HELPER: Normalize Role
// -------------------------------------------------------------
function normalizeRole(role: string | null): string {
  const r = (role || "").toLowerCase().trim()
  if (r.includes("mage") || r.includes("mid")) return "mid laner"
  if (r.includes("tank") || r.includes("roam")) return "roamer"
  if (r.includes("marksman") || r.includes("gold")) return "gold laner"
  if (r.includes("fighter") || r.includes("exp")) return "exp laner"
  if (r.includes("jungler") || r.includes("hyper") || r.includes("assassin") || r.includes("core")) return "jungler"
  return "flex"
}

// ==================== READ ====================

export async function getDashboardStats() {
  const user = await getCurrentUser()
  const org = await getOrganizationForUser(user.id)
  const session = await getActiveLiveSession(org.id, user.id)

  const [totalQueue, fastTrackCount, matchesDone, currentMatch, squadEntries] = await Promise.all([
    prisma.mabarEntry.count({ 
      where: { liveSessionId: session.id, status: { in: ["menunggu_antrean", "menunggu_pergantian", "dijeda_fast_track"] } } 
    }),
    prisma.mabarEntry.count({ 
      where: { liveSessionId: session.id, serviceType: "fast_track", status: "menunggu_pergantian" } 
    }),
    prisma.mabarMatch.count({ 
      where: { liveSessionId: session.id, status: "selesai" } 
    }),
    prisma.mabarMatch.findFirst({
      where: { liveSessionId: session.id, status: "sedang_berjalan" },
      orderBy: { startedAt: "desc" },
    }),
    prisma.mabarEntry.findMany({
      where: { liveSessionId: session.id, status: { in: ["naik_ke_squad", "sedang_main"] } },
      include: { customer: true },
      orderBy: { activeSlot: "asc" }
    })
  ])

  // Format currentMatch
  let formattedCurrentMatch = null
  if (currentMatch) {
    formattedCurrentMatch = {
      id: currentMatch.id,
      status: currentMatch.status,
      startedAt: currentMatch.startedAt || new Date(),
      endedAt: currentMatch.completedAt,
    }
  }

  // Format activeSquad
  const activeSquad = squadEntries.map(entry => ({
    id: entry.id,
    customerId: entry.customerId,
    nickname: entry.customer.mlNickname,
    role: entry.primaryRole || "Flex",
    rank: entry.rankSnapshot || entry.customer.currentRank || "Mythic",
    matchesPurchased: entry.matchesPurchased,
    matchesRemaining: entry.matchesRemaining,
    activeSlot: entry.activeSlot,
    type: entry.serviceType === "fast_track" ? "FAST_TRACK" : "REGULAR"
  }))

  return { totalQueue, fastTrackCount, matchesDone, currentMatch: formattedCurrentMatch, activeSquad }
}

export async function getQueueList(limit: number = 7) {
  const user = await getCurrentUser()
  const org = await getOrganizationForUser(user.id)
  const session = await getActiveLiveSession(org.id, user.id)

  const entries = await prisma.mabarEntry.findMany({
    where: { 
      liveSessionId: session.id, 
      status: { in: ["menunggu_antrean", "menunggu_pergantian", "dijeda_fast_track", "tidak_ada_kabar"] }
    },
    include: { customer: true },
    orderBy: [
      { serviceType: "asc" }, // fast_track (f) comes before reguler (r)
      { status: "asc" }, // dijeda_fast_track (d) comes before menunggu_antrean (m)
      { registrationNumber: "asc" },
    ],
    take: limit,
  })

  const queues = entries.map(entry => ({
    id: entry.id,
    type: entry.serviceType === "fast_track" ? "FAST_TRACK" : "REGULAR",
    status: entry.status,
    note: entry.notes,
    createdAt: entry.registeredAt,
    matchesRemaining: entry.matchesRemaining,
    role: entry.primaryRole || "Flex",
    rank: entry.rankSnapshot || entry.customer.currentRank || "Mythic",
    user: {
      id: entry.customerId,
      nickname: entry.customer.mlNickname,
      role: "USER"
    }
  }))

  const totalWaiting = await prisma.mabarEntry.count({ 
    where: { liveSessionId: session.id, status: { in: ["menunggu_antrean", "menunggu_pergantian", "dijeda_fast_track", "tidak_ada_kabar"] } } 
  })

  return { queues, totalWaiting }
}

export async function getCurrentMatch() {
  const user = await getCurrentUser()
  const org = await getOrganizationForUser(user.id)
  const session = await getActiveLiveSession(org.id, user.id)

  return prisma.mabarMatch.findFirst({
    where: { liveSessionId: session.id, status: "sedang_berjalan" },
    include: { matchPlayers: { include: { customer: true } } },
    orderBy: { startedAt: "desc" },
  })
}

export async function getJoki() {
  return getCurrentUser()
}

// ==================== CREATE ====================

export async function addToQueue(nickname: string, type: "REGULAR" | "FAST_TRACK", role: string = "Flex", matchesPurchased: number = 1, forceWarningAccepted: boolean = false, rank: string = "Mythic") {
  await checkDemoMutation();
  const user = await getCurrentUser()
  const org = await getOrganizationForUser(user.id)
  const session = await getActiveLiveSession(org.id, user.id)

  // Cari atau buat customer
  let customer = await prisma.customer.findFirst({ 
    where: { organizationId: org.id, mlNickname: nickname } 
  })
  if (!customer) {
    customer = await prisma.customer.create({
      data: { 
        organizationId: org.id, 
        mlNickname: nickname,
        mlUserId: `UNKNOWN_${crypto.randomUUID().split("-")[0]}`,
        mlServerId: "0000",
        currentRank: rank
      },
    })
  } else {
    // Update rank if changed
    if (customer.currentRank !== rank) {
      await prisma.customer.update({ where: { id: customer.id }, data: { currentRank: rank } })
    }
  }

  // Cek apakah customer sudah di antrean di sesi ini
  const existingEntry = await prisma.mabarEntry.findFirst({
    where: { 
      liveSessionId: session.id, 
      customerId: customer.id, 
      status: { in: ["menunggu_antrean", "menunggu_pergantian", "naik_ke_squad", "sedang_main", "dijeda_fast_track"] } 
    },
  })
  
  if (existingEntry) {
    return { error: "Pemain ini sedang aktif atau sudah di antrean sesi ini!" }
  }

  // Cek Blacklist
  if (customer.isBlacklisted) {
    return { error: `Gagal: Pemain ini telah di-blacklist. Alasan: ${customer.blacklistReason || "Melanggar aturan"}` }
  }

  // Hitung jumlah pemain di skuad saat ini
  const activeMatch = await prisma.mabarMatch.findFirst({
    where: { liveSessionId: session.id, status: "sedang_berjalan" }
  })
  const isMatchRunning = !!activeMatch

  // FAST TRACK WARNING LOGIC
  if (type === "FAST_TRACK" && !forceWarningAccepted) {
    const existingFT = await prisma.mabarEntry.findFirst({
      where: { 
        liveSessionId: session.id, 
        serviceType: "fast_track", 
        primaryRole: { equals: role, mode: "insensitive" },
        status: { in: ["naik_ke_squad", "sedang_main", "menunggu_pergantian"] }
      }
    })
    if (existingFT) {
      return { 
        requiresConfirmation: true, 
        message: `Sudah ada pelanggan Fast Track lain yang menggunakan role ${role}. Anda tidak bisa menggesernya dan harus menunggu di antrean (tetap diprioritaskan). Lanjutkan?` 
      }
    }
  }

  await prisma.$transaction(async (tx) => {
    let counter = await tx.sessionCounter.findUnique({ where: { liveSessionId: session.id }})
    if (!counter) {
       counter = await tx.sessionCounter.create({ data: { liveSessionId: session.id } })
    }

    const updatedCounter = await tx.sessionCounter.update({
      where: { liveSessionId: session.id },
      data: { nextRegistrationNumber: { increment: 1 } }
    })

    // Cari tahu kondisi squad saat ini
    const currentSquad = await tx.mabarEntry.findMany({
      where: { liveSessionId: session.id, status: { in: ["naik_ke_squad", "sedang_main"] } },
      select: { id: true, activeSlot: true, primaryRole: true, serviceType: true }
    })
    
    let assignedSlot: number | null = null
    let initialStatus = type === "FAST_TRACK" ? "menunggu_pergantian" : "menunggu_antrean"

    // Jika Fast Track tapi ada tabrakan (forceWarningAccepted), maka WAJIB menunggu di antrean
    const isForcedCollision = type === "FAST_TRACK" && forceWarningAccepted;

    if (!isForcedCollision) {
      if (currentSquad.length < 4) {
        // Ada slot kosong, auto join (meskipun match berjalan, mereka naik_ke_squad siap untuk next match)
        // TETAPI HANYA BISA MASUK JIKA ROLENYA BELUM DIAMBIL (atau Flex)
        const existingRoles = currentSquad.map(e => normalizeRole(e.primaryRole)).filter(r => r !== "flex")
        const newRole = normalizeRole(role)
        
        if (newRole === "flex" || !existingRoles.includes(newRole)) {
          const takenSlots = currentSquad.map(e => e.activeSlot).filter(s => s !== null) as number[]
          for (let i = 1; i <= 4; i++) {
            if (!takenSlots.includes(i)) {
              assignedSlot = i
              break
            }
          }
          initialStatus = "naik_ke_squad"
        }
      } else if (!isMatchRunning && type === "FAST_TRACK") {
        // Skuad penuh, tidak ada match jalan, Fast Track masuk -> Geser reguler
        const regularPlayers = currentSquad.filter(p => p.serviceType === "reguler")
        if (regularPlayers.length > 0) {
          // Cari yang rolenya sama, jika tidak ada ambil yang pertama
          let victim = regularPlayers.find(p => normalizeRole(p.primaryRole) === normalizeRole(role))
          if (!victim) victim = regularPlayers[0]

          await tx.mabarEntry.update({
            where: { id: victim.id },
            data: { status: "dijeda_fast_track", activeSlot: null }
          })
          
          assignedSlot = victim.activeSlot
          initialStatus = "naik_ke_squad"
        }
      }
    }

    await tx.mabarEntry.create({
      data: {
        organizationId: org.id,
        liveSessionId: session.id,
        customerId: customer.id,
        registrationNumber: updatedCounter.nextRegistrationNumber - 1,
        serviceType: type === "FAST_TRACK" ? "fast_track" : "reguler",
        status: initialStatus,
        primaryRole: role,
        rankSnapshot: rank,
        matchesPurchased: matchesPurchased,
        matchesRemaining: matchesPurchased,
        activeSlot: assignedSlot,
        squadJoinedAt: assignedSlot ? new Date() : null,
        createdBy: user.id
      },
    })
  })

  revalidatePath("/dashboard")
  return { success: true }
}

export async function pullToSquad(queueId: string) {
  await checkDemoMutation();
  const user = await getCurrentUser()
  const org = await getOrganizationForUser(user.id)
  const session = await getActiveLiveSession(org.id, user.id)

  await prisma.$transaction(async (tx) => {
    // Find empty slot
    const currentActive = await tx.mabarEntry.findMany({
      where: { liveSessionId: session.id, status: { in: ["naik_ke_squad", "sedang_main"] } },
      select: { activeSlot: true }
    })
    const takenSlots = currentActive.map(e => e.activeSlot).filter(s => s !== null) as number[]
    let assignedSlot = null
    for (let i = 1; i <= 4; i++) {
      if (!takenSlots.includes(i)) {
        assignedSlot = i
        break
      }
    }

    if (assignedSlot) {
      await tx.mabarEntry.update({
        where: { id: queueId },
        data: {
          status: "naik_ke_squad",
          activeSlot: assignedSlot,
          squadJoinedAt: new Date()
        }
      })
    }
  })
  
  revalidatePath("/dashboard")
  return { success: true }
}

export async function removeFromQueue(queueId: string) { // queueId is now mabarEntry.id
  const user = await getCurrentUser()
  const org = await getOrganizationForUser(user.id)

  // Verifikasi bahwa entry ini milik organisasi user
  const entry = await prisma.mabarEntry.findUnique({ where: { id: queueId } })
  if (!entry || entry.organizationId !== org.id) {
    return { error: "Data tidak ditemukan atau bukan milik Anda" }
  }

  await prisma.mabarEntry.update({
    where: { id: queueId },
    data: { status: "dibatalkan", activeSlot: null },
  })
  revalidatePath("/dashboard")
  return { success: true }
}

export async function kickFromSquad(queueId: string, autoPull: boolean = true) {
  await checkDemoMutation();
  const user = await getCurrentUser()
  const org = await getOrganizationForUser(user.id)
  const session = await getActiveLiveSession(org.id, user.id)

  await prisma.$transaction(async (tx) => {
    // 1. Get the entry
    const entry = await tx.mabarEntry.findUnique({ where: { id: queueId } })
    if (!entry || entry.status !== "naik_ke_squad") return

    // 2. Assign new registration number (send to back of the line)
    const counter = await tx.sessionCounter.update({
      where: { liveSessionId: session.id },
      data: { nextRegistrationNumber: { increment: 1 } }
    })

    const emptySlot = entry.activeSlot
    const roleNeeded = entry.primaryRole || "Flex"

    // 3. Demote the player to the back of the line with status tidak_ada_kabar
    await tx.mabarEntry.update({
      where: { id: queueId },
      data: {
        status: "tidak_ada_kabar",
        activeSlot: null,
        registrationNumber: counter.nextRegistrationNumber - 1,
        squadJoinedAt: null
      }
    })

    if (autoPull) {
      // 4. Find replacement in queue with the SAME role
      if (emptySlot) {
        const replacement = await tx.mabarEntry.findFirst({
          where: {
            id: { not: queueId },
            liveSessionId: session.id,
            status: { in: ["menunggu_antrean", "menunggu_pergantian", "dijeda_fast_track"] },
            primaryRole: { in: [roleNeeded, "Flex"] }
          },
          orderBy: [
            { serviceType: "asc" }, // fast_track first
            { status: "asc" }, // dijeda_fast_track before menunggu_antrean
            { registrationNumber: "asc" }
          ]
        })

        // 5. If found, pull them up automatically
        if (replacement) {
          await tx.mabarEntry.update({
            where: { id: replacement.id },
            data: {
              status: "naik_ke_squad",
              activeSlot: emptySlot,
              squadJoinedAt: new Date()
            }
          })
        }
      }
    }
  })

  revalidatePath("/dashboard")
  return { success: true }
}

// ==================== MATCH ====================

export async function startMatch(queueIds: string[]) {
  await checkDemoMutation();
  const user = await getCurrentUser()
  const org = await getOrganizationForUser(user.id)
  const session = await getActiveLiveSession(org.id, user.id)

  const entries = await prisma.mabarEntry.findMany({
    where: { id: { in: queueIds } },
    include: { customer: true },
  })

  if (entries.length === 0) {
    return { error: "Tidak ada pemain yang dipilih!" }
  }

  // Cek match aktif
  const activeMatch = await prisma.mabarMatch.findFirst({
    where: { liveSessionId: session.id, status: "sedang_berjalan" },
  })
  if (activeMatch) {
    return { error: "Masih ada match yang sedang berlangsung!" }
  }

  await prisma.$transaction(async (tx) => {
    const counter = await tx.sessionCounter.update({
      where: { liveSessionId: session.id },
      data: { nextMatchNumber: { increment: 1 } }
    })

    const match = await tx.mabarMatch.create({
      data: {
        organizationId: org.id,
        liveSessionId: session.id,
        matchNumber: counter.nextMatchNumber - 1,
        status: "sedang_berjalan",
        startedAt: new Date(),
        createdBy: user.id
      },
    })

    // Buat match players
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]
      await tx.matchPlayer.create({
        data: {
          organizationId: org.id,
          matchId: match.id,
          mabarEntryId: entry.id,
          customerId: entry.customerId,
          slotNumber: i + 1,
          joinedMatch: true
        }
      })
      
      // Update antrean
      await tx.mabarEntry.update({
        where: { id: entry.id },
        data: { 
          status: "sedang_main",
          activeSlot: i + 1,
          squadJoinedAt: entry.squadJoinedAt || new Date()
        }
      })
    }
  }, {
    maxWait: 10000,
    timeout: 30000
  })

  revalidatePath("/dashboard")
  return { success: true }
}

export async function endMatch(matchId: string, result?: string) {
  await checkDemoMutation();
  // matchId is MabarMatch.id
  await prisma.$transaction(async (tx) => {
    // Determine match result enum
    let matchResult: string | undefined = undefined
    if (result) {
      const r = result.toLowerCase().trim()
      if (r.includes("menang") || r.includes("win")) matchResult = "WIN"
      else if (r.includes("kalah") || r.includes("loss") || r.includes("lose")) matchResult = "LOSS"
      else matchResult = "DRAW"
    }

    await tx.mabarMatch.update({
      where: { id: matchId },
      data: {
        status: "selesai",
        completedAt: new Date(),
        matchResult,
        notes: result ? `Hasil: ${result}` : undefined
      },
    })

    const matchPlayers = await tx.matchPlayer.findMany({
      where: { matchId, joinedMatch: true }
    })

    const session = await tx.mabarMatch.findUnique({
      where: { id: matchId },
      select: { liveSessionId: true }
    })
    
    if (!session) return

    const emptySlots: { slot: number, role: string }[] = []

    for (const mp of matchPlayers) {
      const entry = await tx.mabarEntry.findUnique({ where: { id: mp.mabarEntryId }})
      if (!entry) continue
      
      const newCompleted = entry.matchesCompleted + 1
      const newRemaining = entry.matchesPurchased - newCompleted
      
      if (newRemaining <= 0) {
        if (entry.activeSlot) {
          emptySlots.push({ slot: entry.activeSlot, role: entry.primaryRole || "Flex" })
        }
      }
      
      await tx.mabarEntry.update({
        where: { id: entry.id },
        data: {
          matchesCompleted: newCompleted,
          matchesRemaining: newRemaining,
          status: newRemaining <= 0 ? "selesai" : "naik_ke_squad",
          activeSlot: newRemaining <= 0 ? null : entry.activeSlot,
          completedAt: newRemaining <= 0 ? new Date() : null
        }
      })
    }

    // Check if we need to bump any regular players for waiting fast tracks
    const waitingFastTracks = await tx.mabarEntry.findMany({
      where: { liveSessionId: session.liveSessionId, status: "menunggu_pergantian", serviceType: "fast_track" },
      orderBy: { registrationNumber: "asc" }
    })
    
    if (waitingFastTracks.length > emptySlots.length) {
      const neededBumpCount = waitingFastTracks.length - emptySlots.length
      // Find vulnerable regular players in squad
      const vulnerablePlayers = await tx.mabarEntry.findMany({
        where: { liveSessionId: session.liveSessionId, status: "naik_ke_squad", serviceType: "reguler" },
        select: { id: true, activeSlot: true, primaryRole: true }
      })
      
      let bumped = 0
      for (const ft of waitingFastTracks) {
        if (bumped >= neededBumpCount) break
        
        // Find a regular player with the SAME role to bump
        const victimIndex = vulnerablePlayers.findIndex(vp => normalizeRole(vp.primaryRole) === normalizeRole(ft.primaryRole))
        if (victimIndex !== -1) {
          const victim = vulnerablePlayers[victimIndex]
          await tx.mabarEntry.update({
            where: { id: victim.id },
            data: { status: "dijeda_fast_track", activeSlot: null }
          })
          if (victim.activeSlot) {
            emptySlots.push({ slot: victim.activeSlot, role: victim.primaryRole || "Flex" })
          }
          vulnerablePlayers.splice(victimIndex, 1) // Remove from vulnerable list
          bumped++
        }
      }
      
      // If we STILL need to bump, but no exact role match was found (fallback just in case)
      while (bumped < neededBumpCount && vulnerablePlayers.length > 0) {
        const victim = vulnerablePlayers.shift()!
        await tx.mabarEntry.update({
          where: { id: victim.id },
          data: { status: "dijeda_fast_track", activeSlot: null }
        })
        if (victim.activeSlot) {
          emptySlots.push({ slot: victim.activeSlot, role: victim.primaryRole || "Flex" })
        }
        bumped++
      }
    }

    // Auto-fill empty slots
    for (const empty of emptySlots) {
      const nextCandidate = await tx.mabarEntry.findFirst({
        where: {
          liveSessionId: session.liveSessionId,
          status: { in: ["menunggu_antrean", "menunggu_pergantian", "dijeda_fast_track"] },
          primaryRole: { in: [empty.role, "Flex"] }
        },
        orderBy: [
          { serviceType: "asc" }, // fast track first
          { status: "asc" }, // dijeda_fast_track before menunggu_antrean
          { registrationNumber: "asc" }
        ]
      })

      if (nextCandidate) {
        await tx.mabarEntry.update({
          where: { id: nextCandidate.id },
          data: {
            status: "naik_ke_squad",
            activeSlot: empty.slot,
            squadJoinedAt: new Date()
          }
        })
      }
    }
  }, {
    maxWait: 10000,
    timeout: 30000
  })

  revalidatePath("/dashboard")
  revalidatePath("/history")
  return { success: true }
}

export async function cancelMatch(matchId: string) {
  await checkDemoMutation();
  const user = await getCurrentUser()
  const org = await getOrganizationForUser(user.id)

  // Verifikasi bahwa match ini milik organisasi user
  const matchCheck = await prisma.mabarMatch.findUnique({ where: { id: matchId } })
  if (!matchCheck || matchCheck.organizationId !== org.id) {
    return { error: "Match tidak ditemukan atau bukan milik Anda" }
  }

  await prisma.$transaction(async (tx) => {
    await tx.mabarMatch.update({
      where: { id: matchId },
      data: {
        status: "dibatalkan",
        cancelledAt: new Date(),
      },
    })

    const matchPlayers = await tx.matchPlayer.findMany({
      where: { matchId }
    })

    for (const mp of matchPlayers) {
      const entry = await tx.mabarEntry.findUnique({ where: { id: mp.mabarEntryId }})
      if (!entry) continue
      
      await tx.mabarEntry.update({
        where: { id: entry.id },
        data: {
          status: entry.serviceType === "fast_track" ? "menunggu_pergantian" : "menunggu_antrean",
          activeSlot: null
        }
      })
    }
  })

  revalidatePath("/dashboard")
  return { success: true }
}

export async function removePlayerFromMatch(matchId: string, userId: string) {
  await checkDemoMutation();
  const currentUser = await getCurrentUser()
  const org = await getOrganizationForUser(currentUser.id)

  // Verifikasi bahwa match ini milik organisasi user
  const matchCheck = await prisma.mabarMatch.findUnique({ where: { id: matchId } })
  if (!matchCheck || matchCheck.organizationId !== org.id) {
    return { error: "Match tidak ditemukan atau bukan milik Anda" }
  }

  // userId = customerId passed from frontend
  await prisma.$transaction(async (tx) => {
    const mp = await tx.matchPlayer.findFirst({
      where: { matchId, customerId: userId }
    })
    
    if (mp) {
      await tx.matchPlayer.update({
        where: { id: mp.id },
        data: { joinedMatch: false }
      })
      
      const entry = await tx.mabarEntry.findUnique({ where: { id: mp.mabarEntryId } })
      if (entry) {
        await tx.mabarEntry.update({
          where: { id: entry.id },
          data: {
            status: entry.serviceType === "fast_track" ? "menunggu_pergantian" : "menunggu_antrean",
            activeSlot: null
          }
        })
      }
    }
  })

  revalidatePath("/dashboard")
  return { success: true }
}

export async function grantBonusMatch(queueId: string, bonusCount: number, reason: string) {
  await checkDemoMutation();
  const user = await getCurrentUser()
  const org = await getOrganizationForUser(user.id)

  await prisma.$transaction(async (tx) => {
    const entry = await tx.mabarEntry.findUnique({ where: { id: queueId } })
    if (!entry || entry.organizationId !== org.id) return
    
    const newNote = entry.notes ? `${entry.notes} | [BONUS] ${bonusCount} Match - ${reason}` : `[BONUS] ${bonusCount} Match - ${reason}`

    await tx.mabarEntry.update({
      where: { id: queueId },
      data: {
        matchesPurchased: { increment: bonusCount },
        matchesRemaining: { increment: bonusCount },
        notes: newNote
      }
    })
  })
  revalidatePath("/dashboard")
  return { success: true }
}

export async function blacklistCustomer(queueId: string, reason: string) {
  await checkDemoMutation();
  const user = await getCurrentUser()
  const org = await getOrganizationForUser(user.id)

  await prisma.$transaction(async (tx) => {
    const entry = await tx.mabarEntry.findUnique({ where: { id: queueId } })
    if (!entry || entry.organizationId !== org.id) return
    
    // 1. Mark customer as blacklisted
    await tx.customer.update({
      where: { id: entry.customerId },
      data: {
        isBlacklisted: true,
        blacklistReason: reason
      }
    })

    // 2. Remove from active match if they are playing
    if (entry.status === "sedang_main") {
      const activeMatch = await tx.mabarMatch.findFirst({
        where: { liveSessionId: entry.liveSessionId, status: "sedang_berjalan" }
      })
      if (activeMatch) {
        const mp = await tx.matchPlayer.findFirst({
          where: { matchId: activeMatch.id, customerId: entry.customerId }
        })
        if (mp) {
          await tx.matchPlayer.update({
            where: { id: mp.id },
            data: { joinedMatch: false }
          })
        }
      }
    }

    // 3. Mark entry as dibatalkan and remove from squad
    await tx.mabarEntry.update({
      where: { id: queueId },
      data: {
        status: "dibatalkan",
        activeSlot: null,
        notes: entry.notes ? `${entry.notes} | [BLACKLISTED] ${reason}` : `[BLACKLISTED] ${reason}`
      }
    })
  })
  revalidatePath("/dashboard")
  return { success: true }
}

// ==================== HISTORY & CUSTOMERS ====================

export async function getMatchHistory() {
  const user = await getCurrentUser()
  const org = await getOrganizationForUser(user.id)
  
  const matches = await prisma.mabarMatch.findMany({
    where: { 
      organizationId: org.id,
      status: { in: ["selesai", "dibatalkan"] } 
    },
    include: { 
      matchPlayers: { include: { customer: true } }
    },
    orderBy: { startedAt: "desc" },
  })

  return matches.map(m => ({
    id: m.id,
    status: m.status === "selesai" ? "DONE" : "CANCELLED",
    startedAt: m.startedAt || new Date(),
    endedAt: m.completedAt || m.cancelledAt,
    players: m.matchPlayers.map(mp => ({
      id: mp.customerId,
      role: "USER",
      nickname: mp.customer.mlNickname
    }))
  }))
}

export async function getAllCustomers() {
  const user = await getCurrentUser()
  const org = await getOrganizationForUser(user.id)
  
  const customers = await prisma.customer.findMany({
    where: { organizationId: org.id },
    include: {
      mabarEntries: true,
      matchPlayers: true,
    },
    orderBy: { createdAt: "desc" },
  })
  
  // Transform data to match frontend expectations
  return customers.map(c => ({
    id: c.id,
    nickname: c.mlNickname,
    createdAt: c.createdAt,
    queues: c.mabarEntries.map(e => ({
      id: e.id,
      type: e.serviceType === "fast_track" ? "FAST_TRACK" : "REGULAR"
    })),
    matches: c.matchPlayers.map(m => ({
      id: m.id,
      matchId: m.matchId
    }))
  }))
}

export async function searchCustomers(query: string) {
  if (!query || query.length < 2) return []
  const user = await getCurrentUser()
  const org = await getOrganizationForUser(user.id)
  
  const customers = await prisma.customer.findMany({
    where: { 
      organizationId: org.id,
      mlNickname: { contains: query, mode: "insensitive" }
    },
    take: 5,
    select: { mlNickname: true, currentRank: true, primaryRole: true, isBlacklisted: true, blacklistReason: true }
  })
  return customers
}

export async function quickProcessMatches(wins: number, losses: number) {
  await checkDemoMutation();
  const user = await getCurrentUser()
  const org = await getOrganizationForUser(user.id)
  const session = await getActiveLiveSession(org.id, user.id)
  
  const totalMatches = wins + losses
  let currentWins = 0

  for (let i = 0; i < totalMatches; i++) {
    // 1. Get active match
    let activeMatch = await prisma.mabarMatch.findFirst({
      where: { liveSessionId: session.id, status: "sedang_berjalan" }
    })

    // 2. If no active match, try to start one with current squad
    if (!activeMatch) {
      const activeSquad = await prisma.mabarEntry.findMany({
        where: { liveSessionId: session.id, status: { in: ["naik_ke_squad", "sedang_main"] } },
      })
      if (activeSquad.length > 0) {
        await startMatch(activeSquad.map(s => s.id))
        activeMatch = await prisma.mabarMatch.findFirst({
          where: { liveSessionId: session.id, status: "sedang_berjalan" },
          orderBy: { createdAt: 'desc' }
        })
      } else {
        break // No more players left in squad, stop simulating
      }
    }

    if (!activeMatch) break

    // 3. Determine result for this simulated match
    let result = "Menang"
    if (currentWins < wins) {
      result = "Menang"
      currentWins++
    } else {
      result = "Kalah"
    }

    // 4. End the match, which handles queue rotations internally
    await endMatch(activeMatch.id, result)
  }

  revalidatePath("/dashboard")
  return { success: true }
}

// ==================== SESSION MANAGEMENT ====================

export async function getActiveSessionInfo() {
  const user = await getCurrentUser()
  const org = await getOrganizationForUser(user.id)
  const session = await getActiveLiveSession(org.id, user.id)

  // Count active customers
  const activeCounts = await prisma.mabarEntry.groupBy({
    by: ["status"],
    where: { 
      liveSessionId: session.id, 
      status: { in: ["naik_ke_squad", "sedang_main", "menunggu_antrean", "menunggu_pergantian", "dijeda_fast_track"] }
    },
    _count: true
  })

  const totalActive = activeCounts.reduce((sum, g) => sum + g._count, 0)
  const inSquad = activeCounts.filter(g => ["naik_ke_squad", "sedang_main"].includes(g.status)).reduce((sum, g) => sum + g._count, 0)
  const inQueue = totalActive - inSquad

  // Check running match
  const runningMatch = await prisma.mabarMatch.findFirst({
    where: { liveSessionId: session.id, status: "sedang_berjalan" }
  })

  return {
    sessionId: session.id,
    sessionName: session.sessionName,
    startedAt: session.startedAt,
    totalActive,
    inSquad,
    inQueue,
    hasRunningMatch: !!runningMatch
  }
}

export async function closeSession(forceClose: boolean = false) {
  await checkDemoMutation();
  const user = await getCurrentUser()
  const org = await getOrganizationForUser(user.id)
  const session = await getActiveLiveSession(org.id, user.id)

  // Count active customers
  const activeEntries = await prisma.mabarEntry.findMany({
    where: { 
      liveSessionId: session.id, 
      status: { in: ["naik_ke_squad", "sedang_main", "menunggu_antrean", "menunggu_pergantian", "dijeda_fast_track", "tidak_ada_kabar"] }
    },
    include: { customer: true }
  })

  // Check running match
  const runningMatch = await prisma.mabarMatch.findFirst({
    where: { liveSessionId: session.id, status: "sedang_berjalan" }
  })

  if (!forceClose && (activeEntries.length > 0 || runningMatch)) {
    const names = activeEntries.map(e => e.customer.mlNickname)
    const squadEntries = activeEntries.filter(e => ["naik_ke_squad", "sedang_main"].includes(e.status))
    const queueEntries = activeEntries.filter(e => ["menunggu_antrean", "menunggu_pergantian", "dijeda_fast_track", "tidak_ada_kabar"].includes(e.status))
    
    let messageParts = []
    if (runningMatch) messageParts.push("1 match sedang berjalan")
    if (squadEntries.length > 0) messageParts.push(`${squadEntries.length} pelanggan di skuad`)
    if (queueEntries.length > 0) messageParts.push(`${queueEntries.length} pelanggan antrean belum main`)
    
    return {
      requiresConfirmation: true,
      activeCount: activeEntries.length,
      hasRunningMatch: !!runningMatch,
      activeNames: names,
      squadNames: squadEntries.map(e => e.customer.mlNickname),
      queueNames: queueEntries.map(e => e.customer.mlNickname),
      message: `Peringatan: Masih ada ${messageParts.join(", ")}. Paksa tutup sesi?`
    }
  }

  // Force close: cancel any running match first
  if (runningMatch) {
    await prisma.mabarMatch.update({
      where: { id: runningMatch.id },
      data: { status: "dibatalkan", cancelledAt: new Date() }
    })
    // Reset players from running match back
    const matchPlayers = await prisma.matchPlayer.findMany({ where: { matchId: runningMatch.id } })
    for (const mp of matchPlayers) {
      const entry = await prisma.mabarEntry.findUnique({ where: { id: mp.mabarEntryId } })
      if (entry && entry.status === "sedang_main") {
        await prisma.mabarEntry.update({
          where: { id: entry.id },
          data: { status: "naik_ke_squad" }
        })
      }
    }
  }

  // Calculate recap data
  const joki = await prisma.user.findFirst({ where: { role: "ADMIN" } })
  const rateRegular = joki?.rateCardPrice || 10000
  const rateFT = joki?.rateCardFastTrack || 15000

  const completedMatches = await prisma.mabarMatch.findMany({
    where: { liveSessionId: session.id, status: "selesai" },
    include: { matchPlayers: { include: { mabarEntry: true } } }
  })

  const totalWins = completedMatches.filter(m => m.matchResult === "WIN").length
  const totalLosses = completedMatches.filter(m => m.matchResult === "LOSS").length

  // Calculate revenue: for each match, count players and multiply by rate card
  let totalRevenue = 0
  for (const match of completedMatches) {
    for (const mp of match.matchPlayers) {
      if (mp.mabarEntry) {
        const rate = mp.mabarEntry.serviceType === "fast_track" ? rateFT : rateRegular
        totalRevenue += rate
      }
    }
  }

  // Count unique customers served
  const uniqueCustomers = new Set(completedMatches.flatMap(m => m.matchPlayers.map(mp => mp.customerId)))

  // Mark remaining active entries as "carry_over" for next session
  for (const entry of activeEntries) {
    await prisma.mabarEntry.update({
      where: { id: entry.id },
      data: { status: "carry_over" }
    })
  }

  // Close the session
  await prisma.liveSession.update({
    where: { id: session.id },
    data: {
      status: "selesai",
      endedAt: new Date(),
      totalWins,
      totalLosses,
      totalRevenue
    }
  })

  revalidatePath("/dashboard")
  revalidatePath("/history")

  return {
    success: true,
    recap: {
      sessionName: session.sessionName,
      startedAt: session.startedAt,
      endedAt: new Date(),
      totalMatches: completedMatches.length,
      totalWins,
      totalLosses,
      totalRevenue,
      uniqueCustomers: uniqueCustomers.size,
      carryOverCount: activeEntries.length
    }
  }
}

export async function getSessionHistory() {
  const user = await getCurrentUser()
  const org = await getOrganizationForUser(user.id)

  const sessions = await prisma.liveSession.findMany({
    where: { organizationId: org.id },
    include: {
      matches: {
        where: { status: { in: ["selesai", "dibatalkan"] } },
        include: { matchPlayers: { include: { customer: true, mabarEntry: true } } },
        orderBy: { matchNumber: "asc" }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  const joki = user
  const rateRegular = joki?.rateCardPrice || 10000
  const rateFT = joki?.rateCardFastTrack || 15000

  return sessions.map(s => {
    const completedMatches = s.matches.filter(m => m.status === "selesai")
    const wins = completedMatches.filter(m => m.matchResult === "WIN").length
    const losses = completedMatches.filter(m => m.matchResult === "LOSS").length

    // Calculate revenue for this session
    let revenue = s.totalRevenue
    if (revenue === 0 && completedMatches.length > 0) {
      // Recalculate if not cached
      for (const match of completedMatches) {
        for (const mp of match.matchPlayers) {
          if (mp.mabarEntry) {
            const rate = mp.mabarEntry.serviceType === "fast_track" ? rateFT : rateRegular
            revenue += rate
          }
        }
      }
    }

    const uniqueCustomers = new Set(completedMatches.flatMap(m => m.matchPlayers.map(mp => mp.customerId)))

    return {
      id: s.id,
      name: s.sessionName,
      status: s.status,
      startedAt: s.startedAt,
      endedAt: s.endedAt,
      totalMatches: completedMatches.length,
      cancelledMatches: s.matches.filter(m => m.status === "dibatalkan").length,
      wins,
      losses,
      revenue,
      uniqueCustomers: uniqueCustomers.size,
      matches: s.matches.map(m => ({
        id: m.id,
        matchNumber: m.matchNumber,
        status: m.status === "selesai" ? "DONE" : "CANCELLED",
        matchResult: m.matchResult,
        startedAt: m.startedAt,
        endedAt: m.completedAt || m.cancelledAt,
        players: m.matchPlayers.map(mp => ({
          id: mp.customerId,
          nickname: mp.customer.mlNickname,
          serviceType: mp.mabarEntry?.serviceType || "reguler"
        }))
      }))
    }
  })
}

export async function editQueueItem(entryId: string, nickname: string, role: string, rank: string, matches: number) {
  await checkDemoMutation();
  const user = await getCurrentUser()
  const org = await getOrganizationForUser(user.id)
  const session = await getActiveLiveSession(org.id, user.id)

  const entry = await prisma.mabarEntry.findUnique({
    where: { id: entryId },
    include: { customer: true }
  })

  if (!entry || entry.liveSessionId !== session.id) return { success: false }

  await prisma.$transaction([
    prisma.customer.update({
      where: { id: entry.customerId },
      data: { mlNickname: nickname, currentRank: rank }
    }),
    prisma.mabarEntry.update({
      where: { id: entryId },
      data: { 
        primaryRole: role, 
        rankSnapshot: rank, 
        matchesRemaining: matches,
        matchesPurchased: entry.matchesCompleted + matches
      }
    })
  ])

  revalidatePath("/dashboard")
  return { success: true }
}
