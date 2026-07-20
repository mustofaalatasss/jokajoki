"use client"

import * as React from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { Drawer } from "@/components/ui/Drawer"
import Link from "next/link"
import Image from "next/image"
import { LayoutDashboard, Users, History, Settings, Flame, Lock } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"

const navigation = [
  { name: "Dashboard Live", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pelanggan", href: "/customers", icon: Users },
  { name: "Riwayat", href: "/history", icon: History },
  { name: "Pengaturan", href: "/settings", icon: Settings },
  { name: "Design System", href: "/design-system", icon: Flame },
]

export function AppLayout({ children, isDemo, user }: { children: React.ReactNode; isDemo?: boolean; user?: any }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [demoFeature, setDemoFeature] = React.useState<string | null>(null);

  const currentNav = isDemo ? [
    { name: "Dashboard Live", href: "/demo", icon: LayoutDashboard },
    { name: "Pelanggan", href: "/demo/customers", icon: Users },
    { name: "Riwayat", href: "/demo/history", icon: History },
    { name: "Pengaturan", href: "/demo/settings", icon: Settings },
    { name: "Design System", href: "/design-system", icon: Flame },
  ] : navigation;

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      {/* Desktop sidebar */}
      <Sidebar className="hidden lg:flex" isDemo={isDemo} />

      {/* Mobile drawer */}
      <Drawer open={sidebarOpen} onClose={() => setSidebarOpen(false)} side="left">
        <div className="flex items-center pb-6 border-b border-[var(--border-default)]">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" onClick={() => setSidebarOpen(false)}>
            <Image src="/brand/joka-joki-logo-diedit.png" alt="Joka Joki Logo" width={128} height={128} unoptimized className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-heading font-bold text-[var(--red)] uppercase tracking-wider mt-1">Joka Joki</h1>
          </Link>
        </div>
        <nav className="space-y-1 py-4 flex-1 overflow-y-auto">
          {currentNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => {
                setSidebarOpen(false);
                if (isDemo && item.href === "#") {
                  e.preventDefault();
                  setDemoFeature(item.name);
                }
              }}
              className="group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] text-[var(--text-muted)]"
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {item.name}
            </Link>
          ))}
        </nav>
      </Drawer>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} isDemo={isDemo} user={user} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
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
    </div>
  )
}
