import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('payload-token')
  const { pathname } = request.nextUrl

  // Protect all authenticated portals (but allow the login pages themselves)
  const isProtected =
    (pathname.startsWith('/dashboard') ||
      pathname.startsWith('/account') ||
      pathname.startsWith('/affiliate/dashboard') ||
      pathname.startsWith('/admin-dashboard')) &&
    !token

  if (isProtected) {
    const loginUrl = pathname.startsWith('/affiliate')
      ? '/affiliate/login'
      : '/login'
    return NextResponse.redirect(new URL(loginUrl, request.url))
  }

  // Redirect authenticated users away from login pages
  if ((pathname === '/login' || pathname === '/affiliate/login') && token) {
    const dest = pathname.startsWith('/affiliate') ? '/affiliate/dashboard' : '/dashboard'
    return NextResponse.redirect(new URL(dest, request.url))
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
