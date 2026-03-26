import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export async function LandingNav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-8 py-4 bg-white/85 backdrop-blur-[16px] border-b border-slate-200">
      <Link href="/" className="font-nunito font-black text-[1.4rem] tracking-[-0.5px] text-blue-600 no-underline">
        bir<span className="text-slate-900">prova</span>
      </Link>
      <div className="flex items-center gap-3">
        {user ? (
          <Link
            href="/dashboard"
            className="font-nunito font-extrabold text-sm px-[1.4rem] py-[0.55rem] bg-blue-600 text-white rounded-full shadow-[0_4px_14px_rgba(37,99,235,0.3)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] no-underline"
          >
            Dashboard'a Git →
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="font-nunito font-bold text-sm text-slate-600 hover:text-blue-600 transition-colors no-underline"
            >
              Giriş Yap
            </Link>
            <Link
              href="/waitlist"
              className="font-nunito font-extrabold text-sm px-[1.4rem] py-[0.55rem] bg-blue-600 text-white rounded-full shadow-[0_4px_14px_rgba(37,99,235,0.3)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] no-underline"
            >
              🚀 Listeye Katıl
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
