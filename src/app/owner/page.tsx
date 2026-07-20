import { getJokis } from "./actions"
import { OwnerClient } from "./OwnerClient"

import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function OwnerPage() {
  let user = null
  try {
    user = await getCurrentUser()
  } catch (err) {
    // Ignore error
  }

  if (!user || user.role !== "ADMIN") {
    redirect("/owner/login")
  }

  const jokis = await getJokis()
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Simple Header for Owner */}
      <header className="border-b border-white/10 bg-black p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-heading font-bold text-red-bright tracking-widest uppercase">
            Joka Joki <span className="text-white">Admin</span>
          </h1>
          <form action={async () => {
            "use server"
            const { cookies } = await import("next/headers")
            const cookieStore = await cookies()
            cookieStore.delete("jokajoki-session")
            redirect("/owner/login")
          }}>
            <button className="text-sm text-muted hover:text-white transition-colors">
              Keluar
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <OwnerClient initialJokis={jokis} />
      </main>
    </div>
  )
}
