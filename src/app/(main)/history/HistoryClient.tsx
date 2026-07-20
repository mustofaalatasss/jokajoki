"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { History, Trophy, TrendingDown, Swords, Users, DollarSign, ChevronDown, ChevronRight, Clock, Zap } from "lucide-react"

type MatchPlayer = {
  id: string
  nickname: string
  serviceType: string
}

type Match = {
  id: string
  matchNumber: number
  status: string
  matchResult: string | null
  startedAt: Date | string | null
  endedAt: Date | string | null
  players: MatchPlayer[]
}

type SessionData = {
  id: string
  name: string
  status: string
  startedAt: Date | string | null
  endedAt: Date | string | null
  totalMatches: number
  cancelledMatches: number
  wins: number
  losses: number
  revenue: number
  uniqueCustomers: number
  matches: Match[]
}

function formatDate(date: Date | string) {
  const d = new Date(date)
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
}

function formatTime(date: Date | string) {
  const d = new Date(date)
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" })
}

function getDuration(start: Date | string | null, end: Date | string | null) {
  if (!start || !end) return "-"
  const diff = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 1000)
  const hours = Math.floor(diff / 3600)
  const mins = Math.floor((diff % 3600) / 60)
  if (hours > 0) return `${hours}j ${mins}m`
  return `${mins}m`
}

function formatRupiah(amount: number) {
  if (amount >= 1000000) return `Rp${(amount / 1000000).toFixed(1)}jt`
  if (amount >= 1000) return `Rp${(amount / 1000).toFixed(0)}K`
  return `Rp${amount}`
}

export default function HistoryClient({ sessions }: { sessions: SessionData[] }) {
  const [expandedSessions, setExpandedSessions] = React.useState<Set<string>>(new Set())

  function toggleSession(id: string) {
    setExpandedSessions(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Global stats
  const totalSessions = sessions.filter(s => s.status === "selesai").length
  const totalWins = sessions.reduce((sum, s) => sum + s.wins, 0)
  const totalLosses = sessions.reduce((sum, s) => sum + s.losses, 0)
  const totalRevenue = sessions.reduce((sum, s) => sum + s.revenue, 0)
  const totalMatches = sessions.reduce((sum, s) => sum + s.totalMatches, 0)

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-heading font-black text-white uppercase tracking-widest flex items-center gap-3">
          <History className="w-8 h-8 text-red-bright" />
          Riwayat Sesi
        </h1>
        <p className="text-muted mt-1 font-body">Rekapan semua sesi yang telah selesai.</p>
      </div>

      {/* Global Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted">Total Sesi</CardTitle>
            <History className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-black text-white">{totalSessions}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted">Total Menang</CardTitle>
            <Trophy className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-black text-success">{totalWins}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-danger">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted">Total Kalah</CardTitle>
            <TrendingDown className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-black text-danger">{totalLosses}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted">Total Match</CardTitle>
            <Swords className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-heading font-black text-white">{totalMatches}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-black text-warning">{formatRupiah(totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {sessions.length === 0 ? (
          <Card className="border-t border-border">
            <CardContent className="text-center py-12 text-muted">
              <History className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="font-heading text-lg">Belum Ada Riwayat Sesi</p>
              <p className="text-sm mt-1">Tutup sesi pertama Anda di Dashboard untuk melihat rekapan di sini.</p>
            </CardContent>
          </Card>
        ) : (
          sessions.map(session => {
            const isExpanded = expandedSessions.has(session.id)
            const isActive = session.status === "aktif" || session.status === "istirahat"
            const winRate = session.totalMatches > 0 ? Math.round((session.wins / session.totalMatches) * 100) : 0

            return (
              <Card key={session.id} className={`border-t transition-all ${isActive ? 'border-l-4 border-l-success shadow-[0_0_20px_rgba(54,184,115,0.1)]' : 'border-border'}`}>
                {/* Session Header - Clickable */}
                <button
                  onClick={() => toggleSession(session.id)}
                  className="w-full text-left px-6 py-5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Expand icon */}
                  <div className="text-muted">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>

                  {/* Session info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-heading font-black text-white text-lg tracking-wide truncate">{session.name}</h3>
                      <Badge variant={isActive ? "success" : "secondary"} className="text-[9px] flex-shrink-0">
                        {isActive ? "AKTIF" : "SELESAI"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted">
                      {session.startedAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(session.startedAt)} • {formatTime(session.startedAt)}
                          {session.endedAt && ` — ${formatTime(session.endedAt)}`}
                        </span>
                      )}
                      {session.startedAt && session.endedAt && (
                        <span className="text-white/30">({getDuration(session.startedAt, session.endedAt)})</span>
                      )}
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="flex items-center gap-6 flex-shrink-0">
                    {/* W/L */}
                    <div className="text-center hidden sm:block">
                      <div className="flex items-center gap-1 text-sm font-heading font-black">
                        <span className="text-success">{session.wins}W</span>
                        <span className="text-muted">-</span>
                        <span className="text-danger">{session.losses}L</span>
                      </div>
                      <div className="text-[9px] text-muted uppercase tracking-widest">{winRate}% WR</div>
                    </div>

                    {/* Matches */}
                    <div className="text-center hidden md:block">
                      <div className="text-sm font-heading font-black text-white">{session.totalMatches}</div>
                      <div className="text-[9px] text-muted uppercase tracking-widest">Match</div>
                    </div>

                    {/* Customers */}
                    <div className="text-center hidden md:block">
                      <div className="text-sm font-heading font-black text-white">{session.uniqueCustomers}</div>
                      <div className="text-[9px] text-muted uppercase tracking-widest">Pelanggan</div>
                    </div>

                    {/* Revenue */}
                    <div className="text-center">
                      <div className="text-sm font-heading font-black text-warning">{formatRupiah(session.revenue)}</div>
                      <div className="text-[9px] text-warning/60 uppercase tracking-widest">Pendapatan</div>
                    </div>
                  </div>
                </button>

                {/* Expanded: Match List */}
                {isExpanded && (
                  <CardContent className="pt-0 pb-4 px-6 border-t border-white/5 overflow-x-auto">
                    {session.matches.length === 0 ? (
                      <p className="text-center text-muted py-6 text-sm">Belum ada match di sesi ini.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[60px]">No.</TableHead>
                            <TableHead className="w-[100px]">Hasil</TableHead>
                            <TableHead>Pemain</TableHead>
                            <TableHead className="w-[100px]">Waktu</TableHead>
                            <TableHead className="w-[80px]">Durasi</TableHead>
                            <TableHead className="w-[80px]">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {session.matches.map(match => (
                            <TableRow key={match.id} className={
                              match.matchResult === "WIN" ? "bg-success/5" :
                              match.matchResult === "LOSS" ? "bg-danger/5" :
                              match.status === "CANCELLED" ? "bg-white/[0.02] opacity-50" :
                              ""
                            }>
                              <TableCell className="font-heading font-bold text-muted">#{match.matchNumber}</TableCell>
                              <TableCell>
                                {match.status === "CANCELLED" ? (
                                  <Badge variant="destructive" className="text-[9px]">BATAL</Badge>
                                ) : match.matchResult === "WIN" ? (
                                  <img src="/images/victory.png" alt="Victory" className="h-8 w-auto object-contain drop-shadow-[0_0_5px_rgba(54,184,115,0.4)]" />
                                ) : match.matchResult === "LOSS" ? (
                                  <img src="/images/defeat.png" alt="Defeat" className="h-8 w-auto object-contain drop-shadow-[0_0_5px_rgba(226,59,73,0.4)]" />
                                ) : (
                                  <Badge variant="secondary" className="text-[9px]">SELESAI</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {match.players.map(p => (
                                    <Badge key={p.id} variant="secondary" className="text-[9px]">
                                      {p.nickname}
                                      {p.serviceType === "fast_track" && (
                                        <Zap className="w-2.5 h-2.5 ml-0.5 text-warning fill-warning inline" />
                                      )}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="text-xs text-muted">
                                {match.startedAt ? formatTime(match.startedAt) : "-"}
                              </TableCell>
                              <TableCell className="text-xs text-white font-heading font-bold">
                                {getDuration(match.startedAt, match.endedAt)}
                              </TableCell>
                              <TableCell>
                                <Badge variant={match.status === "DONE" ? "success" : "destructive"} className="text-[9px]">
                                  {match.status === "DONE" ? "SELESAI" : "BATAL"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                )}
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
