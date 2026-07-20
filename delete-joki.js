const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    // Delete all transactional data
    await prisma.matchPlayer.deleteMany();
    console.log('Deleted Match Players');
    
    await prisma.mabarMatch.deleteMany();
    console.log('Deleted Mabar Matches');
    
    await prisma.mabarEntry.deleteMany();
    console.log('Deleted Mabar Entries');
    
    await prisma.sessionCounter.deleteMany();
    console.log('Deleted Session Counters');
    
    await prisma.liveSession.deleteMany();
    console.log('Deleted Live Sessions');
    
    await prisma.customer.deleteMany();
    console.log('Deleted Customers');

    await prisma.organizationMember.deleteMany({
      where: { user: { role: 'JOKI' } }
    });
    console.log('Deleted Org Members for Joki');

    const deleted = await prisma.user.deleteMany({
      where: { role: 'JOKI' }
    });
    console.log('Deleted Joki count:', deleted.count);
  } catch (e) {
    console.error(e);
  }
}

run().finally(() => prisma.$disconnect());
