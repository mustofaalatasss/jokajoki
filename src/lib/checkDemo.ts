import { getCurrentUser } from "./session"

export async function checkDemoMutation() {
  const user = await getCurrentUser()
  if (user.email?.includes("@jokajoki.com") && user.email?.startsWith("kylian_")) {
    throw new Error("AKSES DITOLAK: Fitur ini dinonaktifkan untuk Pengunjung Demo (Hanya Visual).")
  }
}
