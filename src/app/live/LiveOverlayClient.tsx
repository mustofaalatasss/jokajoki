"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getLiveState } from "./actions"
import { Crown, PlayCircle, Clock } from "lucide-react"

import { supabase } from "@/lib/supabase"

type LiveData = Awaited<ReturnType<typeof getLiveState>>
type PlayerType = NonNullable<LiveData["currentMatch"]>["players"][number]
type QueueType = LiveData["queues"][number]

function MatchTimer({ startedAt }: { startedAt: string | Date }) {
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
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [startedAt])

  return <span className="tabular-nums font-mono">{elapsed || "00:00"}</span>
}

export function LiveOverlayClient({ 
  initialData, 
  nickname 
}: { 
  initialData: LiveData,
  nickname: string
}) {
  const [data, setData] = React.useState<LiveData>(initialData)

  React.useEffect(() => {
    const fetchLatest = async () => {
      try {
        const freshData = await getLiveState(nickname)
        setData(freshData)
      } catch (err) {
        console.error("Fetch error:", err)
      }
    }

    const interval = setInterval(fetchLatest, 5000)

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
        },
        () => {
          fetchLatest()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const { currentMatch, queues, totalWaiting } = data

  return (
    <div className="w-full max-w-[400px] font-body bg-black/60 backdrop-blur-md border border-red-dark/30 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-red-dark via-red to-red-dark p-3 flex items-center justify-between border-b border-red-bright/50">
        <h2 className="text-white font-heading font-black tracking-widest text-lg uppercase drop-shadow-md">
          JOKA JOKI LIVE
        </h2>
        <div className="flex items-center gap-2 bg-black/40 px-2 py-1 rounded">
          <span className="w-2 h-2 bg-red-bright rounded-full animate-pulse" />
          <span className="text-xs font-bold text-white tracking-widest uppercase">Live</span>
        </div>
      </div>

      {/* CURRENT MATCH */}
      <div className="p-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(226,59,73,0.15)_0%,_transparent_70%)] pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-white">
            <PlayCircle className="w-4 h-4 text-red-bright animate-pulse" />
            <span className="font-heading font-bold text-sm tracking-wider uppercase">Match Berlangsung</span>
          </div>
          {currentMatch && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-bright bg-red-dark/20 px-2 py-1 rounded border border-red-bright/20">
              <Clock className="w-3 h-3" />
              <MatchTimer startedAt={currentMatch.startedAt!} />
            </div>
          )}
        </div>

        {currentMatch ? (
          <div className="space-y-2 relative z-10">
            {currentMatch.players.filter((p: PlayerType) => p.role !== "JOKI").map((player: PlayerType) => (
              <motion.div 
                key={player.id} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between bg-white/5 border border-white/10 rounded px-3 py-2"
              >
                <span className="font-bold text-white text-sm truncate">{player.nickname}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted bg-black/40 px-1.5 py-0.5 rounded">Playing</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 bg-white/5 border border-white/10 rounded border-dashed">
            <p className="text-muted text-xs font-bold uppercase tracking-wider">Menunggu Match Berikutnya</p>
          </div>
        )}
      </div>

      {/* UPCOMING QUEUE */}
      <div className="p-4 border-t border-white/5 bg-black/40">
        <div className="flex items-center justify-between mb-3">
          <span className="font-heading font-bold text-sm tracking-wider text-white uppercase">Antrean ({totalWaiting})</span>
          <span className="text-[10px] text-muted uppercase tracking-widest">Next 5</span>
        </div>

        <div className="space-y-1.5 relative min-h-[160px]">
          <AnimatePresence>
            {queues.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center text-muted text-xs font-bold uppercase tracking-widest opacity-50"
              >
                Antrean Kosong
              </motion.div>
            ) : (
              queues.slice(0, 5).map((q: QueueType, idx: number) => (
                <motion.div
                  key={q.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`flex items-center justify-between px-3 py-2 rounded border ${
                    q.type === "FAST_TRACK" 
                      ? "bg-gradient-to-r from-red-dark/40 to-transparent border-red-bright shadow-[inset_2px_0_0_rgba(226,59,73,1)]" 
                      : "bg-white/5 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`text-xs font-bold font-mono w-4 ${q.type === "FAST_TRACK" ? "text-red-bright" : "text-muted"}`}>
                      {idx + 1}.
                    </span>
                    <span className="font-bold text-white text-sm truncate flex items-center gap-1.5">
                      {q.user.nickname}
                      {q.type === "FAST_TRACK" && <Crown className="w-3.5 h-3.5 text-warning drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]" />}
                    </span>
                  </div>
                  {q.type === "FAST_TRACK" && (
                    <span className="text-[9px] font-bold text-warning uppercase tracking-wider bg-warning/10 px-1.5 rounded">Fast Track</span>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
