import { getLiveState } from "./actions"
import { LiveOverlayClient } from "./LiveOverlayClient"

export const dynamic = "force-dynamic"

export default async function LiveOverlayPage(props: { searchParams: Promise<{ joki?: string; key?: string }> }) {
  const searchParams = await props.searchParams
  const nickname = searchParams?.joki || "admin"
  const providedKey = searchParams?.key || ""

  // Verifikasi secret key untuk mencegah akses tidak sah
  const expectedKey = process.env.LIVE_OVERLAY_SECRET || ""
  if (!expectedKey || providedKey !== expectedKey) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-2xl font-heading font-black">⛔ Akses Ditolak</p>
          <p className="text-sm text-muted mt-2">Key tidak valid. Tambahkan parameter <code>&key=xxx</code> yang benar pada URL.</p>
        </div>
      </div>
    )
  }

  const initialData = await getLiveState(nickname)

  return (
    <div className="min-h-screen bg-transparent p-4 flex items-start justify-start">
      {/* 
        NOTE FOR OBS USERS:
        In OBS Browser Source properties, ensure you leave "Custom CSS" default, 
        which is usually `body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }`
        This page relies on `bg-transparent` to allow the game stream to show behind it.
      */}
      <LiveOverlayClient initialData={initialData} nickname={nickname} />
    </div>
  )
}
