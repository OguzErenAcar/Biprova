import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Session'ı taze tut — getUser() her zaman sunucudan doğrular
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  // Korumalı route'lar: giriş yoksa /login'e yönlendir
  const isProtected = request.nextUrl.pathname.startsWith('/dashboard')
  if (isProtected) {
    console.log('[proxy] path:', request.nextUrl.pathname, '| user:', user?.id ?? 'null', '| authError:', authError?.message ?? 'none')
  }
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Auth geçerli ama public.users satırı yoksa oturumu sonlandır
  if (isProtected && user) {
    const { data: dbUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!dbUser) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Giriş yapmış kullanıcı login/signup'a gelirse dashboard'a yönlendir
  const isAuthPage =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup')
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
