import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const SECRET_KEY = new TextEncoder().encode(
  process.env.BETTER_AUTH_SECRET || "fallback-secret-do-not-use-in-production"
)

// Halaman yang DILINDUNGI (harus login)
const PROTECTED_PATHS = ["/dashboard", "/history", "/customers", "/settings", "/design-system"]
// Halaman ADMIN only
const ADMIN_PATHS = ["/owner"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip untuk static files, api routes, dan halaman publik
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/live") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/brand") ||
    pathname === "/login" ||
    pathname === "/owner/login" ||
    pathname === "/register" ||
    pathname === "/expired" ||
    pathname === "/" ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get("jokajoki-session")?.value

  // Cek apakah halaman ini memerlukan login
  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p))
  const isAdmin = ADMIN_PATHS.some(p => pathname.startsWith(p))

  if (isProtected || isAdmin) {
    if (!sessionCookie) {
      // Tidak ada cookie → redirect sesuai jenis halamannya
      if (isAdmin) {
        return NextResponse.redirect(new URL("/owner/login", request.url))
      }
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      // Coba verifikasi sebagai JWT terlebih dahulu
      const { payload } = await jwtVerify(sessionCookie, SECRET_KEY)

      // Cek admin access
      if (isAdmin && payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      return NextResponse.next()
    } catch {
      // Jika bukan JWT valid, coba parse sebagai JSON lama (backward compatibility)
      try {
        const parsed = JSON.parse(sessionCookie)
        if (parsed.userId && parsed.role) {
          // Session lama masih valid, biarkan lewat
          // (akan di-upgrade ke JWT saat login berikutnya)
          if (isAdmin && parsed.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", request.url))
          }
          return NextResponse.next()
        }
      } catch {
        // Cookie rusak/dipalsukan → hapus dan redirect
      }

      // Token invalid → hapus cookie dan redirect sesuai halaman
      const fallbackUrl = isAdmin ? "/owner/login" : "/login"
      const response = NextResponse.redirect(new URL(fallbackUrl, request.url))
      response.cookies.delete("jokajoki-session")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match semua path kecuali:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.png (metadata files)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|icon\\.png).*)",
  ],
}
