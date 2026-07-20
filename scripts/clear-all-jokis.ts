import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log("Menghapus seluruh Joki dan data terkaitnya...")
  
  const jokis = await prisma.user.findMany({ where: { role: "JOKI" } })
  const jokiIds = jokis.map(j => j.id)

  const orgMembers = await prisma.organizationMember.findMany({ where: { userId: { in: jokiIds } } })
  const orgIds = orgMembers.map(m => m.organizationId)

  // Delete organizations first (will cascade to LiveSession, Customer, MabarEntry, Match, etc)
  const deletedOrgs = await prisma.organization.deleteMany({ where: { id: { in: orgIds } } })
  
  // Delete users (will cascade to Session, Account, etc)
  const deletedUsers = await prisma.user.deleteMany({ where: { role: "JOKI" } })
  
  console.log(`✅ Berhasil menghapus ${deletedUsers.count} Joki dan ${deletedOrgs.count} Organisasinya beserta seluruh riwayat data!`)
}

main().finally(() => prisma.$disconnect())
