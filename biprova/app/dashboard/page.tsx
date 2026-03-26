import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { logout } from '@/features/auth/actions';

async function DashboardContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('users')
    .select('name, linkedin_url')
    .eq('id', user.id)
    .single();

  return (
    <div className="bg-white border-[1.5px] border-slate-200 rounded-[24px] p-10 w-full max-w-md shadow-sm text-center">
      <div className="text-4xl mb-4">👋</div>
      <h1 className="font-nunito font-black text-2xl text-slate-900 mb-1">
        Hoş geldin{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}!
      </h1>
      <p className="text-[0.85rem] text-slate-500 mb-2">{user.email}</p>
      {profile?.linkedin_url && (
        <a
          href={profile.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.82rem] text-blue-600 hover:underline"
        >
          LinkedIn profilini gör
        </a>
      )}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <p className="text-[0.78rem] text-slate-400 mb-4">Dashboard yapım aşamasında.</p>
        <form action={logout}>
          <button
            type="submit"
            className="text-[0.82rem] font-semibold text-slate-500 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none"
          >
            Çıkış Yap
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f1f5f9] flex items-center justify-center px-6">
      <Suspense fallback={<div className="text-slate-400 text-sm">Yükleniyor...</div>}>
        <DashboardContent />
      </Suspense>
    </main>
  );
}
