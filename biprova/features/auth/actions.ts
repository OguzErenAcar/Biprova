'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

type ActionResult = { error: string } | { success: true };

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
}): Promise<ActionResult> {
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

  // RLS bypass için admin client ile insert
  const admin = getAdminClient();

  const { error: insertError } = await admin
    .from('users')
    .insert({
      id:           userId,
      email:        data.email,
      name:         data.name,
      linkedin_url: data.linkedin_url,
      city:         data.city,
      is_remote:    data.is_remote,
    });

  if (insertError) {
    await admin.auth.admin.deleteUser(userId);
    return { error: insertError.message };
  }

  if (data.skill_ids.length > 0) {
    const { error: skillsError } = await admin
      .from('user_skills')
      .insert(data.skill_ids.map((skill_id) => ({ user_id: userId, skill_id })));

    if (skillsError) return { error: skillsError.message };
  }

  return { success: true };
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
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email:    data.email,
    password: data.password,
  });

  if (error) return { error: error.message };

  redirect('/dashboard');
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

  const { error: deleteRowError } = await supabase
    .from('users')
    .delete()
    .eq('id', user.id);

  if (deleteRowError) return { error: deleteRowError.message };

  const admin = getAdminClient();
  const { error: deleteAuthError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteAuthError) return { error: deleteAuthError.message };

  redirect('/');
}
