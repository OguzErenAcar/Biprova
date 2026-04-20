import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const rawNext = searchParams.get('next') ?? '/dashboard';
  // Open redirect koruması: sadece kendi origin'e yönlendir
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/dashboard';

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const { user } = data;
  const meta = user.user_metadata ?? {};

  const name: string =
    meta.full_name ?? meta.name ?? user.email?.split('@')[0] ?? 'Kullanıcı';

  const adminClient = createAdminClient();
  await adminClient.from('users').upsert(
    {
      id: user.id,
      email: user.email!,
      name,
      avatar_url: meta.avatar_url ?? null,
      linkedin_url: meta.provider_id
        ? `https://www.linkedin.com/in/${meta.provider_id}`
        : null,
    },
    { onConflict: 'id' }
  );

  return NextResponse.redirect(`${origin}${next}`);
}
