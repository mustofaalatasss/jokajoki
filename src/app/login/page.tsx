"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { login } from "./actions"
import { Shield, Lock, Eye, EyeOff, User } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [nickname, setNickname] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nickname.trim() || !password.trim()) {
      setError("Mohon isi semua form dengan lengkap!")
      return
    }
    setLoading(true)
    setError("")
    
    try {
      const res = await login(nickname, password)
      if (res.error) {
        setError(res.error)
      } else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_rgba(226,59,73,0.08)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(226,59,73,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(226,59,73,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[var(--card-bg)] border border-[var(--red-bright)]/20 shadow-[0_0_60px_var(--shadow-color)] relative overflow-hidden">
          {/* Top border accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-dark via-red-bright to-red-dark" />

          {/* Logo & Header */}
          <div className="flex flex-col items-center pt-10 pb-6 px-8 border-b border-white/5">
            <Image
              src="/brand/joka-joki-logo-diedit.png"
              alt="Joka Joki Logo"
              width={256}
              height={256}
              unoptimized
              className="w-20 h-20 object-contain mb-4"
            />
            <h1 className="text-2xl font-heading font-black text-white uppercase tracking-widest">
              Joka Joki
            </h1>
            <p className="text-muted text-sm mt-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-bright" />
              Sistem Manajemen Antrean
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {searchParams.get("registered") === "true" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-success/20 border border-success/50 text-success text-sm font-bold text-center rounded"
              >
                Registrasi Berhasil! Silakan masuk.
              </motion.div>
            )}

            <div className="space-y-3">
              <label className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3" /> Nickname
              </label>
              <Input
                type="text"
                name="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Nickname Anda"
                autoFocus
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3 h-3" /> Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-danger/20 border border-danger/50 text-danger text-sm font-bold"
              >
                {error}
              </motion.div>
            )}

            <Button type="submit" className="w-full h-12" disabled={loading}>
              {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
            </Button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-6 text-center space-y-4">
            <p className="text-sm text-muted">
              Belum punya akun?{" "}
              <Link href="/register" className="text-red-bright font-bold hover:underline underline-offset-4">
                Daftar Joki
              </Link>
            </p>
            <p className="text-xs text-muted/50">© 2024 Joka Joki • Mabar Control Panel</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-white">Memuat...</div>}>
      <LoginForm />
    </React.Suspense>
  )
}
