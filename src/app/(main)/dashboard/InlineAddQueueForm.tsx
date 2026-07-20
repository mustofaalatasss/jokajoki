"use client"

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { NumberInput } from "@/components/ui/NumberInput"
import { addToQueue, searchCustomers } from "./actions"
import { Plus, User, Crown, Shield, Gamepad2 } from "lucide-react"

export function InlineAddQueueForm({ onAdded, jokiRole = "Jungler" }: { onAdded?: () => void, jokiRole?: string }) {
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

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!nickname.trim()) {
      setError("Nickname tidak boleh kosong!")
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
      setRole(defaultRole)
      setRank("Mythic")
      setMatchesPurchased(1)
      setNickname("")
      setType("REGULAR")
      setWarningMsg("")
      if (onAdded) onAdded()
    }
  }

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-lg p-4 mb-6 shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-wrap md:flex-nowrap items-end gap-4">
        {/* Nickname */}
        <div className="flex-1 min-w-[200px] relative">
          <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1 flex items-center gap-1">
            <User className="w-3 h-3" /> Nickname
          </label>
          <Input
            placeholder="Ketik nama..."
            value={nickname}
            onChange={(e) => { setNickname(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="h-10 text-sm bg-[var(--input-bg)]"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--surface-1)] border border-[var(--border-default)] rounded-md shadow-xl overflow-hidden z-50">
              {suggestions.map((c, i) => (
                <div 
                  key={i} 
                  onClick={() => handleSelectSuggestion(c)}
                  className="p-2 hover:bg-[var(--surface-hover)] cursor-pointer flex justify-between items-center border-b border-[var(--border-default)] last:border-0 text-sm"
                >
                  <span className={`font-bold truncate ${c.isBlacklisted ? 'text-[var(--danger)] line-through' : 'text-[var(--text-primary)]'}`}>{c.mlNickname}</span>
                  {!c.isBlacklisted && <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap ml-2">{c.currentRank} • {c.primaryRole}</span>}
                  {c.isBlacklisted && <span className="text-[10px] font-bold text-[var(--danger)] bg-[var(--danger)]/20 px-2 py-0.5 rounded ml-2">BLACKLISTED</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Type */}
        <div className="w-full md:w-32">
          <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1 flex items-center gap-1">
            <Crown className="w-3 h-3" /> Tipe
          </label>
          <Select
            value={type}
            onChange={(e) => { setType(e.target.value as "REGULAR" | "FAST_TRACK"); setWarningMsg(""); }}
            className="h-10 text-sm bg-[var(--surface-2)]"
          >
            <option value="REGULAR">Reguler</option>
            <option value="FAST_TRACK">Fast Track</option>
          </Select>
        </div>

        {/* Role */}
        <div className="w-full md:w-32">
          <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Role
          </label>
          <Select
            value={role}
            onChange={(e) => { setRole(e.target.value); setWarningMsg(""); }}
            className="h-10 text-sm bg-[var(--surface-2)]"
          >
            {jokiRole !== "Mid Laner" && <option value="Mid Laner">Mid Laner</option>}
            {jokiRole !== "Roamer" && <option value="Roamer">Roamer</option>}
            {jokiRole !== "Gold Laner" && <option value="Gold Laner">Gold Laner</option>}
            {jokiRole !== "Jungler" && <option value="Jungler">Jungler</option>}
            {jokiRole !== "Exp Laner" && <option value="Exp Laner">Exp Laner</option>}
            {jokiRole !== "Flex" && <option value="Flex">Flex</option>}
          </Select>
        </div>

        {/* Rank */}
        <div className="w-full md:w-40">
          <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1 flex items-center gap-1">
            <Crown className="w-3 h-3" /> Rank
          </label>
          <Select value={rank} onChange={(e) => setRank(e.target.value)} className="h-10 text-sm bg-[var(--surface-2)]">
            <option value="Epic">Epic</option>
            <option value="Legend">Legend</option>
            <option value="Mythic">Mythic</option>
            <option value="Mythical Honor">Honor</option>
            <option value="Mythical Glory">Glory</option>
            <option value="Mythical Immortal">Immortal</option>
          </Select>
        </div>

        {/* Matches */}
        <div className="w-32">
          <label className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1 flex items-center gap-1">
            <Gamepad2 className="w-3 h-3" /> Match
          </label>
          <NumberInput 
            min={1} 
            max={10} 
            value={matchesPurchased} 
            onChange={setMatchesPurchased}
            className="bg-[var(--surface-2)]"
          />
        </div>

        {/* Submit */}
        <div className="w-full md:w-auto mt-4 md:mt-0">
          {!warningMsg ? (
            <Button type="submit" disabled={loading} className="h-10 w-full md:w-auto px-6 font-bold uppercase tracking-widest text-xs">
              <Plus className="w-4 h-4 mr-2" /> {loading ? "..." : "Tambah"}
            </Button>
          ) : (
            <div className="flex gap-2">
               <Button type="button" variant="destructive" className="h-10 w-full md:w-auto px-4 font-bold text-xs" onClick={() => setWarningMsg("")}>Batal</Button>
               <Button type="submit" className="h-10 w-full md:w-auto px-4 bg-warning hover:bg-warning/90 text-black font-bold text-xs">Paksa Masuk</Button>
            </div>
          )}
        </div>
      </form>
      
      {/* Messages */}
      {error && <div className="mt-3 p-2 bg-danger/20 border border-danger/50 text-danger text-xs font-bold rounded">{error}</div>}
      {warningMsg && <div className="mt-3 p-2 bg-warning/20 border border-warning/50 text-warning text-xs font-bold rounded">{warningMsg}</div>}
    </div>
  )
}
