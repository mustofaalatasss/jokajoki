import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.mabarEntry.deleteMany()
  await prisma.mabarMatch.deleteMany()
  await prisma.user.deleteMany()
  console.log("Semua data dummy berhasil dihapus!")
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1) })
