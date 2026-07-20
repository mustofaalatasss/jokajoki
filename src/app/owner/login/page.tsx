"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { ShieldAlert, Key, Mail } from "lucide-react"
import { loginOwner } from "./actions"

export default function OwnerLoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError("Masukkan email dan password master!")
      return
    }
    setLoading(true)
    setError("")
    
    try {
      const res = await loginOwner(email, password)
      if (res.error) {
        setError(res.error)
      } else {
        window.location.href = "/owner"
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="bg-[var(--card-bg)] border border-[var(--red-dark)]/30 p-8 rounded-xl shadow-[0_0_50px_var(--shadow-color)] text-center">
          <ShieldAlert className="w-16 h-16 text-[var(--red-bright)] mx-auto mb-4 drop-shadow-[0_0_15px_var(--accent-soft)]" />
          <h1 className="text-xl font-heading font-black text-[var(--text-primary)] uppercase tracking-widest mb-6">
            RESTRICTED AREA
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <Mail className="w-4 h-4" />
              </div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Owner Email"
                className="pl-10 text-center tracking-widest"
                autoFocus
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <Key className="w-4 h-4" />
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Master Password"
                className="pl-10 text-center tracking-widest"
              />
            </div>

            {error && (
              <div className="text-danger text-sm font-bold bg-danger/10 py-2 rounded">
                {error}
              </div>
            )}

            <Button type="submit" variant="destructive" className="w-full" disabled={loading}>
              {loading ? "VERIFYING..." : "ENTER"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
