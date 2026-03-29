import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('payload-token')
  const { pathname } = request.nextUrl

  // Protect all authenticated portals
  if (
    (pathname.startsWith('/dashboard') ||
      pathname.startsWith('/account') ||
      pathname.startsWith('/affiliate')) &&
    !token
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from login
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Set affiliate referral cookie on first visit with ?ref=CODE
  const refCode = request.nextUrl.searchParams.get('ref')
  if (refCode && !request.cookies.get('affiliate_ref')) {
    const response = NextResponse.next()
    response.cookies.set('affiliate_ref', refCode, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    })
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Run on all page routes; exclude Next.js internals, static assets, API routes, and admin panel
    '/((?!_next/static|_next/image|favicon\\.ico|api/|admin).*)',
  ],
}
