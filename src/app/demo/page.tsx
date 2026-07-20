import DashboardClient from "../(main)/dashboard/DashboardClient"
import { AppLayout } from "@/components/layout/AppLayout"

export default function DemoPage() {
  const mockJoki = {
    id: "demo-joki",
    nickname: "Kylian Mbappe",
    role: "JOKI",
    jokiRole: "Jungler"
  };

  const mockStats = {
    totalQueue: 14,
    fastTrackCount: 3,
    matchesDone: 33,
    currentMatch: {
      id: "demo-match",
      status: "sedang_berjalan",
      startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      endedAt: null
    },
    activeSquad: [
      {
        id: "sq1", customerId: "c1", nickname: "Bill Gates", role: "Jungler", rank: "Mythical Glory",
        matchesPurchased: 5, matchesRemaining: 4, activeSlot: 2, type: "FAST_TRACK"
      },
      {
        id: "sq2", customerId: "c2", nickname: "Lionel Messi", role: "Gold Lane", rank: "Mythical Immortal",
        matchesPurchased: 3, matchesRemaining: 2, activeSlot: 3, type: "REGULER"
      },
      {
        id: "sq3", customerId: "c3", nickname: "Cristiano Ronaldo", role: "Exp Lane", rank: "Mythical Honor",
        matchesPurchased: 4, matchesRemaining: 3, activeSlot: 4, type: "REGULER"
      },
      {
        id: "sq4", customerId: "c4", nickname: "Neymar Jr", role: "Mid Lane", rank: "Mythic",
        matchesPurchased: 2, matchesRemaining: 1, activeSlot: 5, type: "REGULER"
      }
    ]
  };

  const mockQueueData = {
    totalWaiting: 10,
    queues: [
      { id: "q1", type: "FAST_TRACK", status: "menunggu_antrean", note: null, role: "Roamer", rank: "Mythical Immortal", matchesRemaining: 4, createdAt: new Date().toISOString(), user: { id: "u1", nickname: "Elon Musk", role: "CUSTOMER" } },
      { id: "q2", type: "FAST_TRACK", status: "menunggu_antrean", note: null, role: "Gold Lane", rank: "Mythical Glory", matchesRemaining: 6, createdAt: new Date().toISOString(), user: { id: "u2", nickname: "Jeff Bezos", role: "CUSTOMER" } },
      { id: "q3", type: "FAST_TRACK", status: "menunggu_antrean", note: null, role: "Exp Lane", rank: "Mythical Honor", matchesRemaining: 3, createdAt: new Date().toISOString(), user: { id: "u3", nickname: "Mark Zuckerberg", role: "CUSTOMER" } },
      { id: "q4", type: "REGULER", status: "menunggu_antrean", note: null, role: "Roamer", rank: "Legend", matchesRemaining: 2, createdAt: new Date().toISOString(), user: { id: "u4", nickname: "Lamine Yamal", role: "CUSTOMER" } },
      { id: "q5", type: "REGULER", status: "menunggu_antrean", note: null, role: "Jungler", rank: "Mythic", matchesRemaining: 3, createdAt: new Date().toISOString(), user: { id: "u5", nickname: "Vinicius Jr", role: "CUSTOMER" } },
      { id: "q6", type: "REGULER", status: "menunggu_antrean", note: null, role: "Mid Lane", rank: "Mythical Honor", matchesRemaining: 4, createdAt: new Date().toISOString(), user: { id: "u6", nickname: "Jude Bellingham", role: "CUSTOMER" } },
      { id: "q7", type: "REGULER", status: "menunggu_antrean", note: null, role: "Roamer", rank: "Mythical Glory", matchesRemaining: 2, createdAt: new Date().toISOString(), user: { id: "u7", nickname: "Kevin De Bruyne", role: "CUSTOMER" } }
    ]
  };

  return (
    <AppLayout isDemo={true}>
      <DashboardClient 
        stats={mockStats}
        queueData={mockQueueData}
        joki={mockJoki}
      />
    </AppLayout>
  )
}
