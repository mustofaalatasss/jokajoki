"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { NumberInput } from "@/components/ui/NumberInput"
import { addToQueue, searchCustomers } from "./actions"

export function AddQueueDialog({ open, onClose, jokiRole = "Jungler", isDemo, onDemoClick }: { open: boolean, onClose: () => void, jokiRole?: string, isDemo?: boolean, onDemoClick?: () => void }) {
  const [nickname, setNickname] = React.useState("")
  const [type, setType] = React.useState<"REGULAR" | "FAST_TRACK">("REGULAR")
  const defaultRole = "Mid Laner" !== jokiRole ? "Mid Laner" : "Roamer"
  const [role, setRole] = React.useState(defaultRole)
  const [rank, setRank] = React.useState("Mythic")
  const [matchesPurchased, setMatchesPurchased] = React.useState<number>(1)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [warningMsg, setWarningMsg] = React.useState("")

  const [suggestions, setSuggestions] = React.useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = React.useState(false)

  React.useEffect(() => {
    if (!open) {
      setNickname("")
      setType("REGULAR")
      setRole("Mid Laner" !== jokiRole ? "Mid Laner" : "Roamer")
      setRank("Mythic")
      setMatchesPurchased(1)
      setError("")
      setWarningMsg("")
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [open])

  React.useEffect(() => {
    if (isDemo) return
    if (nickname.length >= 2) {
      const delayFn = setTimeout(async () => {
        const res = await searchCustomers(nickname)
        setSuggestions(res)
      }, 300)
      return () => clearTimeout(delayFn)
    } else {
      setSuggestions([])
    }
  }, [nickname])

  function handleSelectSuggestion(customer: any) {
    if (customer.isBlacklisted) {
      setError(`Di-blacklist: ${customer.blacklistReason || "Melanggar aturan"}`)
      setNickname(customer.mlNickname)
      setShowSuggestions(false)
      return
    }
    setError("")
    setNickname(customer.mlNickname)
    if (customer.currentRank) setRank(customer.currentRank)
    if (customer.primaryRole) setRole(customer.primaryRole)
    setShowSuggestions(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nickname.trim()) {
      setError("Nickname tidak boleh kosong!")
      return
    }
    if (isDemo && onDemoClick) {
      onDemoClick()
      return
    }
    setLoading(true)
    setError("")
    
    const parsedMatches = matchesPurchased || 1
    const result = await addToQueue(nickname.trim(), type, role, parsedMatches, warningMsg !== "", rank)
    setLoading(false)
    
    if (result.error) {
      setError(result.error)
    } else if (result.requiresConfirmation && result.message) {
      setWarningMsg(result.message)
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-surface border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white font-heading font-black tracking-widest uppercase">
            Tambah Antrean Pelanggan
          </DialogTitle>
          <DialogDescription>
            Masukkan detail pelanggan untuk ditambahkan ke daftar antrean live.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="p-3 bg-danger/20 border border-danger/50 text-danger text-sm font-bold rounded">
              {error}
            </div>
          )}
          {warningMsg && (
            <div className="p-3 bg-warning/20 border border-warning/50 text-warning text-sm font-bold rounded">
              {warningMsg}
            </div>
          )}

          <div className="space-y-2 relative">
            <label className="text-xs font-bold text-muted uppercase tracking-widest">Nickname In-Game</label>
            <Input 
              placeholder="Contoh: FakerIndo" 
              value={nickname} 
              onChange={(e) => { setNickname(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="bg-black/50 border-white/10"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1c] border border-white/10 rounded-md shadow-xl overflow-hidden z-50">
                {suggestions.map((c, i) => (
                  <div 
                    key={i} 
                    onClick={() => handleSelectSuggestion(c)}
                    className="p-3 hover:bg-white/5 cursor-pointer flex justify-between items-center border-b border-white/5 last:border-0 text-sm"
                  >
                    <span className={`font-bold truncate ${c.isBlacklisted ? 'text-danger line-through' : 'text-white'}`}>{c.mlNickname}</span>
                    {!c.isBlacklisted && <span className="text-xs text-muted ml-2">{c.currentRank} • {c.primaryRole}</span>}
                    {c.isBlacklisted && <span className="text-[10px] font-bold text-danger bg-danger/20 px-2 py-0.5 rounded ml-2">BLACKLISTED</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase tracking-widest">Tipe Layanan</label>
              <Select 
                value={type} 
                onChange={(e) => { setType(e.target.value as "REGULAR" | "FAST_TRACK"); setWarningMsg(""); }}
                className="bg-black/50 border-white/10"
              >
                <option value="REGULAR">Reguler</option>
                <option value="FAST_TRACK">Fast Track</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase tracking-widest">Role Favorit</label>
              <Select 
                value={role} 
                onChange={(e) => { setRole(e.target.value); setWarningMsg(""); }}
                className="bg-black/50 border-white/10"
              >
                {jokiRole !== "Mid Laner" && <option value="Mid Laner">Mid Laner</option>}
                {jokiRole !== "Roamer" && <option value="Roamer">Roamer</option>}
                {jokiRole !== "Gold Laner" && <option value="Gold Laner">Gold Laner</option>}
                {jokiRole !== "Jungler" && <option value="Jungler">Jungler</option>}
                {jokiRole !== "Exp Laner" && <option value="Exp Laner">Exp Laner</option>}
                {jokiRole !== "Flex" && <option value="Flex">Flex</option>}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase tracking-widest">Rank</label>
              <Select 
                value={rank} 
                onChange={(e) => setRank(e.target.value)}
                className="bg-black/50 border-white/10"
              >
                <option value="Epic">Epic</option>
                <option value="Legend">Legend</option>
                <option value="Mythic">Mythic</option>
                <option value="Mythical Honor">Honor</option>
                <option value="Mythical Glory">Glory</option>
                <option value="Mythical Immortal">Immortal</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase tracking-widest">Jumlah Match</label>
              <NumberInput 
                min={1} 
                max={10} 
                value={matchesPurchased} 
                onChange={setMatchesPurchased}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            {!warningMsg ? (
              <Button type="submit" disabled={loading} className="bg-red-bright hover:bg-red-bright/90 text-white font-bold tracking-widest uppercase">
                {loading ? "Menyimpan..." : "Tambahkan"}
              </Button>
            ) : (
              <Button type="submit" disabled={loading} className="bg-warning hover:bg-warning/90 text-black font-bold tracking-widest uppercase">
                {loading ? "Memproses..." : "Paksa Masuk"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
