import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // Nonce oluştur — her istek için benzersiz, base64 kodlanmış
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const cspHeader = [
    "default-src 'self'",
    // 'strict-dynamic': nonce ile yüklenen script'lerin dinamik import yapmasına izin verir
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    // style-src: Tailwind/shadcn inline stiller için unsafe-inline gerekli
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.supabase.co",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ');

  // Nonce'u request header'a ekle — layout.tsx'te okumak için
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  // Supabase session refresh — cookie'leri güncellemek için response gerekli
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Session'ı yenile (hata fırlatmaz, sessizce geçer)
  await supabase.auth.getUser();

  // CSP header'ı response'a ekle
  response.headers.set('Content-Security-Policy', cspHeader);
  // Diğer güvenlik header'ları
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    /*
     * _next/static, _next/image, favicon.ico ve statik dosyalar hariç
     * tüm route'lara uygulanır
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
