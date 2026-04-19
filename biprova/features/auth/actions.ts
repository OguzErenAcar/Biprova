'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import {
  loginLimiter,
  signupLimiter,
  emailCheckLimiter,
  getClientIp,
  recordFailedLogin,
  checkAccountLocked,
  clearFailedLogins,
} from '@/lib/rate-limit';

type ActionResult = { error: string } | { success: true };
type SignupResult = { error: string } | { success: true; userId: string };

const signupSchema = z.object({
  name:         z.string().min(1).max(100),
  email:        z.string().email(),
  password:     z.string().min(8).max(128),
  linkedin_url: z.string().url().or(z.literal('')).or(z.literal(undefined as unknown as string)).optional().default(''),
  city:         z.string().min(1, 'Şehir zorunludur').max(100).trim(),
  is_remote:    z.boolean(),
  skill_ids:    z.array(z.string().uuid()).max(20),
  bio:          z.string().max(500).optional(),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8).max(128),
});

const emailSchema = z.object({
  email: z.string().email(),
});

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function signup(data: z.infer<typeof signupSchema>): Promise<SignupResult> {
  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) return { error: 'Geçersiz form verisi.' };

  const ip = await getClientIp();
  const { success } = await signupLimiter.limit(ip);
  if (!success) return { error: 'Çok fazla deneme yaptınız. Lütfen bekleyin.' };

  // signUp → Supabase confirmation mailini otomatik gönderir
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.signUp({
    email:    parsed.data.email,
    password: parsed.data.password,
    options: {
      data:             { name: parsed.data.name },
      emailRedirectTo:  `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error)          return { error: error.message };
  if (!authData.user) return { error: 'Kayıt başarısız, tekrar dene.' };

  const userId = authData.user.id;

  const admin = getAdminClient();

  // Trigger name, linkedin_url, city, is_remote bilmez — bunları güncelliyoruz
  const { error: updateError } = await admin
    .from('users')
    .update({
      name:         parsed.data.name,
      linkedin_url: parsed.data.linkedin_url ?? '',
      city:         parsed.data.city,
      is_remote:    parsed.data.is_remote,
      ...(parsed.data.bio ? { bio: parsed.data.bio } : {}),
    })
    .eq('id', userId);

  if (updateError) {
    await admin.auth.admin.deleteUser(userId);
    return { error: updateError.message };
  }

  if (parsed.data.skill_ids.length > 0) {
    const { error: skillsError } = await admin
      .from('user_skills')
      .insert(parsed.data.skill_ids.map((skill_id) => ({ user_id: userId, skill_id })));

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

function escapeLike(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}

export async function searchSkills(query: string): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient();
  const escaped = escapeLike(query.trim().slice(0, 100));

  const { data, error } = await supabase
    .from('skills')
    .select('id, name')
    .ilike('name', `%${escaped}%`)
    .order('name', { ascending: true })
    .limit(5);

  if (error || !data) return [];
  return data;
}

export async function checkEmailAvailable(email: string): Promise<ActionResult> {
  const parsed = emailSchema.safeParse({ email });
  if (!parsed.success) return { error: 'Geçersiz e-posta adresi.' };

  const ip = await getClientIp();
  const { success } = await emailCheckLimiter.limit(ip);
  if (!success) return { error: 'Çok fazla deneme yaptınız. Lütfen bekleyin.' };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', parsed.data.email.toLowerCase())
    .maybeSingle();

  if (error) return { error: error.message };
  if (data) return { error: 'Bu e-posta zaten kayıtlı.' };

  return { success: true };
}

export async function login(data: z.infer<typeof loginSchema>): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) return { error: 'Geçersiz e-posta veya şifre formatı.' };

  // IP bazlı rate limit
  const ip = await getClientIp();
  const { success: withinIpLimit } = await loginLimiter.limit(ip);
  if (!withinIpLimit) return { error: 'Çok fazla deneme yaptınız. Lütfen bekleyin.' };

  // Hesap kilitleme kontrolü
  const { locked, ttl } = await checkAccountLocked(parsed.data.email);
  if (locked) {
    const minutes = Math.ceil(ttl / 60);
    return { error: `Hesabınız çok fazla başarısız deneme nedeniyle kilitlendi. ${minutes} dakika sonra tekrar deneyin.` };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email:    parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    const { locked: nowLocked, attemptsLeft } = await recordFailedLogin(parsed.data.email);
    if (nowLocked) {
      return { error: 'Hesabınız çok fazla başarısız deneme nedeniyle 15 dakika kilitlendi.' };
    }
    if (attemptsLeft <= 2) {
      return { error: `Hatalı e-posta veya şifre. ${attemptsLeft} deneme hakkınız kaldı.` };
    }
    return { error: 'Hatalı e-posta veya şifre.' };
  }

  // Başarılı girişte sayacı sıfırla
  await clearFailedLogins(parsed.data.email);

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

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

const updatePasswordSchema = z.object({
  password: z.string().min(8).max(128),
});

export async function requestPasswordReset(email: string): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse({ email });
  if (!parsed.success) return { error: 'Geçerli bir e-posta adresi girin.' };

  const ip = await getClientIp();
  const { success } = await emailCheckLimiter.limit(ip);
  if (!success) return { error: 'Çok fazla deneme yaptınız. Lütfen bekleyin.' };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  });

  // Güvenlik: kullanıcı var mı yok mu bilgi vermiyoruz
  if (error) return { success: true };
  return { success: true };
}

export async function updatePassword(password: string): Promise<ActionResult> {
  const parsed = updatePasswordSchema.safeParse({ password });
  if (!parsed.success) return { error: 'Şifre en az 8 karakter olmalı.' };

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: 'Oturumunuz geçersiz. Lütfen tekrar şifre sıfırlama isteği gönderin.' };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: error.message };
  return { success: true };
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
