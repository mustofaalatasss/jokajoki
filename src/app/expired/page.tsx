"use client"

import { Button } from "@/components/ui/Button"
import { AlertTriangle } from "lucide-react"
import { logout } from "@/app/login/actions"
import { useRouter } from "next/navigation"

export default function ExpiredPage() {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface/50 backdrop-blur-xl border border-danger/30 rounded-2xl p-8 text-center shadow-[0_0_50px_rgba(255,51,51,0.15)] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-danger to-transparent" />
        
        <div className="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(255,51,51,0.2)]">
          <AlertTriangle className="w-10 h-10 text-danger drop-shadow-md" />
        </div>

        <h1 className="text-3xl font-heading font-black text-white uppercase tracking-wider mb-2">
          AKSES TERKUNCI
        </h1>
        
        <p className="text-muted mb-8 leading-relaxed">
          Masa aktif langganan akun Anda telah habis atau Anda baru saja mendaftar. 
          Silakan hubungi Owner (Pengelola) untuk melakukan pembayaran dan mengaktifkan akun Anda.
        </p>

        <div className="flex flex-col gap-3">
          <a 
            href="https://wa.me/6287868036735?text=Halo%20Admin%2C%20saya%20ingin%20mengaktifkan%20akun%20Joki%20saya" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 h-12 text-base font-bold tracking-widest bg-[#25D366] hover:bg-[#1ebd57] text-white rounded-md transition-all shadow-[0_0_15px_rgba(37,211,102,0.3)]"
          >
            HUBUNGI OWNER VIA WA
          </a>

          <Button 
            onClick={handleLogout}
            className="w-full h-12 text-sm font-bold tracking-widest bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all"
          >
            KEMBALI KE LOGIN
          </Button>
        </div>
      </div>
    </div>
  )
}
