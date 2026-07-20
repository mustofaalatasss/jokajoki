"use server"

import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { signToken } from "@/lib/jwt"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function generateDemoSetup() {
  // 1. Transactional bulk delete for vastly improved performance
  await prisma.$transaction([
    prisma.activityLog.deleteMany(),
    prisma.fastTrackReplacement.deleteMany(),
    prisma.matchPlayer.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.mabarMatch.deleteMany(),
    prisma.mabarEntry.deleteMany(),
    prisma.sessionCounter.deleteMany(),
    prisma.liveSession.deleteMany(),
    prisma.customer.deleteMany()
  ])
  
  let org = await prisma.organization.findFirst()
  if (!org) {
    const fallbackAdmin = await prisma.user.findFirst()
    org = await prisma.organization.create({
      data: { name: "Joka Joki", slug: "joka-joki" }
    })
  }

  // Create Joki User
  let jokiUser = await prisma.user.findFirst({ where: { role: "JOKI", name: "Kylian Mbappe" } })
  if (!jokiUser) {
    jokiUser = await prisma.user.create({
      data: {
        email: `kylian_${Date.now()}@jokajoki.com`,
        emailVerified: true,
        role: "JOKI",
        name: "Kylian Mbappe",
        nickname: "Kylian Mbappe",
      }
    })
    await prisma.organizationMember.create({
      data: {
        organizationId: org.id,
        userId: jokiUser.id,
        role: "JOKI"
      }
    })
  }
  
  const session = await prisma.liveSession.create({
    data: {
      organizationId: org.id,
      createdBy: jokiUser.id,
      sessionName: "Mabar VIP Siang",
      status: "aktif",
      startedAt: new Date(Date.now() - 1000 * 60 * 30) // started 30 mins ago
    }
  })
  
  // Create Counter
  await prisma.sessionCounter.create({
    data: {
      liveSessionId: session.id,
      nextRegistrationNumber: 20
    }
  })

  const mabarMatch = await prisma.mabarMatch.create({
    data: {
      organizationId: org.id,
      liveSessionId: session.id,
      matchNumber: 1,
      createdBy: jokiUser.id,
      status: "sedang_berjalan",
      startedAt: new Date(Date.now() - 1000 * 60 * 15) // started 15 mins ago
    }
  })
  
  let currentRegNum = 1;
  let slot = 1;
  
  // Create customer fast
  async function createCust(name: string, isFT: boolean, status: string, role: string, inMatch: boolean, purchased: number = 3, rank: string = "Mythic") {
     const myRegNum = currentRegNum++;
     const mySlot = inMatch ? slot++ : undefined;

     const c = await prisma.customer.create({ data: { organizationId: org!.id, mlNickname: name, mlUserId: Math.floor(Math.random() * 100000000).toString(), mlServerId: "1234", currentRank: rank } })
     
     const numPastMatches = Math.floor(Math.random() * 3) + 1; // 1 to 3 past matches
     const totalPurchased = purchased + numPastMatches;
     
     const entry = await prisma.mabarEntry.create({
       data: {
         organizationId: org!.id,
         liveSessionId: session.id,
         customerId: c.id,
         serviceType: isFT ? "fast_track" : "reguler",
         status: status,
         registrationNumber: myRegNum,
         primaryRole: role,
         rankSnapshot: rank,
         createdBy: jokiUser!.id,
         matchesPurchased: totalPurchased,
         matchesCompleted: inMatch ? numPastMatches + 1 : numPastMatches,
         matchesRemaining: inMatch ? totalPurchased - (numPastMatches + 1) : totalPurchased - numPastMatches
       }
     })
     
     if (inMatch) {
       await prisma.matchPlayer.create({
         data: {
           organizationId: org!.id,
           matchId: mabarMatch.id,
           mabarEntryId: entry.id,
           customerId: c.id,
           slotNumber: mySlot as number,
           playedRole: role
         }
       })
     }

     const pastMatchPromises = [];
     for (let i = 0; i < numPastMatches; i++) {
        pastMatchPromises.push(
          prisma.mabarMatch.create({
            data: {
              organizationId: org!.id,
              liveSessionId: session.id,
              matchNumber: 0, 
              createdBy: jokiUser!.id,
              status: "selesai",
              matchResult: "WIN",
              startedAt: new Date(Date.now() - 1000 * 60 * (60 + i * 20)), 
              completedAt: new Date(Date.now() - 1000 * 60 * (45 + i * 20)),
              matchPlayers: {
                create: {
                   organizationId: org!.id,
                   mabarEntryId: entry.id,
                   customerId: c.id,
                   slotNumber: 1,
                   playedRole: role
                }
              }
            }
          })
        );
     }
     await Promise.all(pastMatchPromises);
  }

  // Sequential customer creations to prevent database timeout on VPS
  const customers = [
    ["Bill Gates", true, "sedang_main", "Jungler", true, 5, "Mythical Glory"],
    ["Lionel Messi", false, "sedang_main", "Gold Lane", true, 3, "Mythical Immortal"],
    ["Cristiano Ronaldo", false, "sedang_main", "Exp Lane", true, 4, "Mythical Honor"],
    ["Neymar Jr", false, "sedang_main", "Mid Lane", true, 2, "Mythic"],
    
    ["Elon Musk", true, "menunggu_antrean", "Roamer", false, 4, "Mythical Immortal"],
    ["Jeff Bezos", true, "menunggu_antrean", "Gold Lane", false, 6, "Mythical Glory"],
    ["Mark Zuckerberg", true, "menunggu_antrean", "Exp Lane", false, 3, "Mythical Honor"],
    
    ["Lamine Yamal", false, "menunggu_antrean", "Roamer", false, 2, "Legend"],
    ["Vinicius Jr", false, "menunggu_antrean", "Jungler", false, 3, "Mythic"],
    ["Jude Bellingham", false, "menunggu_antrean", "Mid Lane", false, 4, "Mythical Honor"],
    ["Kevin De Bruyne", false, "menunggu_antrean", "Roamer", false, 2, "Mythical Glory"],
    ["Erling Haaland", false, "menunggu_antrean", "Gold Lane", false, 5, "Mythical Immortal"],
    ["Mohamed Salah", false, "menunggu_antrean", "Exp Lane", false, 3, "Mythic"],
    ["Bukayo Saka", false, "menunggu_antrean", "Gold Lane", false, 2, "Legend"],
    ["Phil Foden", false, "menunggu_antrean", "Mid Lane", false, 4, "Mythical Honor"],
    ["Luka Modric", false, "menunggu_antrean", "Roamer", false, 2, "Mythical Glory"],
    ["Toni Kroos", false, "menunggu_antrean", "Flex", false, 3, "Mythical Immortal"],
    ["Sergio Ramos", false, "menunggu_antrean", "Exp Lane", false, 5, "Mythical Honor"]
  ];

  for (const cust of customers) {
    await createCust(cust[0] as string, cust[1] as boolean, cust[2] as string, cust[3] as string, cust[4] as boolean, cust[5] as number, cust[6] as string);
  }

  // Auto Login
  const token = await signToken({ userId: jokiUser.id, role: "JOKI" })
  const cookieStore = await cookies()
  cookieStore.set("jokajoki-session", token, {
    httpOnly: true,
    secure: false, // Force false because Let's Encrypt is blocked and they are using HTTP
    sameSite: "lax",
    path: "/"
  })

  revalidatePath("/", "layout")
  redirect("/dashboard")
}
