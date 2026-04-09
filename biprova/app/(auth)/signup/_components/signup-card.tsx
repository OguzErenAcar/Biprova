import Link from 'next/link';
import { SignupForm } from './signup-form';

export function SignupCard() {
  return (
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
        Ekibini bul, birlikte üret.<br />Hemen kayıt ol.
      </p>

      <SignupForm />

      <p className="text-center text-[0.75rem] text-slate-400 leading-relaxed mt-6">
        Kayıt olarak{' '}
        <Link href="/terms" className="text-blue-600 font-semibold hover:underline">Kullanım Koşulları</Link>&apos;nı ve{' '}
        <Link href="/privacy" className="text-blue-600 font-semibold hover:underline">Gizlilik Politikası</Link>&apos;nı kabul etmiş olursun.
      </p>

      <p className="text-center text-[0.82rem] text-slate-500 mt-5">
        Zaten hesabın var mı?{' '}
        <Link href="/login" className="text-blue-600 font-semibold hover:underline">Giriş yap</Link>
      </p>
    </div>
  );
}
