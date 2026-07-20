import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log("Memulai penghapusan data transaksi dummy...")
  
  await prisma.activityLog.deleteMany()
  await prisma.fastTrackReplacement.deleteMany()
  await prisma.matchPlayer.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.mabarMatch.deleteMany()
  await prisma.mabarEntry.deleteMany()
  await prisma.sessionCounter.deleteMany()
  await prisma.liveSession.deleteMany()
  await prisma.customer.deleteMany()
  
  console.log("✅ Semua data antrean, skuad, match, pelanggan, dan riwayat berhasil dibersihkan!")
  console.log("(Data akun dan organisasi Anda tetap aman)")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
