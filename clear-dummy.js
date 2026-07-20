const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Menghapus data operasional...');
  
  await prisma.activityLog.deleteMany();
  await prisma.fastTrackReplacement.deleteMany();
  await prisma.matchPlayer.deleteMany();
  await prisma.mabarMatch.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.mabarEntry.deleteMany();
  await prisma.sessionCounter.deleteMany();
  await prisma.liveSession.deleteMany();
  await prisma.customer.deleteMany();
  
  console.log('Berhasil! Semua data antrean, histori match, dan pelanggan dummy telah dibersihkan.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
