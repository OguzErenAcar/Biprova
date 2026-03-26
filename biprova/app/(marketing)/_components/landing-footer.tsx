import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="flex items-center justify-between flex-wrap gap-4 px-8 py-8 border-t border-slate-200">
      <Link href="/" className="font-nunito font-black text-[1.1rem] text-blue-600 no-underline">
        bir<span className="text-slate-900">prova</span>
      </Link>
      <div className="flex items-center gap-6 flex-wrap">
        <Link href="/waitlist" className="text-[0.8rem] text-slate-500 hover:text-blue-600 transition-colors no-underline">Bekleme Listesi</Link>
        <Link href="/login"    className="text-[0.8rem] text-slate-500 hover:text-blue-600 transition-colors no-underline">Giriş Yap</Link>
        <Link href="/signup"   className="text-[0.8rem] text-slate-500 hover:text-blue-600 transition-colors no-underline">Kayıt Ol</Link>
        <Link href="/terms"    className="text-[0.8rem] text-slate-500 hover:text-blue-600 transition-colors no-underline">Kullanım Koşulları</Link>
        <Link href="/privacy"  className="text-[0.8rem] text-slate-500 hover:text-blue-600 transition-colors no-underline">Gizlilik Politikası</Link>
      </div>
      <p className="text-[0.8rem] text-slate-500">
        © 2025 biprova — Tüm hakları saklıdır.
      </p>
    </footer>
  );
}
