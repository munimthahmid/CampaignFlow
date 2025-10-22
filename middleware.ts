import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const { pathname } = req.nextUrl
  const backend = process.env.NEXT_PUBLIC_DATA_BACKEND || 'mock'

  if (!pathname.startsWith('/dashboard')) return res

  if (backend === 'supabase') {
    const supabase = createMiddlewareClient({ req, res })
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    // Enforce email confirmation before allowing dashboard
    const { data: { user } } = await supabase.auth.getUser()
    const provider = (user as any)?.app_metadata?.provider
    const email = (user as any)?.email as string | undefined
    const confirmed = (user as any)?.email_confirmed_at || (user as any)?.confirmed_at
    // Skip verification prompt for OAuth providers (Google, etc.)
    if (provider === 'email' && !confirmed && email) {
      const url = req.nextUrl.clone()
      url.pathname = '/verify-email'
      url.searchParams.set('email', email)
      return NextResponse.redirect(url)
    }
    return res
  }

  // Mock mode: allow simple cookie session
  const hasSession = req.cookies.get('session')?.value
  if (!hasSession) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  return res
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
