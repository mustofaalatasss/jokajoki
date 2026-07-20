"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform, type Variants } from "framer-motion"
import { useTransition } from "react"
import { Button } from "@/components/ui/Button"
import { Flame, Shield, Zap, Target, Crosshair, ChevronRight, ChevronDown, MessageSquareWarning, CheckCircle2, Crown, ShieldCheck } from "lucide-react"

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const { scrollYProgress } = useScroll()
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const [isPending, startTransition] = useTransition()

  // Animation variants
  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 15 }
    }
  }

  const zoomIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 50, damping: 20 }
    }
  }

  return (
    <div className="min-h-screen bg-[#020202] text-text-main flex flex-col relative overflow-hidden font-body selection:bg-red-bright/30">
      
      {/* --- PARALLAX EXTREME BACKGROUND EFFECTS --- */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 pointer-events-none z-0">
        
        {/* Deep Red Core Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] bg-[radial-gradient(ellipse_at_center,_rgba(226,59,73,0.12)_0%,_rgba(127,23,36,0.03)_40%,_transparent_70%)] mix-blend-screen" />
        
        {/* Grid & Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(226,59,73,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(226,59,73,0.08)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_30%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.5)_50%,transparent_50%)] bg-[size:100%_4px] opacity-30" />

        {/* Floating Animated Sparks (Simulated Particles) */}
        <motion.div 
          animate={{ y: [0, -100, 0], opacity: [0, 1, 0], scale: [1, 1.5, 1] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] left-[15%] w-1.5 h-1.5 bg-red-bright rounded-full blur-[1px]" 
        />
        <motion.div 
          animate={{ y: [0, -150, 0], opacity: [0, 0.8, 0], x: [0, 50, 0] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[60%] right-[20%] w-2 h-2 bg-warning rounded-full blur-[1px]" 
        />
        <motion.div 
          animate={{ y: [0, -80, 0], opacity: [0, 0.9, 0], scale: [1, 2, 1] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          className="absolute bottom-[20%] left-[30%] w-1.5 h-1.5 bg-red-bright rounded-full blur-[1px]" 
        />
      </motion.div>


      {/* --- HERO SECTION --- */}
      <motion.main 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="min-h-screen flex flex-col items-center justify-center relative z-20 px-4 pt-12 pb-16"
      >
        {/* MLBB Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[-1] opacity-[0.05]">
          <img src="/brand/hero-bg.png?v=5" alt="Background" className="w-[140%] max-w-none object-contain" />
        </div>
        
        {/* Massive Floating Logo */}
        <motion.div variants={zoomIn} className="relative mb-4 group">
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-red-bright/40 blur-[80px] rounded-full" 
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image 
              src="/brand/joka-joki-logo-diedit.png" 
              alt="Joka Joki Logo" 
              width={500} 
              height={500} 
              priority
              className="w-48 sm:w-64 md:w-[22rem] object-contain relative z-10 drop-shadow-[0_0_50px_rgba(226,59,73,0.8)] filter brightness-110 contrast-125"
            />
          </motion.div>
        </motion.div>

        {/* Title */}
        <div className="text-center space-y-4 max-w-5xl mx-auto flex flex-col items-center">
          <motion.div variants={fadeUp} className="clip-slanted bg-red-dark/30 border-l-2 border-r-2 border-red-bright text-red-bright text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] px-6 py-2 flex items-center gap-3 backdrop-blur-sm shadow-[0_0_20px_rgba(226,59,73,0.3)]">
            <span className="w-2 h-2 bg-red-bright animate-pulse" />
            Sistem Mabar VIP Live
            <span className="w-2 h-2 bg-red-bright animate-pulse" />
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="glitch text-5xl sm:text-7xl md:text-8xl font-heading font-black text-white uppercase tracking-tighter leading-[0.85] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] z-10" data-text="DOMINASI ARENA">
            DOMINASI ARENA
          </motion.h1>
          <motion.h2 variants={fadeUp} className="text-lg sm:text-xl md:text-2xl font-heading font-bold text-red-bright uppercase tracking-[0.4em] mt-2 filter drop-shadow-[0_0_10px_rgba(226,59,73,0.5)]">
            Manajemen Squad & Antrean
          </motion.h2>
        </div>

        {/* Description */}
        <motion.p variants={fadeUp} className="mt-6 text-sm sm:text-base md:text-lg text-muted max-w-3xl text-center leading-relaxed font-light relative z-10">
          Sistem manajemen mabar cerdas untuk Streamer dan Joki profesional. Atur antrean pemain dengan rapi, prioritaskan pesanan <strong className="text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">Fast Track</strong> secara instan, dan kelola rotasi squad Anda dengan mudah dan efisien.
        </motion.p>
        
        {/* Actions */}
        <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-2xl">
          <Link href="/dashboard" className="w-full sm:w-auto relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-red-bright via-red to-red-dark blur-lg opacity-60 group-hover:opacity-100 transition duration-500" />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="clip-slanted relative w-full sm:w-auto h-14 px-10 text-lg uppercase tracking-[0.2em] font-heading font-black bg-[#050505] hover:bg-[#101216] border border-red-bright/50 text-text-main flex items-center justify-center gap-3">
                Masuk Dashboard <Flame className="w-5 h-5 text-red-bright animate-pulse" />
              </Button>
            </motion.div>
          </Link>
          
          <div className="w-full sm:w-auto">
            <Link href="/demo">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="clip-slanted w-full sm:w-auto h-14 px-8 text-base uppercase tracking-widest font-heading font-bold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-bright/50 text-muted hover:text-white transition-all backdrop-blur-md"
                >
                  <Target className="w-4 h-4 mr-2" />
                  COBA DASHBOARD
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </motion.main>

      {/* --- FEATURES GRID (Esports Metallic Cards) --- */}
      <section className="relative z-20 py-24 px-4 bg-[#050505]">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-bright to-transparent opacity-40 shadow-[0_0_20px_rgba(226,59,73,1)]" />
        
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="container mx-auto max-w-7xl"
        >
          <motion.div variants={fadeUp} className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-heading font-black text-white uppercase tracking-wider">
              Fitur <span className="text-red-bright">Keunggulan</span>
            </h2>
            <div className="w-24 h-1 bg-red-bright mx-auto mt-6 shadow-[0_0_15px_rgba(226,59,73,0.8)]" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <motion.div variants={fadeUp} whileHover={{ y: -10 }} className="metallic-border p-8 relative overflow-hidden group transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-bright/20 rounded-full blur-[50px] -mr-10 -mt-10 group-hover:bg-red-bright/50 transition-colors duration-500" />
              
              <motion.div 
                whileHover={{ rotate: 90 }} 
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="clip-hex w-16 h-16 bg-[var(--card-bg)] border border-[var(--red-bright)]/30 flex items-center justify-center mb-8 text-red-bright shadow-[0_0_15px_var(--shadow-color)]"
              >
                <Zap className="w-7 h-7" />
              </motion.div>
              
              <h3 className="text-2xl font-heading font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                Fast Track <ChevronRight className="w-5 h-5 text-red-bright opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </h3>
              <p className="text-muted leading-relaxed font-body">Eksekusi pergantian pemain instan untuk donatur VIP. Sistem akan menjeda antrean reguler secara otomatis tanpa mengorbankan hak match mereka.</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={fadeUp} whileHover={{ y: -10 }} className="metallic-border p-8 relative overflow-hidden group transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-bright/20 rounded-full blur-[50px] -mr-10 -mt-10 group-hover:bg-red-bright/50 transition-colors duration-500" />
              
              <motion.div 
                whileHover={{ rotate: 90 }} 
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="clip-hex w-16 h-16 bg-[var(--card-bg)] border border-[var(--red-bright)]/30 flex items-center justify-center mb-8 text-red-bright shadow-[0_0_15px_var(--shadow-color)]"
              >
                <Shield className="w-7 h-7" />
              </motion.div>
              
              <h3 className="text-2xl font-heading font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                Rotasi Adil <ChevronRight className="w-5 h-5 text-red-bright opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </h3>
              <p className="text-muted leading-relaxed font-body">Katakan selamat tinggal pada antrean berantakan. Sistem mencatat urutan masuk secara real-time, memberi kepastian pada setiap pemain yang antre.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={fadeUp} whileHover={{ y: -10 }} className="metallic-border p-8 relative overflow-hidden group transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-bright/20 rounded-full blur-[50px] -mr-10 -mt-10 group-hover:bg-red-bright/50 transition-colors duration-500" />
              
              <motion.div 
                whileHover={{ rotate: 90 }} 
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="clip-hex w-16 h-16 bg-[var(--card-bg)] border border-[var(--red-bright)]/30 flex items-center justify-center mb-8 text-red-bright shadow-[0_0_15px_var(--shadow-color)]"
              >
                <Crosshair className="w-7 h-7" />
              </motion.div>
              
              <h3 className="text-2xl font-heading font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                UI Turnamen <ChevronRight className="w-5 h-5 text-red-bright opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </h3>
              <p className="text-muted leading-relaxed font-body">Dirancang dengan standar visual kompetisi esports kelas dunia. Kontras tinggi, sudut tajam, dan elemen bercahaya yang memacu adrenalin.</p>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* --- INFO SECTIONS (Why Joka Joki & Tier System) --- */}
      <section className="relative z-20 py-24 px-4 bg-[var(--card-bg)] border-t border-[var(--red-dark)]/30">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="container mx-auto max-w-5xl"
        >
          {/* Kenapa Joka Joki? */}
          <div className="flex flex-col md:flex-row items-center gap-12 mb-32">
            <motion.div variants={fadeUp} className="flex-1 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-widest">
                STREAMING <span className="text-red-bright">TANPA BEBAN</span>
              </h2>
              <p className="text-muted leading-relaxed text-lg font-light">
                Tinggalkan kebiasaan usang mencatat antrean secara manual yang bikin pusing. Dengan Joka Joki, Anda cukup fokus bermain dan menghibur penonton dengan mekanik terbaik Anda.
              </p>
              <p className="text-muted leading-relaxed text-lg font-light">
                Sistem kami akan <strong className="text-white">otomatis mencatat</strong> siapa yang sudah mendaftar, giliran siapa yang akan masuk room, dan kapan harus melakukan rotasi pemain. Semuanya terorganisir rapi dalam satu layar cerdas!
              </p>
            </motion.div>
            <motion.div variants={zoomIn} className="flex-1 relative w-full">
              <div className="absolute inset-0 bg-red-bright/20 blur-[60px] rounded-full" />
              <div className="metallic-border p-6 rounded-2xl relative z-10 bg-[#050505] transform perspective-[1000px] rotate-y-[-5deg] hover:rotate-y-0 transition-transform duration-700">
                <div className="flex flex-col gap-4">
                  {/* Before */}
                  <motion.div 
                    whileHover={{ scale: 0.98 }}
                    className="p-4 rounded-xl border border-dashed border-red-bright/30 bg-red-950/10 opacity-60"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <MessageSquareWarning className="w-5 h-5 text-red-500 animate-pulse" />
                      <span className="text-red-500 font-bold text-sm uppercase tracking-widest">Cara Lama (Pusing)</span>
                    </div>
                    <p className="text-xs text-muted">Spam chat penonton "Bang gue kapan main?", nyatat antrean di Notepad, kelupaan urutan, durasi live habis cuma buat ngurusin lobby.</p>
                  </motion.div>
                  {/* After */}
                  <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    whileHover={{ scale: 1.02 }}
                    className="p-5 rounded-xl border border-red-bright/50 bg-surface-2 shadow-[0_0_20px_rgba(226,59,73,0.15)] relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-bright/10 blur-[20px] rounded-full" />
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }} 
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      </motion.div>
                      <span className="text-white font-bold text-base uppercase tracking-widest drop-shadow-md">Dengan Joka Joki</span>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-300 relative z-10">
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-red-bright rounded-full shadow-[0_0_5px_#e23b49] animate-ping"/> Antrean tercatat rapi & serba otomatis</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-red-bright rounded-full shadow-[0_0_5px_#e23b49]"/> Sistem Notifikasi pergantian pemain</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-red-bright rounded-full shadow-[0_0_5px_#e23b49]"/> Rekapan pendapatan harian sekali klik</li>
                    </ul>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sistem Tier */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <motion.div variants={fadeUp} className="flex-1 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-widest">
                JALUR <span className="text-red-bright">FAST TRACK</span> & REGULER
              </h2>
              <p className="text-muted leading-relaxed text-lg font-light">
                Beri perlakuan istimewa untuk pelanggan Mabar VIP Anda tanpa harus mengorbankan hak pemain reguler yang sudah sabar mengantre.
              </p>
              <ul className="space-y-5 mt-6">
                <li className="flex items-start gap-4">
                  <div className="bg-red-bright/20 p-2 rounded-lg border border-red-bright/50 shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-red-bright/40 blur-md animate-pulse" />
                    <Crown className="w-6 h-6 text-red-bright relative z-10" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Prioritas VIP (Fast Track)</h4>
                    <p className="text-muted text-sm mt-1">Sistem otomatis meletakkan orderan Fast Track di urutan teratas untuk match selanjutnya. Anti ribet geser-geser secara manual.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-surface-2 p-2 rounded-lg border border-white/10 shrink-0 transition-colors hover:bg-surface-3">
                    <ShieldCheck className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Reguler Dijamin Aman</h4>
                    <p className="text-muted text-sm mt-1">Antrean reguler akan otomatis digeser ke bawah dengan aman. Hak match mereka hanya di-jeda sementara dan tidak akan pernah hangus!</p>
                  </div>
                </li>
              </ul>
            </motion.div>
            <motion.div variants={zoomIn} className="flex-1 relative w-full">
              <div className="absolute inset-0 bg-red-bright/20 blur-[60px] rounded-full" />
              <div className="metallic-border p-6 rounded-2xl relative z-10 flex flex-col gap-4 bg-[#050505] transform hover:-translate-y-2 transition-transform duration-500">
                {/* Mock Queue UI */}
                <motion.div 
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="bg-gradient-to-r from-red-950/40 to-surface-2 p-4 rounded-xl border border-red-bright/50 flex justify-between items-center shadow-[0_0_20px_rgba(226,59,73,0.3)] cursor-default relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-bright shadow-[0_0_10px_#e23b49]" />
                  <div className="flex items-center gap-4 pl-2">
                    <div className="w-10 h-10 bg-red-bright/20 rounded-full flex items-center justify-center border border-red-bright/50 relative">
                      <div className="absolute inset-0 rounded-full border-2 border-red-bright animate-ping opacity-20" />
                      <Crown className="w-5 h-5 text-red-bright drop-shadow-[0_0_5px_#e23b49]" />
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-lg">SultanMabar99</h5>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-red-bright text-white px-2 py-0.5 rounded-sm animate-pulse shadow-[0_0_5px_#e23b49]">Fast Track</span>
                        <span className="text-xs text-muted">Role: Jungler</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-red-bright font-bold text-xl drop-shadow-[0_0_5px_rgba(226,59,73,0.8)]">#1</span>
                </motion.div>
                
                <motion.div 
                  className="bg-surface-1 p-4 rounded-xl border border-white/5 flex justify-between items-center opacity-80 cursor-default hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface-3 rounded-full flex items-center justify-center border border-white/10">
                      <span className="text-muted font-bold">2</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-300">PlayerSatu</h5>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-surface-3 text-muted px-2 py-0.5 rounded-sm">Reguler</span>
                        <span className="text-xs text-warning animate-pulse">Di-jeda Sementara</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-500 font-bold text-lg">#2</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="relative z-20 py-24 px-4 bg-[#050505] border-t border-[var(--red-dark)]/30">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="container mx-auto max-w-5xl"
        >
          <div className="text-center mb-16">
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-heading font-black text-white uppercase tracking-widest mb-4">
              PERTANYAAN <span className="text-red-bright">SERING DIAJUKAN</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted text-lg font-light max-w-2xl mx-auto">
              Semua yang perlu Anda ketahui tentang revolusi manajemen mabar bersama Joka Joki.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "Apa itu Joka Joki?",
                a: "Joka Joki adalah panel eksklusif kelas turnamen yang dirancang khusus untuk Streamer dan Joki Mobile Legends. Kami menyulap kekacauan 'spam chat' penonton menjadi sistem rotasi mabar otomatis yang mulus. Dilengkapi fitur manajemen Role (Jungler, Roamer, dll), prioritas antrean VIP (Fast Track), hingga rekapan pendapatan sesi secara real-time. Anda cukup fokus pamer mekanik in-game, biarkan sistem cerdas kami yang mengurus siapa yang berhak masuk room selanjutnya!"
              },
              {
                q: "Bagaimana cara kerja fitur Fast Track?",
                a: "Fast Track adalah jalur prioritas bagi pelanggan (Mabar VIP) yang tidak ingin menunggu lama. Saat Anda memasukkan pemain ke jalur Fast Track, sistem akan langsung menempatkan mereka di urutan teratas untuk match selanjutnya. Antrean pemain reguler akan otomatis bergeser dengan aman tanpa menghilangkan jatah bermain mereka."
              },
              {
                q: "Apakah pelanggan reguler dirugikan karena Fast Track?",
                a: "Tidak sama sekali! Jika VIP masuk, hak match milik Reguler hanya 'di-pause' (jeda) sementara. Jatah match mereka aman dan akan dilanjutkan setelahnya."
              },
              {
                q: "Apakah platform ini aman dari hack?",
                a: "Sangat aman! Kami sama sekali tidak meminta password, email, atau data login Mobile Legends Anda maupun pelanggan Anda. Selain itu, web ini dibekali keamanan siber tingkat tinggi: dilindungi enkripsi TLS 1.3, otentikasi JWT anti-XSS/CSRF, serta database terisolasi dengan Row-Level Security (RLS). Akun game Anda 100% aman dan data web Anda kebal dari serangan."
              },
              {
                q: "Saya Streamer pemula, haruskah pakai ini?",
                a: "Tentu! Membangun sistem mabar yang terlihat profesional sejak dini akan meningkatkan trust (kepercayaan) audiens dan memotivasi mereka untuk ikut berdonasi."
              },
              {
                q: "Apakah saya bisa atur role tiap pemain?",
                a: "Bisa! Sistem mendukung role lengkap (Jungler, Roamer, Mid, Gold, Exp) agar komposisi draft pick tim mabar Anda selalu seimbang dan teratur."
              },
              {
                q: "Bagaimana cara melacak pendapatan saya?",
                a: "Kami menyediakan fitur 'Tutup Sesi'. Setiap sesi selesai, sistem otomatis menghitung total win/lose, pelanggan unik, dan merekap total pendapatan Anda hari itu."
              },
              {
                q: "Bisakah harga mabar diubah sesuai keinginan?",
                a: "Tentu saja. Anda memiliki akses penuh ke menu Pengaturan untuk memasang harga Rate Card Reguler dan Fast Track Anda sendiri secara kustom."
              },
              {
                q: "Apa yang terjadi kalau antrean belum habis tapi saya tutup live?",
                a: "Jangan khawatir! Antrean yang tersisa (termasuk status aktif) otomatis akan terbawa (Carry Over) ke sesi live Anda berikutnya dengan rapi."
              },
              {
                q: "Bagaimana jika ada pemain Fast Track berebut role yang sama?",
                a: "Tidak perlu pusing! Sistem kami memiliki antrean cerdas. Jika ada dua pelanggan Fast Track yang sama-sama ingin role 'Jungler', pelanggan yang order lebih dulu akan masuk ke match terdekat, sedangkan yang kedua akan otomatis ditaruh di urutan paling atas untuk match berikutnya. Semua teratur otomatis tanpa drama rebutan role!"
              }
            ].map((faq, i) => {
              const isActive = activeFaq === i
              return (
                <motion.div 
                  key={i} 
                  variants={fadeUp} 
                  className={`metallic-border rounded-xl cursor-pointer transition-all duration-300 ${isActive ? 'bg-surface-2 border-red-bright/50 shadow-[0_0_15px_rgba(226,59,73,0.2)]' : 'bg-surface-1 hover:bg-surface-2/80'}`}
                  onClick={() => setActiveFaq(isActive ? null : i)}
                >
                  <div className="p-6 flex items-center justify-between gap-4">
                    <h4 className={`font-bold transition-colors ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'} flex items-start gap-2`}>
                      <span className="text-red-bright font-heading">Q:</span> {faq.q}
                    </h4>
                    <motion.div
                      animate={{ rotate: isActive ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-red-bright flex-shrink-0"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </div>
                  
                  {/* Animated Answer Wrapper */}
                  <motion.div 
                    initial={false}
                    animate={{ 
                      height: isActive ? "auto" : 0,
                      opacity: isActive ? 1 : 0
                    }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 border-t border-white/5">
                      <p className="text-muted text-sm leading-relaxed mt-4 border-l-2 border-red-bright/50 pl-4">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>


        </motion.div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-20 bg-[#020202] py-12 text-center border-t border-[var(--red-dark)]/30 shadow-[0_-10px_30px_var(--shadow-color)]">
        <Image src="/brand/joka-joki-logo-diedit.png" alt="Logo" width={128} height={128} unoptimized className="mx-auto mb-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 w-16 h-16 object-contain" />
        <p className="text-xs font-heading font-bold uppercase tracking-[0.4em] text-muted/40">
          &copy; {new Date().getFullYear()} JOKA JOKI MABAR VIP.<br className="sm:hidden mt-2"/> DOMINASI TANPA BATAS.
        </p>
      </footer>
    </div>
  )
}
