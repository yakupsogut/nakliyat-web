import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Oturum kontrolü
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Admin sayfalarına erişim kontrolü
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Giriş sayfası kontrolü
    if (request.nextUrl.pathname === '/admin-giris') {
      if (session) {
        // Kullanıcı giriş yapmışsa admin kontrolü
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .single()

        if (adminUser) {
          // Admin yetkisi varsa yönlendir
          return NextResponse.redirect(new URL('/admin', request.url))
        }
      }
      return res
    }

    // Diğer admin sayfaları için kontrol
    if (!session) {
      return NextResponse.redirect(new URL('/admin-giris', request.url))
    }

    // Admin yetkisi kontrolü
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', session.user.id)
      .single()

    if (!adminUser) {
      // Oturumu kapat ve giriş sayfasına yönlendir
      const response = NextResponse.redirect(new URL('/admin-giris', request.url))
      
      // Cookie'leri temizle
      response.cookies.delete('sb-access-token')
      response.cookies.delete('sb-refresh-token')
      
      return response
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/admin-giris']
}