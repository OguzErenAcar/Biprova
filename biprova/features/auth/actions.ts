'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

type ActionResult = { error: string } | { success: true };

export async function signup(data: {
  name:        string;
  email:       string;
  password:    string;
  linkedin_url: string;
}): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.signUp({
    email:    data.email,
    password: data.password,
    options: {
      data: { name: data.name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error)          return { error: error.message };
  if (!authData.user) return { error: 'Kayıt başarısız, tekrar dene.' };

  const { error: insertError } = await supabase
    .from('users')
    .insert({
      id:          authData.user.id,
      email:       data.email,
      name:        data.name,
      linkedin_url: data.linkedin_url,
    });

  if (insertError) return { error: insertError.message };

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

  if (error) return { error: 'E-posta veya şifre hatalı.' };

  redirect('/dashboard');
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
