"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { LogIn, UserPlus, Lock, User, Mail, Zap } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { registerJoki } from "./actions"

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const res = await registerJoki(formData)

    if (res?.error) {
      setError(res.error)
      setLoading(false)
    } else {
      router.push("/login?registered=true")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-bg">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex justify-center mb-8">
          <Image 
            src="/brand/joka-joki-logo-diedit.png" 
            alt="Joka Joki Logo" 
            width={120} 
            height={120}
            unoptimized
            className="drop-shadow-[0_0_15px_rgba(255,51,51,0.5)]"
          />
        </div>

        <Card className="border-white/10 bg-surface/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-3xl font-heading font-black tracking-wider text-white">
              DAFTAR JOKI
            </CardTitle>
            <CardDescription className="text-muted text-sm">
              Buat akun untuk mengelola antrean mabar Anda.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-danger/10 border border-danger/20 text-danger text-sm font-medium text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2 relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-red transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <Input
                  name="nickname"
                  placeholder="Nickname In-Game / Username"
                  required
                  className="pl-10 h-12 bg-black/40 border-white/10 focus:border-red focus:ring-red/20 text-lg"
                />
              </div>

              <div className="space-y-2 relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-red transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email (Opsional)"
                  className="pl-10 h-12 bg-black/40 border-white/10 focus:border-red focus:ring-red/20 text-lg"
                />
              </div>

              <div className="space-y-2 relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-red transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="pl-10 h-12 bg-black/40 border-white/10 focus:border-red focus:ring-red/20 text-lg"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-bold tracking-widest bg-red hover:bg-red/90 text-white shadow-[0_0_20px_rgba(255,51,51,0.3)] hover:shadow-[0_0_30px_rgba(255,51,51,0.5)] transition-all mt-4"
                disabled={loading}
              >
                {loading ? "MEMPROSES..." : "DAFTAR SEKARANG"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-white/5 pt-6 pb-6">
            <p className="text-sm text-muted">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-red font-bold hover:underline underline-offset-4">
                Masuk di sini
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
