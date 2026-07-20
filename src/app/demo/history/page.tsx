import HistoryClient from "../../(main)/history/HistoryClient"
import { AppLayout } from "@/components/layout/AppLayout"

export default function DemoHistoryPage() {
  const mockSessions = [
    {
      id: "session-1",
      name: "Sesi Joki Begadang",
      status: "selesai",
      startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // yesterday
      endedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 6 hours duration
      totalMatches: 9,
      cancelledMatches: 0,
      wins: 7,
      losses: 2,
      revenue: 105000,
      uniqueCustomers: 4,
      matches: [
        {
          id: "match-1", matchNumber: 1, status: "DONE", matchResult: "WIN",
          startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), endedAt: new Date(Date.now() - 23.7 * 60 * 60 * 1000).toISOString(),
          players: [{ id: "p1", nickname: "Cristiano Ronaldo", serviceType: "fast_track" }, { id: "p2", nickname: "Lionel Messi", serviceType: "reguler" }]
        },
        {
          id: "match-2", matchNumber: 2, status: "DONE", matchResult: "LOSS",
          startedAt: new Date(Date.now() - 23.6 * 60 * 60 * 1000).toISOString(), endedAt: new Date(Date.now() - 23.2 * 60 * 60 * 1000).toISOString(),
          players: [{ id: "p1", nickname: "Cristiano Ronaldo", serviceType: "fast_track" }, { id: "p3", nickname: "Neymar Jr", serviceType: "reguler" }]
        },
        {
          id: "match-3", matchNumber: 3, status: "DONE", matchResult: "WIN",
          startedAt: new Date(Date.now() - 23.1 * 60 * 60 * 1000).toISOString(), endedAt: new Date(Date.now() - 22.8 * 60 * 60 * 1000).toISOString(),
          players: [{ id: "p2", nickname: "Lionel Messi", serviceType: "reguler" }, { id: "p4", nickname: "Kylian Mbappe", serviceType: "fast_track" }]
        },
        {
          id: "match-3a", matchNumber: 4, status: "DONE", matchResult: "WIN",
          startedAt: new Date(Date.now() - 22.5 * 60 * 60 * 1000).toISOString(), endedAt: new Date(Date.now() - 22.1 * 60 * 60 * 1000).toISOString(),
          players: [{ id: "p2", nickname: "Lionel Messi", serviceType: "reguler" }]
        },
        {
          id: "match-3b", matchNumber: 5, status: "DONE", matchResult: "LOSS",
          startedAt: new Date(Date.now() - 21.9 * 60 * 60 * 1000).toISOString(), endedAt: new Date(Date.now() - 21.6 * 60 * 60 * 1000).toISOString(),
          players: [{ id: "p3", nickname: "Neymar Jr", serviceType: "reguler" }, { id: "p4", nickname: "Kylian Mbappe", serviceType: "fast_track" }]
        },
        {
          id: "match-3c", matchNumber: 6, status: "DONE", matchResult: "WIN",
          startedAt: new Date(Date.now() - 21.5 * 60 * 60 * 1000).toISOString(), endedAt: new Date(Date.now() - 21.2 * 60 * 60 * 1000).toISOString(),
          players: [{ id: "p1", nickname: "Cristiano Ronaldo", serviceType: "fast_track" }]
        }
      ]
    },
    {
      id: "session-2",
      name: "Push Glory Siang",
      status: "selesai",
      startedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
      endedAt: new Date(Date.now() - 44 * 60 * 60 * 1000).toISOString(), // 4 hours duration
      totalMatches: 5,
      cancelledMatches: 1,
      wins: 5,
      losses: 0,
      revenue: 70000,
      uniqueCustomers: 3,
      matches: [
        {
          id: "match-4", matchNumber: 1, status: "DONE", matchResult: "WIN",
          startedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), endedAt: new Date(Date.now() - 47.7 * 60 * 60 * 1000).toISOString(),
          players: [{ id: "p4", nickname: "Kylian Mbappe", serviceType: "fast_track" }]
        },
        {
          id: "match-5", matchNumber: 2, status: "CANCELLED", matchResult: null,
          startedAt: new Date(Date.now() - 47.6 * 60 * 60 * 1000).toISOString(), endedAt: new Date(Date.now() - 47.5 * 60 * 60 * 1000).toISOString(),
          players: [{ id: "p5", nickname: "Erling Haaland", serviceType: "reguler" }]
        },
        {
          id: "match-6", matchNumber: 3, status: "DONE", matchResult: "WIN",
          startedAt: new Date(Date.now() - 47.0 * 60 * 60 * 1000).toISOString(), endedAt: new Date(Date.now() - 46.5 * 60 * 60 * 1000).toISOString(),
          players: [{ id: "p5", nickname: "Erling Haaland", serviceType: "reguler" }, { id: "p6", nickname: "Jude Bellingham", serviceType: "fast_track" }]
        }
      ]
    },
    {
      id: "session-3",
      name: "Sesi Joki Tipis Tipis",
      status: "selesai",
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      endedAt: new Date(Date.now() - 70 * 60 * 60 * 1000).toISOString(), // ~2 hours duration
      totalMatches: 3,
      cancelledMatches: 0,
      wins: 2,
      losses: 1,
      revenue: 30000,
      uniqueCustomers: 2,
      matches: [
        {
          id: "match-7", matchNumber: 1, status: "DONE", matchResult: "WIN",
          startedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), endedAt: new Date(Date.now() - 71.7 * 60 * 60 * 1000).toISOString(),
          players: [{ id: "p7", nickname: "Vinicius Jr", serviceType: "reguler" }]
        },
        {
          id: "match-8", matchNumber: 2, status: "DONE", matchResult: "LOSS",
          startedAt: new Date(Date.now() - 71.6 * 60 * 60 * 1000).toISOString(), endedAt: new Date(Date.now() - 71.3 * 60 * 60 * 1000).toISOString(),
          players: [{ id: "p7", nickname: "Vinicius Jr", serviceType: "reguler" }]
        },
        {
          id: "match-9", matchNumber: 3, status: "DONE", matchResult: "WIN",
          startedAt: new Date(Date.now() - 71.1 * 60 * 60 * 1000).toISOString(), endedAt: new Date(Date.now() - 70.8 * 60 * 60 * 1000).toISOString(),
          players: [{ id: "p8", nickname: "Kevin De Bruyne", serviceType: "reguler" }]
        }
      ]
    },
    {
      id: "session-4",
      name: "Sesi Weekend Marathon",
      status: "selesai",
      startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endedAt: new Date(Date.now() - 6.5 * 24 * 60 * 60 * 1000).toISOString(),
      totalMatches: 12,
      cancelledMatches: 2,
      wins: 10,
      losses: 2,
      revenue: 160000,
      uniqueCustomers: 5,
      matches: [
        {
          id: "match-10", matchNumber: 1, status: "DONE", matchResult: "WIN",
          startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), endedAt: new Date(Date.now() - 6.95 * 24 * 60 * 60 * 1000).toISOString(),
          players: [{ id: "p1", nickname: "Cristiano Ronaldo", serviceType: "fast_track" }, { id: "p9", nickname: "Phil Foden", serviceType: "fast_track" }]
        },
        {
          id: "match-11", matchNumber: 2, status: "DONE", matchResult: "WIN",
          startedAt: new Date(Date.now() - 6.9 * 24 * 60 * 60 * 1000).toISOString(), endedAt: new Date(Date.now() - 6.85 * 24 * 60 * 60 * 1000).toISOString(),
          players: [{ id: "p1", nickname: "Cristiano Ronaldo", serviceType: "fast_track" }, { id: "p9", nickname: "Phil Foden", serviceType: "fast_track" }]
        },
        {
          id: "match-12", matchNumber: 3, status: "DONE", matchResult: "WIN",
          startedAt: new Date(Date.now() - 6.8 * 24 * 60 * 60 * 1000).toISOString(), endedAt: new Date(Date.now() - 6.75 * 24 * 60 * 60 * 1000).toISOString(),
          players: [{ id: "p10", nickname: "Bukayo Saka", serviceType: "reguler" }]
        },
        {
          id: "match-13", matchNumber: 4, status: "DONE", matchResult: "LOSS",
          startedAt: new Date(Date.now() - 6.7 * 24 * 60 * 60 * 1000).toISOString(), endedAt: new Date(Date.now() - 6.65 * 24 * 60 * 60 * 1000).toISOString(),
          players: [{ id: "p11", nickname: "Lamine Yamal", serviceType: "reguler" }]
        },
        {
          id: "match-14", matchNumber: 5, status: "DONE", matchResult: "WIN",
          startedAt: new Date(Date.now() - 6.6 * 24 * 60 * 60 * 1000).toISOString(), endedAt: new Date(Date.now() - 6.55 * 24 * 60 * 60 * 1000).toISOString(),
          players: [{ id: "p11", nickname: "Lamine Yamal", serviceType: "reguler" }]
        }
      ]
    },
    {
      id: "session-5",
      name: "GB MMR Cepat",
      status: "selesai",
      startedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      endedAt: new Date(Date.now() - 9.8 * 24 * 60 * 60 * 1000).toISOString(),
      totalMatches: 4,
      cancelledMatches: 0,
      wins: 4,
      losses: 0,
      revenue: 60000,
      uniqueCustomers: 1,
      matches: [
        {
          id: "match-15", matchNumber: 1, status: "DONE", matchResult: "WIN",
          startedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), endedAt: new Date(Date.now() - 9.95 * 24 * 60 * 60 * 1000).toISOString(),
          players: [{ id: "p12", nickname: "Harry Kane", serviceType: "fast_track" }]
        },
        {
          id: "match-16", matchNumber: 2, status: "DONE", matchResult: "WIN",
          startedAt: new Date(Date.now() - 9.9 * 24 * 60 * 60 * 1000).toISOString(), endedAt: new Date(Date.now() - 9.85 * 24 * 60 * 60 * 1000).toISOString(),
          players: [{ id: "p12", nickname: "Harry Kane", serviceType: "fast_track" }]
        }
      ]
    }
  ];

  return (
    <AppLayout isDemo={true}>
      <HistoryClient sessions={mockSessions} />
    </AppLayout>
  )
}
