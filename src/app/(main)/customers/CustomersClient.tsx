"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Users, Swords, Crown, ChevronDown, ChevronRight, Calendar } from "lucide-react"

type Customer = {
  id: string
  nickname: string
  createdAt: string | Date
  queues: { id: string; type: string }[]
  matches: { id: string; matchId: string }[]
}

function formatDate(date: Date | string) {
  const d = new Date(date)
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
}

// Get the Monday of the week for a given date
function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function getWeekEnd(weekStart: Date): Date {
  const d = new Date(weekStart)
  d.setDate(d.getDate() + 6)
  return d
}

function formatWeekLabel(weekStart: Date): string {
  const weekEnd = getWeekEnd(weekStart)
  const startStr = weekStart.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
  const endStr = weekEnd.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
  return `${startStr} — ${endStr}`
}

type WeekGroup = {
  key: string
  label: string
  weekStart: Date
  customers: Customer[]
}

function groupByWeek(customers: Customer[]): WeekGroup[] {
  const groups = new Map<string, WeekGroup>()

  for (const c of customers) {
    const d = new Date(c.createdAt)
    const ws = getWeekStart(d)
    const key = ws.toISOString().slice(0, 10)

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        label: formatWeekLabel(ws),
        weekStart: ws,
        customers: [],
      })
    }
    groups.get(key)!.customers.push(c)
  }

  // Sort weeks descending (newest first)
  return Array.from(groups.values()).sort(
    (a, b) => b.weekStart.getTime() - a.weekStart.getTime()
  )
}

export default function CustomersClient({ customers }: { customers: Customer[] }) {
  const weeks = groupByWeek(customers)

  // Default: open the most recent week
  const [openWeeks, setOpenWeeks] = React.useState<Set<string>>(() => {
    const s = new Set<string>()
    if (weeks.length > 0) s.add(weeks[0].key)
    return s
  })

  function toggleWeek(key: string) {
    setOpenWeeks(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const totalFastTrack = customers.filter(c => c.queues.some(q => q.type === "FAST_TRACK")).length
  const totalMatches = customers.reduce((acc, c) => acc + c.matches.length, 0)

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="border-b border-[var(--border-default)] pb-6">
        <h1 className="text-3xl font-heading font-black text-[var(--text-primary)] uppercase tracking-widest flex items-center gap-3">
          <Users className="w-8 h-8 text-red-bright" />
          Pelanggan
        </h1>
        <p className="text-muted mt-1 font-body">Daftar semua pemain yang pernah terdaftar di sistem Joka Joki.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-red-bright">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted">Total Pelanggan</CardTitle>
            <Users className="h-4 w-4 text-red-bright" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-black text-[var(--text-primary)]">{customers.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted">Pernah Fast Track</CardTitle>
            <Crown className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-black text-[var(--text-primary)]">{totalFastTrack}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted">Total Match Dimainkan</CardTitle>
            <Swords className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-black text-[var(--text-primary)]">{totalMatches}</div>
          </CardContent>
        </Card>
      </div>

      {/* Grouped by Week */}
      {customers.length === 0 ? (
        <Card className="border-t border-[var(--border-default)]">
          <CardContent className="py-12 text-center text-muted">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="font-heading text-lg">Belum Ada Pelanggan</p>
            <p className="text-sm mt-1">Tambahkan pemain pertama melalui Dashboard.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {weeks.map(week => {
            const isOpen = openWeeks.has(week.key)
            const weekMatches = week.customers.reduce((a, c) => a + c.matches.length, 0)
            const weekFT = week.customers.filter(c => c.queues.some(q => q.type === "FAST_TRACK")).length

            return (
              <Card key={week.key} className="border-[var(--border-default)] overflow-hidden">
                {/* Week Header (clickable) */}
                <button
                  onClick={() => toggleWeek(week.key)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-[var(--surface-2)] hover:bg-[var(--surface-hover)] transition-colors text-left cursor-pointer border-b border-[var(--border-default)]"
                >
                  <div className="flex items-center gap-3">
                    {isOpen ? (
                      <ChevronDown className="w-5 h-5 text-red-bright transition-transform" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted transition-transform" />
                    )}
                    <Calendar className="w-4 h-4 text-muted" />
                    <span className="font-heading font-black text-[var(--text-primary)] uppercase tracking-widest text-sm">
                      {week.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted font-bold">
                      <span className="text-[var(--text-primary)]">{week.customers.length}</span> pelanggan
                    </span>
                    <span className="text-xs text-muted font-bold">
                      <span className="text-[var(--text-primary)]">{weekMatches}</span> match
                    </span>
                    {weekFT > 0 && (
                      <Badge variant="default" className="text-[9px] scale-90">
                        {weekFT} FT
                      </Badge>
                    )}
                  </div>
                </button>

                {/* Week Content (expandable) */}
                {isOpen && (
                  <CardContent className="p-0 overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-[var(--surface-2)]">
                        <TableRow className="border-[var(--border-default)]">
                          <TableHead className="w-[60px] text-center font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs">No.</TableHead>
                          <TableHead className="font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs">Nickname</TableHead>
                          <TableHead className="font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs">Jumlah Match</TableHead>
                          <TableHead className="font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs">Jumlah Antrean</TableHead>
                          <TableHead className="font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs">Tier Tertinggi</TableHead>
                          <TableHead className="font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs">Terdaftar</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {week.customers.map((customer, idx) => {
                          const hasFastTrack = customer.queues.some(q => q.type === "FAST_TRACK")
                          return (
                            <TableRow key={customer.id} className="border-[var(--border-default)] hover:bg-[var(--surface-hover)] transition-colors">
                              <TableCell className="text-center font-heading font-bold text-muted">{idx + 1}</TableCell>
                              <TableCell className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                                {customer.nickname}
                                {hasFastTrack && <Crown className="w-4 h-4 text-warning" />}
                              </TableCell>
                              <TableCell>
                                <span className="font-heading font-bold text-[var(--text-primary)]">{customer.matches.length}</span>
                                <span className="text-muted text-xs ml-1">match</span>
                              </TableCell>
                              <TableCell>
                                <span className="font-heading font-bold text-[var(--text-primary)]">{customer.queues.length}</span>
                                <span className="text-muted text-xs ml-1">kali</span>
                              </TableCell>
                              <TableCell>
                                <Badge variant={hasFastTrack ? "default" : "secondary"}>
                                  {hasFastTrack ? "FAST TRACK" : "REGULER"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted text-sm">{formatDate(customer.createdAt)}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
