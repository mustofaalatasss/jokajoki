"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, History, Settings, Flame, LogOut, Lock } from "lucide-react"
import { logout } from "@/app/login/actions"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"

const navigation = [
  { name: "Dashboard Live", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pelanggan", href: "/customers", icon: Users },
  { name: "Riwayat", href: "/history", icon: History },
  { name: "Pengaturan", href: "/settings", icon: Settings },
  { name: "Design System", href: "/design-system", icon: Flame },
]

export function Sidebar({ className, isDemo }: { className?: string; isDemo?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const [demoFeature, setDemoFeature] = React.useState<string | null>(null);

  const handleLogout = async () => {
    if (isDemo) return router.push("/");
    await logout()
    router.push("/login")
    router.refresh()
  }

  const currentNav = isDemo ? [
    { name: "Dashboard Live", href: "/demo", icon: LayoutDashboard },
    { name: "Pelanggan", href: "/demo/customers", icon: Users },
    { name: "Riwayat", href: "/demo/history", icon: History },
    { name: "Pengaturan", href: "/demo/settings", icon: Settings },
    { name: "Design System", href: "/design-system", icon: Flame },
  ] : navigation;

  return (
    <>
      <div className={cn("flex h-full w-[240px] flex-col border-r border-red-dark/30 bg-[var(--sidebar-bg)] shadow-[5px_0_30px_var(--shadow-color)]", className)}>
        <div className="flex h-16 items-center px-6 border-b border-red-dark/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--red-bright)]/50 to-transparent" />
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity z-10">
            <Image src="/brand/joka-joki-logo-diedit.png" alt="Joka Joki Logo" width={128} height={128} unoptimized className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-heading font-bold text-[var(--red-bright)] uppercase tracking-widest mt-1 drop-shadow-[0_0_8px_var(--accent-soft)]">Joka Joki</h1>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-2 px-3">
            {currentNav.map((item) => {
              const isActive = pathname === item.href || (isDemo && pathname === '/demo' && item.href === '/demo')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (isDemo && item.href === "#") {
                      e.preventDefault();
                      setDemoFeature(item.name);
                    }
                  }}
                  className={cn(
                    "group flex items-center rounded-none px-4 py-3 text-sm font-heading font-bold tracking-widest uppercase transition-all duration-300 border-l-2 relative overflow-hidden",
                    isActive
                      ? "border-[var(--red-bright)] text-[var(--text-primary)] bg-gradient-to-r from-[var(--red-dark)]/40 to-transparent shadow-[inset_20px_0_20px_-20px_var(--accent-soft)]"
                      : "border-transparent text-[var(--text-muted)] hover:border-[var(--red-bright)]/50 hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                  )}
                >
                  {isActive && (
                    <span className="absolute inset-0 bg-gradient-to-r from-[var(--red-bright)]/10 to-transparent animate-pulse pointer-events-none" />
                  )}
                  <item.icon 
                    className={cn(
                      "mr-4 h-5 w-5 flex-shrink-0 transition-transform duration-300", 
                      isActive ? "text-[var(--red-bright)] scale-110" : "text-[var(--text-muted)] group-hover:text-[var(--red-bright)] group-hover:scale-110"
                    )} 
                    aria-hidden="true" 
                  />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-[var(--border-default)]">
          <a
            href="https://wa.me/6287868036735"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full group flex items-center rounded-none px-4 py-3 mb-2 text-sm font-heading font-bold tracking-widest uppercase transition-all duration-300 border-l-2 border-transparent text-[#25D366] hover:border-[#25D366] hover:bg-[#25D366]/10"
          >
            <svg className="mr-4 h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span className="relative z-10">Bantuan WA</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full group flex items-center rounded-none px-4 py-3 text-sm font-heading font-bold tracking-widest uppercase transition-all duration-300 border-l-2 border-transparent text-[var(--danger)] hover:border-[var(--danger)] hover:bg-[var(--danger)]/10"
          >
            <LogOut className="mr-4 h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
            <span className="relative z-10">Logout</span>
          </button>
        </div>
      </div>

      <Dialog open={!!demoFeature} onOpenChange={(open) => !open && setDemoFeature(null)}>
        <DialogContent className="text-center">
          <div className="flex justify-center mb-4 text-[var(--red-bright)]">
            <Lock className="h-12 w-12" />
          </div>
          <DialogTitle className="text-xl mb-2">Tampilan Demo</DialogTitle>
          <DialogDescription className="text-base text-[var(--text-muted)] mb-6">
            Fitur <span className="text-[var(--text-primary)] font-bold">{demoFeature}</span> hanya tersedia pada versi asli/full version Joka Joki.
          </DialogDescription>
          <div className="flex justify-center">
            <Button onClick={() => setDemoFeature(null)} variant="default" className="px-8 bg-red-bright hover:bg-red-bright/90">
              Mengerti
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
