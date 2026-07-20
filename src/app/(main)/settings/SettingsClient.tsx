"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Settings, Shield, Clock, Users, Save, Crown } from "lucide-react"
import { updateSettings } from "./actions"

export default function SettingsClient({ initialJokiName, initialJokiRole, initialRateCard, initialRateCardFT }: { initialJokiName: string, initialJokiRole: string, initialRateCard: number, initialRateCardFT: number }) {
  const router = useRouter()
  const [jokiName, setJokiName] = React.useState(initialJokiName)
  const [jokiRole, setJokiRole] = React.useState(initialJokiRole)
  const [rateCard, setRateCard] = React.useState(initialRateCard.toString())
  const [rateCardFT, setRateCardFT] = React.useState(initialRateCardFT.toString())
  const [matchDuration, setMatchDuration] = React.useState("15")
  const [maxQueue, setMaxQueue] = React.useState("50")
  const [saved, setSaved] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  async function handleSave() {
    setLoading(true)
    try {
      await updateSettings(jokiName, jokiRole, parseInt(rateCard) || 10000, parseInt(rateCardFT) || 15000)
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-heading font-black text-white uppercase tracking-widest flex items-center gap-3">
          <Settings className="w-8 h-8 text-red-bright" />
          Pengaturan
        </h1>
        <p className="text-muted mt-1 font-body">Konfigurasi sesi live, identitas joki, dan batasan antrean.</p>
      </div>

      {/* Joki Identity */}
      <Card>
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-bright" /> Identitas Joki
          </CardTitle>
          <CardDescription>Nama yang ditampilkan sebagai Host/Joki di panel match.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted uppercase tracking-widest">Nama Joki / Host</label>
            <Input
              value={jokiName}
              onChange={(e) => setJokiName(e.target.value)}
              placeholder="Masukkan nama joki..."
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted uppercase tracking-widest">Role Utama Joki</label>
            <select
              value={jokiRole}
              onChange={(e) => setJokiRole(e.target.value)}
              className="w-full h-10 px-3 bg-black/50 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-red-bright/50"
            >
              <option value="Mid Laner">Mid Laner</option>
              <option value="Roamer">Roamer</option>
              <option value="Gold Laner">Gold Laner</option>
              <option value="Jungler">Jungler</option>
              <option value="Exp Laner">Exp Laner</option>
              <option value="Flex">Flex (Bisa Semua)</option>
            </select>
            <p className="text-[10px] text-muted">Role ini tidak akan muncul sebagai pilihan di formulir penambahan pelanggan.</p>
          </div>
        </CardContent>
      </Card>

      {/* Rate Card */}
      <Card>
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-warning" /> Rate Card
          </CardTitle>
          <CardDescription>Harga per match per pelanggan. Digunakan untuk menghitung pendapatan di rekapan sesi.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-xs font-bold text-muted uppercase tracking-widest">Harga Reguler (per match)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">Rp</span>
                <Input
                  type="number"
                  value={rateCard}
                  onChange={(e) => setRateCard(e.target.value)}
                  placeholder="10000"
                  className="pl-12"
                />
              </div>
              <p className="text-[10px] text-muted">Contoh: 10.000 = Rp10K per match per orang</p>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-warning uppercase tracking-widest">Harga Fast Track (per match)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warning text-sm">Rp</span>
                <Input
                  type="number"
                  value={rateCardFT}
                  onChange={(e) => setRateCardFT(e.target.value)}
                  placeholder="15000"
                  className="pl-12"
                />
              </div>
              <p className="text-[10px] text-muted">Harga untuk pelanggan Fast Track (biasanya lebih mahal)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Match Settings */}
      <Card>
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" /> Pengaturan Match
          </CardTitle>
          <CardDescription>Konfigurasi durasi default dan parameter match.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted uppercase tracking-widest">Estimasi Durasi per Match (menit)</label>
            <Input
              type="number"
              value={matchDuration}
              onChange={(e) => setMatchDuration(e.target.value)}
              placeholder="15"
            />
          </div>
        </CardContent>
      </Card>

      {/* Queue Settings */}
      <Card>
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" /> Pengaturan Antrean
          </CardTitle>
          <CardDescription>Batasan kapasitas antrean dan pengelolaan sesi.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted uppercase tracking-widest">Kapasitas Antrean Maksimal</label>
            <Input
              type="number"
              value={maxQueue}
              onChange={(e) => setMaxQueue(e.target.value)}
              placeholder="50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="min-w-[200px]" disabled={loading}>
          <Save className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? "Menyimpan..." : saved ? "✓ Tersimpan!" : "Simpan Pengaturan"}
        </Button>
      </div>
    </div>
  )
}
