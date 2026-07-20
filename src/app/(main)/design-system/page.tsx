"use client"

import { motion, type Variants } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Flame, Shield, Target } from "lucide-react"

const staggerContainer: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    }
  }
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 }
  }
}

export default function DesignSystemPage() {
  return (
    <motion.div 
      className="max-w-5xl mx-auto space-y-12 pb-20 pt-8"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp} className="border-b border-red-bright/30 pb-6 mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-black text-white uppercase tracking-widest flex items-center gap-4">
          <Flame className="w-10 h-10 text-red-bright animate-pulse" />
          HUD Components
        </h1>
        <p className="text-muted mt-2 font-body text-lg">Koleksi komponen UI level turnamen untuk Joka Joki.</p>
      </motion.div>

      {/* Buttons */}
      <motion.section variants={fadeUp} className="space-y-6 bg-[#050505] p-8 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-bright/5 rounded-full blur-[50px] pointer-events-none" />
        <h2 className="text-2xl font-heading font-black text-red-bright border-b border-red-dark/30 pb-3 flex items-center gap-2 uppercase tracking-widest">
          <Target className="w-6 h-6" /> Buttons
        </h2>
        <div className="flex flex-wrap gap-6 items-center pt-4 relative z-10">
          <Button variant="default">Primary Execute</Button>
          <Button variant="secondary">Secondary Link</Button>
          <Button variant="destructive">Destructive Action</Button>
          <Button variant="outline">Outline Guard</Button>
          <Button variant="ghost">Ghost Stealth</Button>
        </div>
      </motion.section>

      {/* Badges */}
      <motion.section variants={fadeUp} className="space-y-6 bg-[#050505] p-8 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-bright/5 rounded-full blur-[50px] pointer-events-none" />
        <h2 className="text-2xl font-heading font-black text-red-bright border-b border-red-dark/30 pb-3 flex items-center gap-2 uppercase tracking-widest">
          <Shield className="w-6 h-6" /> Badges / Tags
        </h2>
        <div className="flex flex-wrap gap-6 pt-4 relative z-10 items-center">
          <Badge variant="default">VIP TIER</Badge>
          <Badge variant="secondary">REGULER</Badge>
          <Badge variant="destructive">BANNED</Badge>
          <Badge variant="outline">WAITING</Badge>
          <Badge variant="success">IN MATCH</Badge>
          <Badge variant="warning">PAUSED</Badge>
        </div>
      </motion.section>

      {/* Inputs */}
      <motion.section variants={fadeUp} className="space-y-6 bg-[#050505] p-8 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-bright/5 rounded-full blur-[50px] pointer-events-none" />
        <h2 className="text-2xl font-heading font-black text-red-bright border-b border-red-dark/30 pb-3 flex items-center gap-2 uppercase tracking-widest">
           Forms & Controls
        </h2>
        <div className="grid md:grid-cols-2 gap-8 pt-4 relative z-10">
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted uppercase tracking-widest">ID Pemain</label>
            <Input placeholder="Masukkan Nickname In-Game..." />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted uppercase tracking-widest">Tier Priority</label>
            <Select>
              <option>Viewer Reguler</option>
              <option>VIP Member</option>
              <option>Sultan (Fast Track)</option>
            </Select>
          </div>
          <div className="space-y-3 md:col-span-2">
            <label className="text-xs font-bold text-muted uppercase tracking-widest">Catatan Sistem (Disabled)</label>
            <Input placeholder="Hanya admin yang dapat mengedit ini" disabled />
          </div>
        </div>
      </motion.section>

      {/* Cards */}
      <motion.section variants={fadeUp} className="space-y-6 bg-[#050505] p-8 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-bright/5 rounded-full blur-[50px] pointer-events-none" />
        <h2 className="text-2xl font-heading font-black text-red-bright border-b border-red-dark/30 pb-3 flex items-center gap-2 uppercase tracking-widest">
           Panels (Cards)
        </h2>
        <div className="grid md:grid-cols-2 gap-8 pt-4 relative z-10">
          <Card>
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-red-bright">HUD Panel Base</CardTitle>
              <CardDescription>Komponen standar untuk membungkus data.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm font-light leading-relaxed">
                Kartu ini otomatis menggunakan border metalik (transparan dengan efek emboss bayangan dalam) dan sudut yang tajam (*clip-slanted* dihapus untuk layouting yang rapi, namun tetap menjaga kesan kotak kasar).
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 border-t border-white/5 pt-6 mt-2">
              <Button variant="ghost">Batal</Button>
              <Button>Eksekusi</Button>
            </CardFooter>
          </Card>
          
          <Card className="border-l-4 border-l-warning bg-gradient-to-br from-warning/10 to-transparent">
            <CardHeader>
              <CardTitle className="text-warning">Panel Peringatan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted">
                Kartu dapat dimodifikasi dengan border sebelah kiri untuk menandakan *state* seperti peringatan (warning) atau *success*.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.section>
    </motion.div>
  )
}
