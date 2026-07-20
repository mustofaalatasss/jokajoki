import CustomersClient from "../../(main)/customers/CustomersClient"
import { AppLayout } from "@/components/layout/AppLayout"

export default function DemoCustomersPage() {
  const mockCustomers = [
    // THIS WEEK
    {
      id: "c1", nickname: "Cristiano Ronaldo",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      queues: [{ id: "q1", type: "FAST_TRACK" }, { id: "q2", type: "REGULER" }, { id: "qx1", type: "FAST_TRACK" }],
      matches: [{ id: "m1", matchId: "match1" }, { id: "m2", matchId: "match2" }, { id: "m3", matchId: "match3" }]
    },
    {
      id: "c3", nickname: "Kylian Mbappe",
      createdAt: new Date().toISOString(),
      queues: [{ id: "q4", type: "FAST_TRACK" }],
      matches: [{ id: "m1x", matchId: "x1" }]
    },
    {
      id: "c10", nickname: "Jude Bellingham",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      queues: [{ id: "q10", type: "REGULER" }, { id: "q11", type: "REGULER" }],
      matches: [{ id: "m10", matchId: "match10" }]
    },
    {
      id: "c11", nickname: "Vinicius Jr",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      queues: [{ id: "q12", type: "FAST_TRACK" }],
      matches: [{ id: "m11", matchId: "match11" }, { id: "m12", matchId: "match12" }]
    },
    // LAST WEEK
    {
      id: "c2", nickname: "Lionel Messi",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      queues: [{ id: "q3", type: "REGULER" }],
      matches: [{ id: "m3", matchId: "match3" }, { id: "m3x", matchId: "x3" }]
    },
    {
      id: "c12", nickname: "Kevin De Bruyne",
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      queues: [{ id: "q13", type: "REGULER" }, { id: "q14", type: "REGULER" }, { id: "q15", type: "REGULER" }],
      matches: [{ id: "m13", matchId: "match13" }, { id: "m14", matchId: "match14" }, { id: "m15", matchId: "match15" }]
    },
    {
      id: "c13", nickname: "Phil Foden",
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      queues: [{ id: "q16", type: "FAST_TRACK" }, { id: "q17", type: "FAST_TRACK" }],
      matches: [{ id: "m16", matchId: "match16" }, { id: "m17", matchId: "match17" }, { id: "m18", matchId: "match18" }, { id: "m19", matchId: "match19" }]
    },
    {
      id: "c14", nickname: "Bukayo Saka",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      queues: [{ id: "q18", type: "REGULER" }],
      matches: []
    },
    // 2 WEEKS AGO
    {
      id: "c4", nickname: "Neymar Jr",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      queues: [{ id: "q5", type: "REGULER" }, { id: "q6", type: "REGULER" }, { id: "q7", type: "FAST_TRACK" }],
      matches: [{ id: "m4", matchId: "match4" }, { id: "m5", matchId: "match5" }, { id: "m6", matchId: "match6" }]
    },
    {
      id: "c5", nickname: "Erling Haaland",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      queues: [{ id: "q8", type: "REGULER" }],
      matches: [{ id: "m7", matchId: "match7" }]
    },
    {
      id: "c15", nickname: "Lamine Yamal",
      createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
      queues: [{ id: "q19", type: "FAST_TRACK" }],
      matches: [{ id: "m20", matchId: "match20" }]
    },
    {
      id: "c16", nickname: "Harry Kane",
      createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
      queues: [{ id: "q20", type: "REGULER" }, { id: "q21", type: "REGULER" }],
      matches: [{ id: "m21", matchId: "match21" }, { id: "m22", matchId: "match22" }]
    },
    // 3 WEEKS AGO
    {
      id: "c17", nickname: "Toni Kroos",
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      queues: [{ id: "q22", type: "FAST_TRACK" }],
      matches: [{ id: "m23", matchId: "match23" }, { id: "m24", matchId: "match24" }]
    },
    {
      id: "c18", nickname: "Luka Modric",
      createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
      queues: [{ id: "q23", type: "REGULER" }],
      matches: [{ id: "m25", matchId: "match25" }]
    },
    {
      id: "c19", nickname: "Marcus Rashford",
      createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
      queues: [{ id: "q24", type: "REGULER" }, { id: "q25", type: "FAST_TRACK" }, { id: "q26", type: "REGULER" }],
      matches: [{ id: "m26", matchId: "match26" }, { id: "m27", matchId: "match27" }, { id: "m28", matchId: "match28" }, { id: "m29", matchId: "match29" }]
    },
    {
      id: "c20", nickname: "Mohamed Salah",
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      queues: [{ id: "q27", type: "FAST_TRACK" }, { id: "q28", type: "FAST_TRACK" }],
      matches: [{ id: "m30", matchId: "match30" }, { id: "m31", matchId: "match31" }, { id: "m32", matchId: "match32" }, { id: "m33", matchId: "match33" }, { id: "m34", matchId: "match34" }]
    }
  ];

  return (
    <AppLayout isDemo={true}>
      <CustomersClient customers={mockCustomers} />
    </AppLayout>
  )
}
