'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { waitlistLimiter, getClientIp } from '@/lib/rate-limit';

const waitlistSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin.'),
});

interface JoinResult {
  status: 'joined' | 'already';
  position: number;
}

export async function joinWaitlist(email: string): Promise<JoinResult | { error: string }> {
  const parsed = waitlistSchema.safeParse({ email });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Geçersiz e-posta.' };

  const ip = await getClientIp();
  const { success } = await waitlistLimiter.limit(ip);
  if (!success) return { error: 'Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.' };

  const supabase = await createClient();

  const normalizedEmail = parsed.data.email.toLowerCase();

  const { data: existing, error: checkError } = await supabase
    .from('waitlist')
    .select('id')
    .eq('email', normalizedEmail)
    .limit(1)
    .maybeSingle();

  if (checkError) return { error: checkError.message };

  if (existing) {
    const { count } = await supabase
      .from('waitlist')
      .select('id', { count: 'exact', head: true });

    return { status: 'already', position: count ?? 0 };
  }

  const { error: insertError } = await supabase
    .from('waitlist')
    .insert({ email: normalizedEmail });

  if (insertError) return { error: insertError.message };

  const { count } = await supabase
    .from('waitlist')
    .select('id', { count: 'exact', head: true });

  return { status: 'joined', position: count ?? 1 };
}
