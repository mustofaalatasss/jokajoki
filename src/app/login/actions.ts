"use server"

import { cookies } from "next/headers"
import prisma from "@/lib/prisma"
import { signToken } from "@/lib/jwt"

// ===== RATE LIMITING =====
// Simpan jumlah percobaan gagal per IP/identifier
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 menit dalam milidetik

function checkRateLimit(identifier: string): { allowed: boolean; remainingMinutes?: number } {
  const now = Date.now()
  const attempt = loginAttempts.get(identifier)

  if (!attempt) return { allowed: true }

  // Reset jika sudah lewat lockout
  if (now - attempt.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(identifier)
    return { allowed: true }
  }

  if (attempt.count >= MAX_ATTEMPTS) {
    const remainingMs = LOCKOUT_DURATION - (now - attempt.lastAttempt)
    return { allowed: false, remainingMinutes: Math.ceil(remainingMs / 60000) }
  }

  return { allowed: true }
}

function recordFailedAttempt(identifier: string) {
  const now = Date.now()
  const attempt = loginAttempts.get(identifier)

  if (!attempt || now - attempt.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now })
  } else {
    loginAttempts.set(identifier, { count: attempt.count + 1, lastAttempt: now })
  }
}

function clearAttempts(identifier: string) {
  loginAttempts.delete(identifier)
}

// Bersihkan cache rate limit setiap 30 menit agar tidak memakan memori
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of loginAttempts.entries()) {
    if (now - val.lastAttempt > LOCKOUT_DURATION) {
      loginAttempts.delete(key)
    }
  }
}, 30 * 60 * 1000)

// ===== LOGIN =====
export async function login(nickname: string, passwordInput: string) {
  // Sanitasi input
  const cleanNickname = nickname.trim()
  const cleanPassword = passwordInput.trim()

  if (!cleanNickname || !cleanPassword) {
    return { error: "Nickname dan Password wajib diisi!" }
  }

  // Rate limiting berdasarkan nickname
  const rateLimitKey = `login:${cleanNickname.toLowerCase()}`
  const rateCheck = checkRateLimit(rateLimitKey)
  if (!rateCheck.allowed) {
    return { error: `Terlalu banyak percobaan login gagal! Coba lagi dalam ${rateCheck.remainingMinutes} menit.` }
  }

  const user = await prisma.user.findFirst({
    where: { nickname: cleanNickname, rawPassword: cleanPassword, role: "JOKI" }
  })

  if (!user) {
    recordFailedAttempt(rateLimitKey)
    return { error: "Nickname atau Password salah!" }
  }

  // Cek status subscription
  // (biarkan login dulu, nanti di-redirect oleh halaman jika expired)

  // Login berhasil → bersihkan rate limit
  clearAttempts(rateLimitKey)

  // Buat JWT token yang ditandatangani (tidak bisa dipalsukan)
  const token = await signToken({ role: "JOKI", userId: user.id })

  const cookieStore = await cookies()
  cookieStore.set("jokajoki-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: "/",
  })

  return { success: true, role: "JOKI" }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("jokajoki-session")
  return { success: true }
}
