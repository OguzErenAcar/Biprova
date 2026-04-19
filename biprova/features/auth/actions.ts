'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { loginLimiter, signupLimiter, emailCheckLimiter, getClientIp } from '@/lib/rate-limit';

type ActionResult = { error: string } | { success: true };
type SignupResult = { error: string } | { success: true; userId: string };

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function signup(data: {
  name:         string;
  email:        string;
  password:     string;
  linkedin_url: string;
  city:         string;
  is_remote:    boolean;
  skill_ids:    string[];
  bio?:         string;
}): Promise<SignupResult> {
  const ip = await getClientIp();
  const { success } = await signupLimiter.limit(ip);
  if (!success) return { error: 'Çok fazla deneme yaptınız. Lütfen bekleyin.' };

  // signUp → Supabase confirmation mailini otomatik gönderir
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.signUp({
    email:    data.email,
    password: data.password,
    options: {
      data:             { name: data.name },
      emailRedirectTo:  `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error)          return { error: error.message };
  if (!authData.user) return { error: 'Kayıt başarısız, tekrar dene.' };

  const userId = authData.user.id;

  const admin = getAdminClient();

  // Trigger name, linkedin_url, city, is_remote bilmez — bunları güncelliyoruz
  const updatePayload: Record<string, unknown> = {
    name:         data.name,
    linkedin_url: data.linkedin_url,
    city:         data.city,
    is_remote:    data.is_remote,
  };
  if (data.bio) updatePayload.bio = data.bio;

  const { error: updateError } = await admin
    .from('users')
    .update(updatePayload)
    .eq('id', userId);

  if (updateError) {
    await admin.auth.admin.deleteUser(userId);
    return { error: updateError.message };
  }

  if (data.skill_ids.length > 0) {
    const { error: skillsError } = await admin
      .from('user_skills')
      .insert(data.skill_ids.map((skill_id) => ({ user_id: userId, skill_id })));

    if (skillsError) return { error: skillsError.message };
  }

  return { success: true, userId };
}

export async function getCities(): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cities')
    .select('id, name')
    .order('name', { ascending: true })
    .limit(100);

  if (error || !data) return [];
  return data;
}

export async function searchSkills(query: string): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('skills')
    .select('id, name')
    .ilike('name', `%${query}%`)
    .order('name', { ascending: true })
    .limit(5);

  if (error || !data) return [];
  return data;
}

export async function checkEmailAvailable(email: string): Promise<ActionResult> {
  const ip = await getClientIp();
  const { success } = await emailCheckLimiter.limit(ip);
  if (!success) return { error: 'Çok fazla deneme yaptınız. Lütfen bekleyin.' };

  const admin = getAdminClient();

  const { data, error } = await admin.auth.admin.listUsers();
  if (error) return { error: error.message };

  const exists = data.users.some(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  );
  if (exists) return { error: 'Bu e-posta zaten kayıtlı.' };

  return { success: true };
}

export async function login(data: {
  email:    string;
  password: string;
}): Promise<ActionResult> {
  const ip = await getClientIp();
  const { success } = await loginLimiter.limit(ip);
  if (!success) return { error: 'Çok fazla deneme yaptınız. Lütfen bekleyin.' };

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email:    data.email,
    password: data.password,
  });

  if (error) return { error: error.message };

  return { success: true };
}

export async function logout(): Promise<void> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from('users')
      .update({ last_sign_out_at: new Date().toISOString() })
      .eq('id', user.id);
  }

  await supabase.auth.signOut();
  redirect('/');
}

export async function deleteAccount(): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { error: 'Kullanıcı bulunamadı.' };

  const admin = getAdminClient();
  const { error: deleteAuthError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteAuthError) return { error: deleteAuthError.message };

  redirect('/');
}
