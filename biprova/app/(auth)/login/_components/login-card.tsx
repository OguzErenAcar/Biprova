import Link from 'next/link';
import { LoginForm } from './login-form';

export function LoginCard() {
  return (
    <div className="
      bg-white border-[1.5px] border-slate-200
      rounded-[28px] px-10 py-12
      w-full max-w-[420px]
      shadow-[0_8px_40px_rgba(0,0,0,0.08)]
      relative z-10
      animate-[fadeUp_0.4s_ease_both]
    ">
      <Link href="/" className="block font-nunito font-black text-[1.8rem] text-blue-600 text-center mb-1 tracking-tight no-underline">
        bir<span className="text-slate-900">prova</span>
      </Link>

      <p className="text-center text-[0.85rem] text-slate-500 mb-8 leading-relaxed">
        Tekrar hoş geldin.<br />Hesabına giriş yap.
      </p>

      <LoginForm />

      <p className="text-center text-[0.82rem] text-slate-500 mt-6">
        Hesabın yok mu?{' '}
        <Link href="/signup" className="text-blue-600 font-semibold hover:underline">Kayıt ol</Link>
      </p>

      <Link
        href="/"
        className="flex items-center justify-center gap-1.5 mt-4 text-[0.82rem] text-slate-500 hover:text-blue-600 transition-colors no-underline"
      >
        ← Ana sayfaya dön
      </Link>
    </div>
  );
}
