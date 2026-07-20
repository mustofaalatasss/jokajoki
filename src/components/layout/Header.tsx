"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, LogOut } from "lucide-react"
import { logout } from "@/app/login/actions"


export function Header({ className, onMenuClick, isDemo, user }: { className?: string; onMenuClick?: () => void; isDemo?: boolean; user?: any }) {
  const router = useRouter()

  async function handleLogout() {
    if (isDemo) return router.push("/");
    await logout()
    router.push("/login")
    router.refresh()
  }

  return (
    <header className={cn("flex h-16 items-center justify-between border-b border-red-dark/30 bg-[var(--header-bg)] backdrop-blur-md px-4 sm:px-6 relative z-10 shadow-[0_4px_30px_var(--shadow-color)]", className)}>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--red-bright)]/30 to-transparent" />
      
      <div className="flex items-center lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-[var(--text-muted)] hover:text-[var(--red-bright)] transition-colors"
          onClick={onMenuClick}
        >
          <span className="sr-only">Buka sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <Link href="/" className="flex items-center gap-2 ml-4 hover:opacity-80 transition-opacity">
          <Image src="/brand/joka-joki-logo-diedit.png" alt="Joka Joki Logo" width={128} height={128} unoptimized className="w-7 h-7 object-contain" />
          <h1 className="text-lg font-heading font-bold text-[var(--red-bright)] uppercase tracking-widest mt-1">Joka Joki</h1>
        </Link>
      </div>
      
      <div className="flex flex-1 justify-end items-center gap-4">
        <div className="flex items-center gap-3">

          <div className="text-sm text-right hidden sm:block border-l border-[var(--border-default)] pl-4">
            <p className="font-heading font-bold text-[var(--text-primary)] uppercase tracking-widest">{user?.name || user?.nickname || "Joki"}</p>
            <p className="text-xs text-[var(--text-muted)]">Joka Joki Panel</p>
          </div>
          <div className="h-10 w-10 rounded-sm clip-slanted bg-[var(--red-dark)] flex items-center justify-center border border-[var(--red-bright)] shadow-[0_0_10px_var(--accent-soft)]">
            <span className="text-sm font-bold text-[var(--text-primary)] uppercase">{(user?.name || user?.nickname || "J")?.charAt(0)}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--red-bright)] hover:bg-[var(--surface-hover)] rounded-lg transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
