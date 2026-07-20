"use server"

import { SignJWT, jwtVerify } from "jose"

const SECRET_KEY = new TextEncoder().encode(
  process.env.BETTER_AUTH_SECRET || "fallback-secret-do-not-use-in-production"
)

export type SessionPayload = {
  role: "JOKI" | "ADMIN"
  userId: string
}

/**
 * Membuat JWT token dari session data.
 * Token ini ditandatangani sehingga tidak bisa dipalsukan.
 */
export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY)
}

/**
 * Memverifikasi dan membaca JWT token.
 * Jika token dipalsukan atau kadaluarsa, akan throw error.
 */
export async function verifyToken(token: string): Promise<SessionPayload> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return {
      role: payload.role as "JOKI" | "ADMIN",
      userId: payload.userId as string,
    }
  } catch {
    throw new Error("Invalid or expired token")
  }
}
