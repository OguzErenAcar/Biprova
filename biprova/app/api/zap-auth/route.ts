import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

/**
 * ZAP authenticated scanning için dev-only login endpoint.
 * Production'da 404 döner.
 *
 * ZAP konfigürasyonu:
 *   Login URL  : POST http://192.168.0.110:3000/api/zap-auth
 *   Post Data  : {"email":"{%username%}","password":"{%password%}"}
 *   Logged-in  : "authenticated":true
 *   Logged-out : "error"
 */
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let email: string | undefined;
  let password: string | undefined;

  try {
    const body = await request.json() as { email?: unknown; password?: unknown };
    if (typeof body.email === 'string') email = body.email;
    if (typeof body.password === 'string') password = body.password;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: 'email and password required' }, { status: 400 });
  }

  const response = NextResponse.json({ authenticated: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return response;
}
