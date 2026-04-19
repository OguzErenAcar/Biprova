import type { Metadata } from 'next';
import Link from 'next/link';
import { ResetPasswordForm } from './_components/reset-password-form';

export const metadata: Metadata = {
  title: 'biprova — Şifre Sıfırla',
};

export default function ResetPasswordPage() {
  return (
    <main className="relative min-h-dvh overflow-x-hidden flex items-center justify-center px-3 sm:px-6 py-8 bg-[#f8faff]">
      <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-300 blur-[80px] opacity-[0.18] pointer-events-none -top-[150px] -right-[150px]" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-violet-300 blur-[80px] opacity-[0.18] pointer-events-none -bottom-[120px] -left-[120px]" />

      <div className="
        bg-white border-[1.5px] border-slate-200
        rounded-[20px] sm:rounded-[28px] px-5 py-8 sm:px-10 sm:py-12
        w-full max-w-[420px]
        shadow-[0_8px_40px_rgba(0,0,0,0.08)]
        relative z-10
        animate-[fadeUp_0.4s_ease_both]
      ">
        <Link href="/" className="block font-nunito font-black text-[1.8rem] text-blue-600 text-center mb-1 tracking-tight no-underline">
          bir<span className="text-slate-900">prova</span>
        </Link>

        <p className="text-center text-[0.85rem] text-slate-500 mb-8 leading-relaxed">
          Yeni şifreni belirle.
        </p>

        <ResetPasswordForm />
      </div>
    </main>
  );
}
