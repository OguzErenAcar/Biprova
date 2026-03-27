'use server';

import { createClient } from '@/lib/supabase/server';

interface JoinResult {
  status: 'joined' | 'already';
  position: number;
}

export async function joinWaitlist(email: string): Promise<JoinResult | { error: string }> {
  const supabase = await createClient();

  const { data: existing, error: checkError } = await supabase
    .from('waitlist')
    .select('id')
    .eq('email', email)
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
    .insert({ email });

  if (insertError) return { error: insertError.message };

  const { count } = await supabase
    .from('waitlist')
    .select('id', { count: 'exact', head: true });

  return { status: 'joined', position: count ?? 1 };
}
