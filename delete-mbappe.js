const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const user = await prisma.user.findFirst({
      where: {
        nickname: {
          contains: 'Kylian Mbappe',
          mode: 'insensitive'
        }
      }
    });

    if (user) {
      console.log('Found Kylian Mbappe, ID:', user.id);
      // Clean up ActivityLogs
      await prisma.activityLog.deleteMany({ where: { actorUserId: user.id } });
      // Clean up FastTrackReplacement
      await prisma.fastTrackReplacement.deleteMany({ where: { createdBy: user.id } });
      // Clean up MatchPlayers
      const matches = await prisma.mabarMatch.findMany({ where: { createdBy: user.id } });
      for (const m of matches) {
        await prisma.matchPlayer.deleteMany({ where: { matchId: m.id } });
      }
      // Clean up MabarMatch
      await prisma.mabarMatch.deleteMany({ where: { createdBy: user.id } });
      // Clean up Payments
      await prisma.payment.deleteMany({ where: { recordedBy: user.id } });
      // Clean up MatchPlayers from mabarEntries
      const entries = await prisma.mabarEntry.findMany({ where: { createdBy: user.id } });
      for (const e of entries) {
        await prisma.matchPlayer.deleteMany({ where: { mabarEntryId: e.id } });
        await prisma.fastTrackReplacement.deleteMany({ where: { OR: [{ fastTrackEntryId: e.id }, { pausedEntryId: e.id }] } });
        await prisma.payment.deleteMany({ where: { mabarEntryId: e.id } });
      }
      // Clean up MabarEntry
      await prisma.mabarEntry.deleteMany({ where: { createdBy: user.id } });
      
      // Clean up LiveSession
      const sessions = await prisma.liveSession.findMany({ where: { createdBy: user.id } });
      for (const s of sessions) {
        await prisma.sessionCounter.deleteMany({ where: { liveSessionId: s.id } });
        await prisma.activityLog.deleteMany({ where: { liveSessionId: s.id } });
        await prisma.fastTrackReplacement.deleteMany({ where: { liveSessionId: s.id } });
        await prisma.matchPlayer.deleteMany({ where: { match: { liveSessionId: s.id } } });
        await prisma.mabarMatch.deleteMany({ where: { liveSessionId: s.id } });
        await prisma.payment.deleteMany({ where: { liveSessionId: s.id } });
        await prisma.mabarEntry.deleteMany({ where: { liveSessionId: s.id } });
      }
      await prisma.liveSession.deleteMany({ where: { createdBy: user.id } });

      // Clean up OrganizationMember
      await prisma.organizationMember.deleteMany({ where: { userId: user.id } });
      
      // Finally delete user
      await prisma.user.delete({ where: { id: user.id } });
      console.log('Kylian Mbappe has been fully deleted!');
    } else {
      console.log('Kylian Mbappe not found in database.');
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
