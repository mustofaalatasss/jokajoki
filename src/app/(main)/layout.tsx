import { AppLayout } from "@/components/layout/AppLayout"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  let user = null
  try {
    user = await getCurrentUser()
  } catch (err) {
    // Ignore error
  }

  if (!user) {
    redirect("/login")
  }

  if (user.role === "ADMIN") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-surface-2 p-8 rounded-xl border border-warning/50 max-w-md">
          <h1 className="text-2xl font-bold text-warning mb-4">Akses Ditolak</h1>
          <p className="text-muted mb-6">
            Anda saat ini sedang login sebagai <strong>Owner</strong>. Dashboard ini khusus untuk <strong>Joki</strong>.<br/><br/>
            Untuk masuk ke Dashboard Joki, silakan <strong>Logout</strong> dari akun Owner terlebih dahulu, lalu login menggunakan akun Joki Anda. Atau gunakan mode Incognito (Tab Penyamaran).
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <a href="/owner" className="px-6 py-2 bg-[var(--surface-1)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] rounded font-bold transition-colors flex items-center justify-center">
              Kembali ke Owner
            </a>
            <form action={async () => {
              "use server"
              const { cookies } = await import("next/headers")
              const cookieStore = await cookies()
              cookieStore.delete("jokajoki-session")
              const { redirect } = await import("next/navigation")
              redirect("/login")
            }}>
              <button type="submit" className="w-full px-6 py-2 bg-[var(--danger)]/10 hover:bg-[var(--danger)]/20 text-[var(--danger)] border border-[var(--danger)]/30 rounded font-bold transition-colors">
                Logout & Tes Joki
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (user.subscriptionStatus === "EXPIRED" || (user.subscriptionEndsAt && new Date() > user.subscriptionEndsAt)) {
    redirect("/expired")
  }

  return <AppLayout user={user}>{children}</AppLayout>
}
