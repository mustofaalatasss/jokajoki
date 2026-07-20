"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, type Variants } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Users, Swords, Clock, Crown, PlayCircle, Plus, LayoutList, Trash2, Play, FastForward, Zap, Power, Trophy, TrendingDown, DollarSign, UserCheck, ArrowRightLeft, Pencil } from "lucide-react"
import { AddQueueDialog } from "./AddQueueDialog"
import { InlineAddQueueForm } from "./InlineAddQueueForm"
import { endMatch, cancelMatch, removePlayerFromMatch, removeFromQueue, startMatch, pullToSquad, kickFromSquad, blacklistCustomer, quickProcessMatches, closeSession, editQueueItem } from "./actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

type Stats = {
  totalQueue: number
  fastTrackCount: number
  matchesDone: number
  currentMatch: {
    id: string
    status: string
    startedAt: string | Date
    endedAt: string | Date | null
  } | null
  activeSquad: {
    id: string
    customerId: string
    nickname: string
    role: string
    rank: string
    matchesPurchased: number
    matchesRemaining: number
    activeSlot: number | null
    type: string
  }[]
}

type QueueItem = {
  id: string
  type: string
  status: string
  note: string | null
  role: string
  rank: string
  matchesRemaining: number
  createdAt: string | Date
  user: { id: string; nickname: string; role: string }
}

type QueueData = {
  queues: QueueItem[]
  totalWaiting: number
}

type Joki = {
  id: string
  nickname: string | null
  role: string
  jokiRole: string | null
} | null

function formatTime(date: string | Date) {
  const d = new Date(date)
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }) + " WIB"
}

function getRankStyle(rank: string) {
  switch (rank) {
    case "Mythical Immortal":
      return "bg-gradient-to-r from-white/20 to-pink-500/20 border border-white/70 text-white shadow-[0_0_20px_rgba(255,255,255,0.4)] font-black"
    case "Mythical Glory":
      return "bg-gradient-to-r from-orange-500/20 to-red-600/20 border border-orange-500/50 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)] font-black"
    case "Mythical Honor":
      return "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] font-black"
    case "Mythic":
      return "bg-gradient-to-r from-purple-500/20 to-yellow-500/20 border border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)] font-bold"
    case "Legend":
      return "bg-amber-600/10 border border-amber-600/30 text-amber-500 shadow-[0_0_10px_rgba(217,119,6,0.15)] font-bold"
    case "Epic":
      return "bg-green-500/10 border border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)] font-bold"
    default:
      return "bg-[var(--surface-hover)] border border-[var(--border-default)] text-muted font-bold"
  }
}

function getRankRowStyle(rank: string) {
  switch (rank) {
    case "Mythical Immortal":
      return "bg-gradient-to-r from-pink-500/10 via-white/5 to-transparent border-b-2 border-[var(--border-default)] hover:from-pink-500/20"
    case "Mythical Glory":
      return "bg-gradient-to-r from-orange-500/10 via-red-500/5 to-transparent border-b-2 border-orange-500/30 hover:from-orange-500/20"
    case "Mythical Honor":
      return "bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent border-b-2 border-cyan-400/30 hover:from-cyan-500/20"
    case "Mythic":
      return "bg-gradient-to-r from-purple-500/10 via-yellow-500/5 to-transparent border-b-2 border-purple-500/30 hover:from-purple-500/20"
    case "Legend":
      return "bg-gradient-to-r from-amber-600/10 to-transparent border-b border-amber-600/20 hover:from-amber-600/20"
    case "Epic":
      return "bg-gradient-to-r from-green-500/10 to-transparent border-b border-green-500/20 hover:from-green-500/20"
    default:
      return "bg-white/[0.02] border-b border-[var(--border-default)] hover:bg-white/[0.05]"
  }
}

export default function DashboardClient({
  stats,
  queueData,
  joki,
}: {
  stats: Stats
  queueData: QueueData
  joki: Joki
}) {
  const router = useRouter()
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [loading, setLoading] = React.useState<string | null>(null)
  
  // Check if it is a demo account
  const isDemo = joki?.nickname === "Kylian Mbappe" && joki?.role === "JOKI"
  
  // Blacklist state
  const [demoWarning, setDemoWarning] = React.useState(false); const [blacklistPlayer, setBlacklistPlayer] = React.useState<{id: string, nickname: string} | null>(null)
  const [reason, setReason] = React.useState("")
  const [editPlayer, setEditPlayer] = React.useState<{id: string, nickname: string, role: string, rank: string, matches: number} | null>(null)
  
  // Auto Pull State
  const [isAutoPull, setIsAutoPull] = React.useState(true)
  const [isQueueExpanded, setIsQueueExpanded] = React.useState(false)
  React.useEffect(() => {
    const saved = localStorage.getItem("joki_autopull")
    if (saved !== null) setIsAutoPull(saved === "true")
  }, [])
  const toggleAutoPull = () => {
    const newVal = !isAutoPull
    setIsAutoPull(newVal)
    localStorage.setItem("joki_autopull", String(newVal))
  }

  async function handleEditPlayerSubmit(e: React.FormEvent) { if (isDemo) return setDemoWarning(true);
    e.preventDefault()
    if (!editPlayer || !editPlayer.nickname.trim() || !editPlayer.role.trim() || !editPlayer.rank.trim() || editPlayer.matches < 1) return
    setLoading(`edit-${editPlayer.id}`)
    await editQueueItem(editPlayer.id, editPlayer.nickname, editPlayer.role, editPlayer.rank, editPlayer.matches)
    setLoading(null)
    setEditPlayer(null)
    router.refresh()
  }
  
  // Quick Process state
  const [quickProcessOpen, setQuickProcessOpen] = React.useState(false)
  const [quickMatches, setQuickMatches] = React.useState("0")
  const [quickLosses, setQuickLosses] = React.useState("0")

  // Close Session state
  const [closeSessionOpen, setCloseSessionOpen] = React.useState(false)
  const [closeSessionWarning, setCloseSessionWarning] = React.useState<{ activeCount: number; hasRunningMatch: boolean; activeNames: string[]; squadNames?: string[]; queueNames?: string[]; message: string } | null>(null)
  const [recapData, setRecapData] = React.useState<{
    sessionName: string; startedAt: Date | string | null; endedAt: Date | string;
    totalMatches: number; totalWins: number; totalLosses: number;
    totalRevenue: number; uniqueCustomers: number; carryOverCount: number;
  } | null>(null)
  const [recapOpen, setRecapOpen] = React.useState(false)

  const { totalQueue, fastTrackCount, matchesDone, currentMatch, activeSquad } = stats
  const { totalWaiting } = queueData
  // Safely limit queues to 7 unless expanded
  const queues = isQueueExpanded ? queueData.queues : queueData.queues.slice(0, 7)
  const estimatedMinutes = totalQueue * 15
  
  // Calculate if squad is full (including Joki)
  const isSquadFull = activeSquad.length >= 4

  async function handleEndMatch(result: string) { if (isDemo) return setDemoWarning(true);
    if (!currentMatch) return
    setLoading("end")
    await endMatch(currentMatch.id, result)
    setLoading(null)
    router.refresh()
  }

  async function handleCancelMatch() { if (isDemo) return setDemoWarning(true);
    if (!currentMatch) return
    setLoading("cancel")
    await cancelMatch(currentMatch.id)
    setLoading(null)
    router.refresh()
  }

  async function handleRemovePlayer(queueId: string) { if (isDemo) return setDemoWarning(true);
    setLoading(`remove-${queueId}`)
    await kickFromSquad(queueId, isAutoPull)
    setLoading(null)
    router.refresh()
  }

  async function handleRemoveFromQueue(queueId: string) { if (isDemo) return setDemoWarning(true);
    setLoading(`queue-${queueId}`)
    await removeFromQueue(queueId)
    setLoading(null)
    router.refresh()
  }

  async function handlePullToSquad(queueId: string) { if (isDemo) return setDemoWarning(true);
    setLoading(`pull-${queueId}`)
    await pullToSquad(queueId)
    setLoading(null)
    router.refresh()
  }

  async function handleStartMatchAll() { if (isDemo) return setDemoWarning(true);
    if (activeSquad.length === 0) return
    setLoading("start-all")
    const ids = activeSquad.map(q => q.id) // mabarEntry IDs in the squad
    await startMatch(ids)
    setLoading(null)
    router.refresh()
  }

  async function submitBlacklist() { if (isDemo) return setDemoWarning(true);
    if (!blacklistPlayer) return
    setLoading("blacklist")
    await blacklistCustomer(blacklistPlayer.id, reason || "Melanggar Aturan")
    setLoading(null)
    setBlacklistPlayer(null)
    setReason("")
    router.refresh()
  }

  async function handleQuickProcess() { if (isDemo) return setDemoWarning(true);
    const matches = parseInt(quickMatches) || 0
    const losses = parseInt(quickLosses) || 0
    const wins = Math.max(0, matches - losses)
    if (matches <= 0) return
    
    setLoading("quick")
    await quickProcessMatches(wins, losses)
    setLoading(null)
    setQuickProcessOpen(false)
    setQuickMatches("0")
    setQuickLosses("0")
    router.refresh()
  }

  async function handleCloseSession(force: boolean = false) { if (isDemo) return setDemoWarning(true);
    setLoading("close-session")
    const result = await closeSession(force)
    setLoading(null)
    
    if ('requiresConfirmation' in result && result.requiresConfirmation) {
      setCloseSessionWarning({
        activeCount: result.activeCount || 0,
        hasRunningMatch: result.hasRunningMatch || false,
        activeNames: result.activeNames || [],
        squadNames: result.squadNames || [],
        queueNames: result.queueNames || [],
        message: result.message || ""
      })
      setCloseSessionOpen(true)
    } else if ('success' in result && result.success && result.recap) {
      setCloseSessionOpen(false)
      setCloseSessionWarning(null)
      setRecapData(result.recap)
      setRecapOpen(true)
      router.refresh()
    }
  }

  if (recapOpen && recapData) {
    return (
      <motion.div 
        className="max-w-4xl mx-auto space-y-8 py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center space-y-4">
          <Trophy className="w-20 h-20 text-warning mx-auto drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]" />
          <h1 className="text-4xl md:text-5xl font-heading font-black text-[var(--text-primary)] tracking-widest uppercase">
            Sesi Selesai!
          </h1>
          <p className="text-xl text-muted font-bold">{recapData.sessionName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-success/5 border-success/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Trophy className="w-32 h-32 text-success" />
            </div>
            <CardContent className="p-8 text-center relative z-10">
              <div className="text-7xl font-heading font-black text-success mb-2 drop-shadow-[0_0_15px_rgba(54,184,115,0.4)]">{recapData.totalWins}</div>
              <div className="text-sm text-success font-bold tracking-widest uppercase">Total Menang</div>
            </CardContent>
          </Card>
          
          <Card className="bg-danger/5 border-danger/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingDown className="w-32 h-32 text-danger" />
            </div>
            <CardContent className="p-8 text-center relative z-10">
              <div className="text-7xl font-heading font-black text-danger mb-2 drop-shadow-[0_0_15px_rgba(226,59,73,0.4)]">{recapData.totalLosses}</div>
              <div className="text-sm text-danger font-bold tracking-widest uppercase">Total Kalah</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[var(--card-bg)] border-[var(--border-default)]">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Swords className="w-10 h-10 text-muted mb-3" />
              <div className="text-4xl font-heading font-black text-[var(--text-primary)]">{recapData.totalMatches}</div>
              <div className="text-xs text-muted uppercase tracking-widest font-bold mt-2">Total Match</div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-[var(--border-default)]">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <UserCheck className="w-10 h-10 text-muted mb-3" />
              <div className="text-4xl font-heading font-black text-[var(--text-primary)]">{recapData.uniqueCustomers}</div>
              <div className="text-xs text-muted uppercase tracking-widest font-bold mt-2">Total Pelanggan</div>
            </CardContent>
          </Card>

          <Card className="bg-warning/10 border-warning/20">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <DollarSign className="w-10 h-10 text-warning mb-3 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
              <div className="text-4xl font-heading font-black text-warning">
                Rp {(recapData.totalRevenue).toLocaleString("id-ID")}
              </div>
              <div className="text-xs text-warning uppercase tracking-widest font-bold mt-2">Estimasi Pendapatan</div>
              <p className="text-[10px] text-warning/70 italic mt-3 px-2">
                *Harga ini belum termasuk paket bundling Anda dan potongan platform (Saweria, dll).
              </p>
            </CardContent>
          </Card>
        </div>

        {recapData.carryOverCount > 0 && (
          <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-lg text-center">
            <ArrowRightLeft className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <div className="text-xl text-blue-300 font-bold">{recapData.carryOverCount} pelanggan antrean dipindahkan</div>
            <p className="text-sm text-blue-400/70 mt-2">Pelanggan ini otomatis akan masuk ke antrean Anda di sesi live berikutnya.</p>
          </div>
        )}

        <div className="pt-8 flex justify-center">
          <Button 
            size="lg" 
            className="px-12 py-6 text-lg font-bold tracking-widest uppercase bg-red-bright hover:bg-red-bright/90 text-[var(--text-primary)] shadow-[0_0_30px_rgba(226,59,73,0.3)]"
            onClick={() => { setRecapOpen(false); setRecapData(null); router.refresh() }}
          >
            Tutup Rekapan & Kembali
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <AddQueueDialog open={addDialogOpen} onClose={() => { setAddDialogOpen(false); router.refresh() }} jokiRole={joki?.jokiRole || "Jungler"} />

      {/* Quick Process Dialog */}
      <Dialog open={quickProcessOpen} onOpenChange={setQuickProcessOpen}>
        <DialogContent className="sm:max-w-md bg-surface border-[var(--border-default)]">
          <DialogHeader>
            <DialogTitle className="text-warning font-heading font-black tracking-widest uppercase flex items-center gap-2">
              <FastForward className="w-5 h-5" /> Proses Cepat Match
            </DialogTitle>
            <DialogDescription>
              Masukkan jumlah menang dan kalah. Sistem otomatis menyimulasikan match, mengurangi sisa kuota pemain, dan memasukkan pemain antrean berikutnya ke skuad tanpa Anda harus menekan tombol satu per satu.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 py-4 items-end">
            <div className="space-y-2 flex-1">
              <label className="text-xs font-bold text-muted uppercase tracking-widest">Jumlah Match</label>
              <Input
                type="number"
                min="1"
                value={quickMatches}
                onChange={(e) => setQuickMatches(e.target.value)}
                className="bg-[var(--surface-2)] border-[var(--border-default)] focus-visible:ring-white/50"
              />
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-xs font-bold text-danger uppercase tracking-widest">Total Kalah</label>
              <Input
                type="number"
                min="0"
                max={quickMatches}
                value={quickLosses}
                onChange={(e) => setQuickLosses(e.target.value)}
                className="bg-[var(--surface-2)] border-danger/30 focus-visible:ring-danger"
              />
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-xs font-bold text-success uppercase tracking-widest">Otomatis Menang</label>
              <Input
                type="number"
                disabled
                value={Math.max(0, (parseInt(quickMatches) || 0) - (parseInt(quickLosses) || 0))}
                className="bg-success/10 border-success/30 text-success font-bold"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setQuickProcessOpen(false)} disabled={loading === "quick"}>Batal</Button>
            <Button className="bg-warning text-black hover:bg-warning/90 font-bold" onClick={handleQuickProcess} disabled={loading === "quick"}>
              {loading === "quick" ? "Memproses..." : "Proses Sekarang"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blacklist Dialog */}
      <Dialog open={!!blacklistPlayer} onOpenChange={(o) => !o && setBlacklistPlayer(null)}>
        <DialogContent className="sm:max-w-md bg-surface border-red-500/20">
          <DialogHeader>
            <DialogTitle className="text-danger font-heading font-black tracking-widest uppercase flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Blacklist Pelanggan
            </DialogTitle>
            <DialogDescription>
              Anda akan mem-blacklist <strong className="text-[var(--text-primary)]">{blacklistPlayer?.nickname}</strong> dan mengeluarkannya dari skuad.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-danger uppercase tracking-widest">Alasan Blacklist</label>
              <Input
                placeholder="Contoh: AFK, Nge-troll, Toxic"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="bg-[var(--surface-2)] border-red-500/30 focus-visible:ring-danger"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBlacklistPlayer(null)} disabled={loading === "blacklist"}>Batal</Button>
            <Button variant="destructive" onClick={submitBlacklist} disabled={loading === "blacklist"}>
              {loading === "blacklist" ? "Memproses..." : "Blacklist Sekarang"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Session Confirmation Dialog */}
      <Dialog open={closeSessionOpen} onOpenChange={setCloseSessionOpen}>
        <DialogContent className="sm:max-w-md bg-surface border-danger/20">
          <DialogHeader>
            <DialogTitle className="text-danger font-heading font-black tracking-widest uppercase flex items-center gap-2">
              <Power className="w-5 h-5" /> Tutup Sesi
            </DialogTitle>
            <DialogDescription>
              {closeSessionWarning?.message || "Yakin ingin menutup sesi ini?"}
            </DialogDescription>
          </DialogHeader>
          {closeSessionWarning && ((closeSessionWarning.squadNames && closeSessionWarning.squadNames.length > 0) || (closeSessionWarning.queueNames && closeSessionWarning.queueNames.length > 0)) ? (
            <div className="py-2 space-y-3">
              {closeSessionWarning.squadNames && closeSessionWarning.squadNames.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">Di Skuad / Sedang Main:</p>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {closeSessionWarning.squadNames.map((name, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px] border-cyan-400/30 text-cyan-400">{name}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {closeSessionWarning.queueNames && closeSessionWarning.queueNames.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-warning uppercase tracking-widest mb-1">Masih di Antrean:</p>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {closeSessionWarning.queueNames.map((name, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px] border-warning/30 text-warning">{name}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-xs text-muted mt-2">Pelanggan ini akan otomatis dipindahkan ke sesi berikutnya.</p>
            </div>
          ) : closeSessionWarning && closeSessionWarning.activeNames.length > 0 && (
            <div className="py-2 space-y-2">
              <p className="text-xs font-bold text-warning uppercase tracking-widest">Pelanggan yang masih aktif:</p>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {closeSessionWarning.activeNames.map((name, i) => (
                  <Badge key={i} variant="secondary" className="text-[10px]">{name}</Badge>
                ))}
              </div>
              <p className="text-xs text-muted mt-2">Pelanggan ini akan otomatis dipindahkan ke sesi berikutnya.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setCloseSessionOpen(false); setCloseSessionWarning(null) }} disabled={loading === "close-session"}>Batal</Button>
            <Button variant="destructive" onClick={() => handleCloseSession(true)} disabled={loading === "close-session"}>
              <Power className="w-4 h-4 mr-2" />
              {loading === "close-session" ? "Menutup..." : "Paksa Tutup Sesi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <motion.div
        className="max-w-7xl mx-auto space-y-8 pb-20"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--border-default)] pb-6">
          <div>
            <h1 className="text-3xl font-heading font-black text-[var(--text-primary)] uppercase tracking-widest flex items-center gap-3">
              <span className="w-3 h-3 bg-red-bright animate-pulse" />
              Dashboard Live
            </h1>
            <p className="text-muted mt-1 font-body">Pantau antrean, kelola pemain, dan eksekusi Fast Track.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            {!currentMatch && activeSquad.length > 0 && (
              <Button
                variant="outline"
                className="font-bold tracking-widest uppercase text-warning border-warning/50 hover:bg-warning/10"
                onClick={() => setQuickProcessOpen(true)}
              >
                <FastForward className="w-4 h-4 mr-2" />
                Proses Cepat
              </Button>
            )}
            <Button className="flex-1 sm:flex-none" onClick={() => setAddDialogOpen(true)}>
              <Plus className="w-5 h-5 mr-2" /> Tambah Antrean
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-red-bright">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted">Total Antrean</CardTitle>
              <Users className="h-4 w-4 text-red-bright" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-heading font-black text-[var(--text-primary)]">{totalQueue}</div>
              <p className="text-xs text-muted mt-1">{fastTrackCount} Fast Track menunggu</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted">Estimasi Waktu</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-heading font-black text-[var(--text-primary)]">~{estimatedMinutes}<span className="text-xl text-muted">m</span></div>
              <p className="text-xs text-muted mt-1">rata-rata per match 15 menit</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted">Match Selesai</CardTitle>
              <Swords className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-heading font-black text-[var(--text-primary)]">{matchesDone}</div>
              <p className="text-xs text-muted mt-1">pada sesi live saat ini</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted">Pemain VIP</CardTitle>
              <Crown className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-heading font-black text-[var(--text-primary)]">{fastTrackCount}</div>
              <p className="text-xs text-muted mt-1">menggunakan fasilitas Fast Track</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-3 mt-4">

          {/* Skuad Aktif Table */}
          <motion.div variants={itemVariants} className="md:col-span-4 lg:col-span-2">
            <Card className="h-full border-t border-red-bright/50 shadow-[0_0_30px_var(--shadow-color)] relative overflow-hidden bg-[var(--card-bg)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-bright/10 rounded-full blur-[80px] pointer-events-none" />
              <CardHeader className="border-b border-[var(--border-default)] pb-4 bg-gradient-to-r from-red-dark/20 to-transparent">
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-red-bright flex items-center gap-2 text-xl font-heading font-black tracking-widest uppercase">
                        <PlayCircle className="w-6 h-6 animate-pulse" />
                        {currentMatch ? "Match Sedang Berlangsung" : "1. Skuad Aktif"}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {currentMatch 
                          ? `Match ID: ${currentMatch.id.slice(0, 8)}...` 
                          : "Maksimal 4 pelanggan. Siap untuk mulai match."}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleAutoPull}
                        className={`h-12 px-4 font-bold tracking-widest uppercase border ${isAutoPull ? 'border-success text-success hover:bg-success/10' : 'border-muted text-muted hover:bg-muted/10'}`}
                      >
                        Auto-Pull: {isAutoPull ? "ON" : "OFF"}
                      </Button>
                      {!currentMatch && activeSquad.length > 0 && (
                        <Button 
                          className="font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(226,59,73,0.3)] bg-red-bright hover:bg-red-bright/90 text-[var(--text-primary)] border-none h-12 px-6"
                          onClick={handleStartMatchAll}
                          disabled={loading === "start-all"}
                        >
                          <PlayCircle className="w-5 h-5 mr-2" />
                          {loading === "start-all" ? "..." : "Mulai Match"}
                        </Button>
                      )}
                    </div>
                  </div>
                  {currentMatch && (
                    <div className="text-right bg-[var(--surface-2)] px-4 py-2 rounded border border-[var(--border-default)] mt-4 sm:mt-0">
                      <MatchTimer startedAt={currentMatch.startedAt} isDemo={isDemo} />
                      <span className="text-xs font-bold text-muted uppercase tracking-widest">Durasi Berjalan</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto relative z-10">
                <Table>
                  <TableHeader className="bg-[var(--surface-2)]">
                    <TableRow className="border-[var(--border-default)]">
                      <TableHead className="w-[80px] text-center font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs">Slot</TableHead>
                      <TableHead className="font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs">Nickname</TableHead>
                      <TableHead className="font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs">Role</TableHead>
                      <TableHead className="text-center font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs">Rank</TableHead>
                      <TableHead className="font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs text-center">Sisa Match</TableHead>
                      <TableHead className="font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs text-center">Status</TableHead>
                      <TableHead className="text-right font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* JOKI (Host) - Player 1 */}
                    {joki && (
                      <TableRow className="bg-red-dark/10 border-[var(--border-default)] hover:bg-red-dark/20 transition-colors">
                        <TableCell className="text-center font-heading font-black text-red-bright text-lg">P1</TableCell>
                        <TableCell>
                          <div className="font-bold text-[var(--text-primary)] tracking-wide flex items-center gap-2">
                            {joki.nickname} <Badge variant="default" className="scale-90 origin-left shadow-[0_0_10px_rgba(226,59,73,0.5)]">JOKI</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-bold text-red-bright">{joki.jokiRole || "Hyper Carry"}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded bg-gradient-to-r from-red-bright/20 to-yellow-500/20 border border-red-bright/50 text-red-100 shadow-[0_0_15px_rgba(226,59,73,0.3)] font-black">
                            HOST
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-heading font-bold text-muted">-</TableCell>
                        <TableCell className="text-center">
                          <span className="text-xs font-bold text-success uppercase tracking-widest">Ready</span>
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    )}

                    {/* Other Players in Squad */}
                    {activeSquad.length > 0 ? activeSquad.map((player, idx) => {
                      const isNewcomer = player.matchesPurchased === player.matchesRemaining && !currentMatch;
                      return (
                        <TableRow key={player.id} className={`transition-all duration-1000 ${isNewcomer ? 'bg-gradient-to-r from-success/20 to-transparent border-l-4 border-l-success shadow-[inset_0_0_40px_rgba(54,184,115,0.15)] animate-pulse' : getRankRowStyle(player.rank)}`}>
                          <TableCell className="text-center font-heading font-black text-muted">P{idx + 2}</TableCell>
                          <TableCell>
                            <span className="font-bold text-[var(--text-primary)] tracking-wide flex items-center gap-2">
                              {player.nickname}
                              {player.type === "FAST_TRACK" && (
                                <Zap className="w-3 h-3 text-warning drop-shadow-[0_0_5px_rgba(234,179,8,0.8)] fill-warning" />
                              )}
                              {isNewcomer && (
                                <span className="flex h-2 w-2 relative">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                                </span>
                              )}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-bold text-[var(--text-primary)]">{player.role}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded ${getRankStyle(player.rank)}`}>
                              {player.rank.replace("Mythical ", "")}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-bold text-base text-[var(--text-primary)]">{player.matchesRemaining}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            {isNewcomer ? (
                              <span className="text-[10px] font-bold text-success uppercase tracking-widest border border-success/50 bg-success/20 px-2 py-1 rounded shadow-[0_0_10px_rgba(54,184,115,0.4)]">Baru Naik</span>
                            ) : (
                              <span className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-widest border border-[var(--border-default)] bg-[var(--surface-hover)] px-2 py-1 rounded">Di Skuad</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {currentMatch ? (
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 text-xs text-danger border-danger/30 hover:bg-danger/10"
                                  onClick={() => { setReason(""); setBlacklistPlayer({ id: player.id, nickname: player.nickname }) }}
                                >
                                  Blacklist
                                </Button>
                              </div>
                            ) : (
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-muted hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                                  onClick={() => setEditPlayer({ id: player.id, nickname: player.nickname, role: player.role, rank: player.rank, matches: player.matchesRemaining })}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-xs text-danger hover:text-danger hover:bg-danger/10"
                                  onClick={() => handleRemovePlayer(player.id)}
                                  disabled={loading === `remove-${player.id}`}
                                >
                                  {loading === `remove-${player.id}` ? "..." : "Keluarkan"}
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    }) : (
                      <TableRow>
                        <TableCell colSpan={!currentMatch ? 7 : 6} className="text-center py-8 text-muted">
                          Belum ada pemain pelanggan di skuad.
                        </TableCell>
                      </TableRow>
                    )}
                    
                    {/* Empty Slots */}
                    {activeSquad.length < 4 && Array.from({ length: 4 - activeSquad.length }).map((_, idx) => (
                      <TableRow key={`empty-${idx}`} className="border-[var(--border-default)] opacity-50">
                        <TableCell className="text-center font-heading font-bold text-muted">P{activeSquad.length + idx + 2}</TableCell>
                        <TableCell colSpan={2}>
                          <span className="text-muted italic text-sm">Menunggu pemain...</span>
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-center">
                          <span className="text-[10px] font-bold text-muted uppercase tracking-widest border border-dashed border-[var(--border-default)] px-2 py-1 rounded">Kosong</span>
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Match Actions */}
                {currentMatch && (
                  <div className="p-4 flex gap-3 border-t border-[var(--border-default)] bg-[var(--surface-2)]">
                    <Button
                      className="w-full bg-success hover:bg-success/90 text-black font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(54,184,115,0.2)]"
                      onClick={() => handleEndMatch("Menang")}
                      disabled={loading === "end"}
                    >
                      {loading === "end" ? "..." : "Menang"}
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full font-bold tracking-widest uppercase"
                      onClick={() => handleEndMatch("Kalah")}
                      disabled={loading === "end"}
                    >
                      {loading === "end" ? "..." : "Kalah"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full font-bold tracking-widest uppercase text-muted border-[var(--border-default)]"
                      onClick={handleCancelMatch}
                      disabled={loading === "cancel"}
                    >
                      {loading === "cancel" ? "..." : "Batal"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Up Next Queue (Compact) */}
          <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-1">
            <Card className="h-full bg-[var(--card-bg)]">
              <CardHeader className="border-b border-[var(--border-default)] pb-4 bg-surface-2/20">
                <CardTitle className="text-[var(--text-primary)] text-lg font-heading font-black tracking-widest uppercase">
                  Antrean Berikutnya
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {queues.length === 0 ? (
                  <p className="text-center text-muted py-8">Antrean kosong</p>
                ) : (
                  queues.slice(0, 5).map((q, idx) => (
                    <div
                      key={q.id}
                      className={
                        q.type === "FAST_TRACK"
                          ? "p-3 bg-gradient-to-r from-warning/10 via-transparent to-transparent border-l-2 border-warning rounded-r-lg"
                          : "p-2 border-b border-[var(--border-default)] flex justify-between items-center group hover:bg-[var(--surface-hover)] transition-colors"
                      }
                    >
                      {q.type === "FAST_TRACK" ? (
                        <div className="flex justify-between items-start w-full">
                          <div>
                            <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-2 text-sm">
                              {q.user.nickname} <Zap className="w-3 h-3 text-warning drop-shadow-[0_0_5px_rgba(234,179,8,0.8)] fill-warning" />
                            </h4>
                            <p className="text-[10px] text-warning font-bold mt-1 uppercase tracking-widest">FAST TRACK</p>
                          </div>
                          <span className="text-xs font-bold text-muted">#{idx + 1}</span>
                        </div>
                      ) : (
                        <>
                          <div>
                            <h4 className="font-bold text-muted group-hover:text-[var(--text-primary)] transition-colors text-sm">{q.user.nickname}</h4>
                          </div>
                          <span className="text-xs font-bold text-muted">#{idx + 1}</span>
                        </>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>

        </div>

        {/* Inline Add Queue Form */}
        <motion.div variants={itemVariants} className="hidden lg:block mb-6">
          <InlineAddQueueForm onAdded={() => router.refresh()} jokiRole={joki?.jokiRole || "Jungler"} />
        </motion.div>

        {/* Main Queue Table */}
        <motion.div variants={itemVariants}>
          <Card className="border-t border-border bg-[var(--card-bg)]">
            <CardHeader className="border-b border-[var(--border-default)] pb-4 bg-surface-2/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[var(--text-primary)] flex items-center gap-2 text-xl font-heading font-black tracking-widest uppercase">
                  <LayoutList className="w-5 h-5 text-red-bright" /> 2. Daftar Lengkap Antrean
                </CardTitle>
                <Badge variant="outline" className="text-muted border-[var(--border-default)]">TOTAL: {totalWaiting} MENUNGGU</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-[var(--surface-2)]">
                  <TableRow className="border-[var(--border-default)]">
                    <TableHead className="w-[80px] text-center font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs">Urutan</TableHead>
                    <TableHead className="font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs">Nickname</TableHead>
                    <TableHead className="font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs">Role</TableHead>
                    <TableHead className="text-center font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs">Match</TableHead>
                    <TableHead className="text-center font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs">Status</TableHead>
                    <TableHead className="text-right font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted">
                        Belum ada antrean. Klik &quot;Tambah Antrean&quot; untuk memulai.
                      </TableCell>
                    </TableRow>
                  ) : (
                    queues.map((q, idx) => (
                      <TableRow
                        key={q.id}
                        className={`border-[var(--border-default)] transition-all ${
                          q.type === "FAST_TRACK" 
                            ? "bg-gradient-to-r from-warning/10 via-transparent to-transparent hover:from-warning/20 border-l-2 border-l-warning" 
                            : "hover:bg-[var(--surface-hover)]"
                        }`}
                      >
                        <TableCell className={`text-center font-heading font-black text-lg ${q.type === "FAST_TRACK" ? "text-warning" : "text-muted"}`}>
                          {idx + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[var(--text-primary)] text-base">{q.user.nickname}</span>
                            {q.type === "FAST_TRACK" && (
                              <Zap className="w-4 h-4 text-warning drop-shadow-[0_0_8px_rgba(234,179,8,0.8)] fill-warning" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-bold text-[var(--text-primary)]">{q.role}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-bold text-base text-[var(--text-primary)]">{q.matchesRemaining}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          {q.type === "FAST_TRACK" ? (
                            <span className="text-[10px] font-bold text-warning uppercase tracking-widest bg-warning/10 border border-warning/20 px-2 py-1 rounded shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                              VIP - Minta Slot
                            </span>
                          ) : q.status === "dijeda_fast_track" ? (
                            <span className="text-[10px] font-bold text-danger uppercase tracking-widest border border-danger/20 bg-danger/10 px-2 py-1 rounded">
                              Jeda (Digeser)
                            </span>
                          ) : q.status === "tidak_ada_kabar" ? (
                            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest border border-orange-500/20 bg-orange-500/10 px-2 py-1 rounded">
                              Tidak Ada Kabar
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-muted uppercase tracking-widest border border-[var(--border-default)] bg-[var(--surface-hover)] px-2 py-1 rounded">
                              Antrean
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            {!currentMatch && !isSquadFull && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 text-xs bg-[var(--surface-1)] hover:bg-[var(--surface-hover)] border-[var(--border-default)]"
                                onClick={() => handlePullToSquad(q.id)}
                                disabled={loading === `pull-${q.id}`}
                              >
                                <Play className="w-3 h-3 mr-1.5" />
                                {loading === `pull-${q.id}` ? "..." : "Naikkan"}
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                              onClick={() => setEditPlayer({ id: q.id, nickname: q.user.nickname, role: q.role, rank: q.rank, matches: q.matchesRemaining })}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger/10"
                              onClick={() => handleRemoveFromQueue(q.id)}
                              disabled={loading === `queue-${q.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            {totalWaiting > 7 && (
              <div className="border-t border-[var(--border-default)] p-4 flex justify-center bg-surface-2/10">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => setIsQueueExpanded(!isQueueExpanded)}
                >
                  {isQueueExpanded ? "Tampilkan Lebih Sedikit" : `Lihat Semua ${totalWaiting} Antrean`}
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Zona Berbahaya - Tutup Sesi */}
        <motion.div variants={itemVariants} className="mt-12 flex justify-start">
          <div className="flex items-center gap-4 bg-[var(--surface-1)] border border-[var(--danger)]/30 rounded-lg p-4 shadow-[0_0_15px_var(--shadow-color)]">
            <div className="text-left">
              <h3 className="font-heading font-black uppercase tracking-widest text-[var(--danger)] text-sm flex items-center gap-2">
                <Power className="w-4 h-4" /> Tutup Sesi Live
              </h3>
              <p className="text-[var(--text-muted)] text-[10px] mt-0.5">Rekap otomatis & simpan carry-over.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="px-4 h-9 text-xs font-bold uppercase text-[var(--danger)] border-[var(--danger)]/30 hover:bg-[var(--danger)]/10 ml-2"
              onClick={() => handleCloseSession(false)}
              disabled={loading === "close-session"}
            >
              {loading === "close-session" ? "..." : "Akhiri"}
            </Button>
          </div>
        </motion.div>

        {/* Edit Player Dialog */}
        <Dialog open={!!editPlayer} onOpenChange={(open) => !open && setEditPlayer(null)}>
          <DialogContent className="bg-[var(--card-bg)] border border-[var(--border-default)] text-[var(--text-primary)] sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-heading font-black tracking-widest uppercase">Edit Data Pemain</DialogTitle>
              <DialogDescription className="text-muted">
                Ubah nickname atau role pemain jika terjadi kesalahan saat input.
              </DialogDescription>
            </DialogHeader>
            {editPlayer && (
              <form onSubmit={handleEditPlayerSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted uppercase tracking-widest">Nickname Pemain</label>
                    <Input 
                      value={editPlayer.nickname} 
                      onChange={e => setEditPlayer({...editPlayer, nickname: e.target.value})}
                      className="bg-[var(--surface-2)] border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-muted"
                      placeholder="Masukkan Nickname"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted uppercase tracking-widest">Role</label>
                    <select 
                      value={editPlayer.role} 
                      onChange={e => setEditPlayer({...editPlayer, role: e.target.value})}
                      className="w-full h-10 rounded-md bg-[var(--surface-2)] border border-[var(--border-default)] text-[var(--text-primary)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      <option className="bg-[var(--surface-1)]" value="Jungler">Jungler</option>
                      <option className="bg-[var(--surface-1)]" value="Roamer">Roamer</option>
                      <option className="bg-[var(--surface-1)]" value="Mid Laner">Mid Laner</option>
                      <option className="bg-[var(--surface-1)]" value="Gold Laner">Gold Laner</option>
                      <option className="bg-[var(--surface-1)]" value="Exp Laner">Exp Laner</option>
                      <option className="bg-[var(--surface-1)]" value="Flex">Flex</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted uppercase tracking-widest">Rank</label>
                    <select 
                      value={editPlayer.rank} 
                      onChange={e => setEditPlayer({...editPlayer, rank: e.target.value})}
                      className="w-full h-10 rounded-md bg-[var(--surface-2)] border border-[var(--border-default)] text-[var(--text-primary)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      <option className="bg-[var(--surface-1)]" value="Mythical Immortal">Mythical Immortal</option>
                      <option className="bg-[var(--surface-1)]" value="Mythical Glory">Mythical Glory</option>
                      <option className="bg-[var(--surface-1)]" value="Mythical Honor">Mythical Honor</option>
                      <option className="bg-[var(--surface-1)]" value="Mythic">Mythic</option>
                      <option className="bg-[var(--surface-1)]" value="Legend">Legend</option>
                      <option className="bg-[var(--surface-1)]" value="Epic">Epic</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted uppercase tracking-widest">Jumlah Match</label>
                    <select 
                      value={editPlayer.matches.toString()} 
                      onChange={e => setEditPlayer({...editPlayer, matches: parseInt(e.target.value)})}
                      className="w-full h-10 rounded-md bg-[var(--surface-2)] border border-[var(--border-default)] text-[var(--text-primary)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} className="bg-[#1a1a1c]" value={num.toString()}>{num} Match</option>
                      ))}
                    </select>
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" className="border-[var(--border-default)] text-muted hover:text-[var(--text-primary)]" onClick={() => setEditPlayer(null)}>
                    Batal
                  </Button>
                  <Button type="submit" className="bg-red-bright hover:bg-red-dark text-[var(--text-primary)] font-bold" disabled={loading === `edit-${editPlayer.id}`}>
                    {loading === `edit-${editPlayer.id}` ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Demo Warning Dialog */}
        <Dialog open={demoWarning} onOpenChange={setDemoWarning}>
          <DialogContent className="sm:max-w-md bg-[#1a1a1c] border-warning/50 shadow-[0_0_50px_rgba(255,170,0,0.1)]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-warning font-heading text-xl uppercase font-black tracking-widest">
                <Crown className="w-6 h-6" /> Visualisasi Interaktif
              </DialogTitle>
              <DialogDescription className="text-muted pt-2 text-sm leading-relaxed">
                Anda sedang berada di dalam ruang pameran. Fitur aksi sengaja dinonaktifkan untuk menjaga data visualisasi tetap utuh. 
                <br /><br />
                <strong className="text-white">Ingin menggunakan Joka Joki Panel untuk bisnis Anda sendiri?</strong><br />
                1. Klik tombol <strong>Hubungi Kami</strong> di bawah.<br />
                2. Beritahu admin bahwa Anda ingin mendaftar langganan.<br />
                3. Admin akan membuatkan akun dan Organisasi khusus untuk Anda.<br />
                4. Anda akan mendapatkan akses penuh ke Panel dan siap beroperasi!
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="w-full sm:w-auto border-[var(--border-default)]" onClick={() => setDemoWarning(false)}>
                Kembali
              </Button>
              <a href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20tertarik%20berlangganan%20Joka%20Joki%20Panel." target="_blank" rel="noreferrer" className="w-full sm:w-auto flex-1">
                <Button className="w-full bg-warning hover:bg-warning/90 text-black font-bold uppercase tracking-widest">
                  Hubungi Kami
                </Button>
              </a>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </motion.div>
    </>
  )
}

function MatchTimer({ startedAt, isDemo = false }: { startedAt: string | Date, isDemo?: boolean }) {
  const [elapsed, setElapsed] = React.useState("")

  React.useEffect(() => {
    const start = new Date(startedAt).getTime()
    const tick = () => {
      const diff = Math.floor((Date.now() - start) / 1000)
      const mins = Math.floor(diff / 60).toString().padStart(2, "0")
      const secs = (diff % 60).toString().padStart(2, "0")
      setElapsed(`${mins}:${secs}`)
    }
    tick()
    if (isDemo) return
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [startedAt, isDemo])

  return <div className="text-2xl font-heading font-black tabular-nums text-white">
    {elapsed || "00:00"} {isDemo && <span className="text-xs text-muted font-sans font-normal">(PAUSED)</span>}
  </div>
}

