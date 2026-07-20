"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table"
import { extendSubscription, extendSubscriptionDays, blockJoki } from "./actions"
import { Crown, PowerOff, ShieldCheck, Key, Calendar, DollarSign, Activity, Users } from "lucide-react"

export function OwnerClient({ initialJokis }: { initialJokis: any[] }) {
  const router = useRouter()
  const [jokis, setJokis] = useState(initialJokis)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({})

  const handleExtend = async (id: string, months: number) => {
    setLoadingId(id)
    await extendSubscription(id, months)
    
    setJokis(prev => prev.map(j => {
      if (j.id === id) {
        let newEnd = j.subscriptionEndsAt ? new Date(j.subscriptionEndsAt) : new Date()
        if (newEnd < new Date()) newEnd = new Date()
        newEnd.setMonth(newEnd.getMonth() + months)
        return { ...j, subscriptionEndsAt: newEnd, subscriptionStatus: "ACTIVE" }
      }
      return j
    }))
    setLoadingId(null)
    router.refresh()
  }

  const handleExtendDays = async (id: string) => {
    const input = window.prompt("Berapa hari tambahan masa aktif yang diinginkan?")
    if (!input) return
    const days = parseInt(input)
    if (isNaN(days) || days <= 0) {
      alert("Masukkan angka hari yang valid!")
      return
    }

    setLoadingId(id)
    await extendSubscriptionDays(id, days)
    
    setJokis(prev => prev.map(j => {
      if (j.id === id) {
        let newEnd = j.subscriptionEndsAt ? new Date(j.subscriptionEndsAt) : new Date()
        if (newEnd < new Date()) newEnd = new Date()
        newEnd.setDate(newEnd.getDate() + days)
        return { ...j, subscriptionEndsAt: newEnd, subscriptionStatus: "ACTIVE" }
      }
      return j
    }))
    setLoadingId(null)
    router.refresh()
  }

  const handleBlock = async (id: string) => {
    if (!confirm("Yakin ingin memblokir/mengakhiri masa aktif Joki ini?")) return
    setLoadingId(id)
    await blockJoki(id)
    setJokis(prev => prev.map(j => {
      if (j.id === id) {
        return { ...j, subscriptionStatus: "EXPIRED" }
      }
      return j
    }))
    setLoadingId(null)
    router.refresh()
  }

  const togglePassword = (id: string) => {
    setRevealedPasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Calculate Global Metrics
  const totalActiveJokis = jokis.filter(j => j.subscriptionStatus === "ACTIVE").length
  
  let globalRevenue = 0
  let globalSessions = 0
  
  jokis.forEach(j => {
    if (j.liveSessionsCreated) {
      globalSessions += j.liveSessionsCreated.length
      globalRevenue += j.liveSessionsCreated.reduce((acc: number, session: any) => acc + (session.totalRevenue || 0), 0)
    }
  })

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-black tracking-widest uppercase flex items-center gap-3 drop-shadow-md">
            <Crown className="w-8 h-8 text-warning" />
            Owner Dashboard
          </h1>
          <p className="text-muted mt-1">Sistem Manajemen Akun & Analitik Penjoki</p>
        </div>
      </div>

      {/* Global Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/60 border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="w-20 h-20" />
          </div>
          <CardContent className="p-6 relative z-10">
            <p className="text-sm font-bold text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-warning" /> Total Joki Aktif
            </p>
            <p className="text-4xl font-heading font-black text-white">{totalActiveJokis} <span className="text-lg text-muted font-normal">/ {jokis.length} Joki</span></p>
          </CardContent>
        </Card>

        <Card className="bg-black/60 border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="w-20 h-20" />
          </div>
          <CardContent className="p-6 relative z-10">
            <p className="text-sm font-bold text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-info" /> Total Sesi Streaming
            </p>
            <p className="text-4xl font-heading font-black text-white">{globalSessions} <span className="text-lg text-muted font-normal">Sesi</span></p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-dark/40 to-black/60 border border-red-bright/30 shadow-[0_0_30px_rgba(226,59,73,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="w-20 h-20" />
          </div>
          <CardContent className="p-6 relative z-10">
            <p className="text-sm font-bold text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-success" /> Omzet Keseluruhan
            </p>
            <p className="text-4xl font-heading font-black text-white drop-shadow-md">
              Rp {globalRevenue.toLocaleString('id-ID')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="bg-black/40 border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[200px]">Data Joki</TableHead>
              <TableHead className="text-center">Total Sesi</TableHead>
              <TableHead className="text-right">Total Pendapatan</TableHead>
              <TableHead className="text-center">Batas Langganan</TableHead>
              <TableHead className="text-right w-[350px]">Manajemen Akses</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jokis.map((j) => {
              const isExpired = j.subscriptionStatus === "EXPIRED" || (j.subscriptionEndsAt && new Date(j.subscriptionEndsAt) < new Date())
              const isBelumBayar = isExpired && !j.subscriptionEndsAt
              const endsAt = j.subscriptionEndsAt ? new Date(j.subscriptionEndsAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"
              
              const isWarning = !isExpired && j.subscriptionEndsAt && new Date(j.subscriptionEndsAt).getTime() < Date.now() + 7 * 24 * 60 * 60 * 1000
              const badgeVariant = isBelumBayar ? "destructive" : isExpired ? "destructive" : isWarning ? "warning" : "success"
              const badgeText = isBelumBayar ? "BELUM BAYAR" : isExpired ? "EXPIRED" : isWarning ? "WARNING" : "AKTIF"

              const jokiSessions = j.liveSessionsCreated?.length || 0
              const jokiRevenue = j.liveSessionsCreated?.reduce((acc: number, session: any) => acc + (session.totalRevenue || 0), 0) || 0

              const showPassword = revealedPasswords[j.id]

              return (
                <TableRow key={j.id} className={`group ${isExpired ? "bg-danger/5" : ""}`}>
                  <TableCell>
                    <div>
                      <div className="font-heading font-bold text-lg tracking-wider flex items-center gap-2">
                        {j.nickname}
                        <Badge variant={badgeVariant} className="font-bold tracking-widest text-[10px] px-1 py-0 h-4">
                          {badgeText}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted">
                        <Key className="w-3 h-3" />
                        {showPassword ? (
                          <span className="font-mono text-red-bright font-bold">{j.rawPassword || "TIDAK ADA"}</span>
                        ) : (
                          <span className="font-mono opacity-50">••••••••</span>
                        )}
                        <button onClick={() => togglePassword(j.id)} className="ml-2 hover:text-white underline decoration-dashed">
                          {showPassword ? "Sembunyikan" : "Intip Password"}
                        </button>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono">
                      {jokiSessions} Sesi
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <span className="font-bold text-success font-mono text-lg tracking-tight">
                      Rp {jokiRevenue.toLocaleString('id-ID')}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className={`text-sm font-medium ${isExpired ? "text-danger" : "text-muted"}`}>
                      {endsAt}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-[10px] px-2 h-7"
                        disabled={loadingId === j.id}
                        onClick={() => handleExtend(j.id, 1)}
                      >
                        +1 BLN
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-[10px] px-2 h-7"
                        disabled={loadingId === j.id}
                        onClick={() => handleExtend(j.id, 2)}
                      >
                        +2 BLN
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="text-[10px] px-2 h-7 border border-white/20"
                        disabled={loadingId === j.id}
                        onClick={() => handleExtendDays(j.id)}
                      >
                        + KUSTOM
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="text-xs h-7 ml-2"
                        disabled={loadingId === j.id || isExpired}
                        onClick={() => handleBlock(j.id)}
                        title="Blokir Akses Joki"
                      >
                        <PowerOff className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {jokis.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted">
                  Belum ada joki yang terdaftar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </Card>
    </div>
  )
}
