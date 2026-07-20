"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { signToken } from "@/lib/jwt"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "owner@jokajoki.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "jokajoki2024"

// ===== RATE LIMITING =====
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 3 // Lebih ketat untuk admin
const LOCKOUT_DURATION = 0 // Dimatikan sementar untuk local testing

export async function loginOwner(emailInput: string, passwordInput: string) {
  const cleanEmail = emailInput.trim().toLowerCase()
  const cleanPassword = passwordInput.trim()

  if (!cleanEmail || !cleanPassword) {
    return { error: "Email dan Password wajib diisi!" }
  }

  // Rate limiting
  const rateLimitKey = `owner-login:${cleanEmail}`
  const now = Date.now()
  const attempt = loginAttempts.get(rateLimitKey)
  
  if (attempt && now - attempt.lastAttempt < LOCKOUT_DURATION && attempt.count >= MAX_ATTEMPTS) {
    const remainingMs = LOCKOUT_DURATION - (now - attempt.lastAttempt)
    return { error: `Terlalu banyak percobaan! Coba lagi dalam ${Math.ceil(remainingMs / 60000)} menit.` }
  }

  if (cleanEmail !== ADMIN_EMAIL.toLowerCase() || cleanPassword !== ADMIN_PASSWORD) {
    // Record failed attempt
    if (!attempt || now - attempt.lastAttempt > LOCKOUT_DURATION) {
      loginAttempts.set(rateLimitKey, { count: 1, lastAttempt: now })
    } else {
      loginAttempts.set(rateLimitKey, { count: attempt.count + 1, lastAttempt: now })
    }
    return { error: "Email atau Password Master Salah!" }
  }

  // Berhasil → bersihkan rate limit
  loginAttempts.delete(rateLimitKey)

  // Buat JWT token yang ditandatangani
  const token = await signToken({ role: "ADMIN", userId: "admin" })

  const cookieStore = await cookies()
  cookieStore.set("jokajoki-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: "/",
  })

  redirect("/owner")
}
