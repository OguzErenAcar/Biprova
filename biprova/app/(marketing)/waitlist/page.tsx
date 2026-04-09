import type { Metadata } from 'next';
import Link from 'next/link';
import { WaitlistFormCard } from './_components/waitlist-form-card';

export const metadata: Metadata = {
  title: 'biprova — Bekleme Listesi',
};

const STATS = [
  { num: '247', label: 'Bekleme Listesinde' },
  { num: '12+',  label: 'Şehirden Kayıt' },
  { num: 'Ücretsiz', label: 'Sonsuza Kadar' },
];

const PERKS = [
  { icon: '🚀', title: 'Erken Erişim',      desc: 'Platform açılır açılmaz seni bilgilendiriyoruz' },
  { icon: '🏅', title: 'Kurucu Rozeti',     desc: 'İlk 100 kişiye özel kalıcı "Kurucu Üye" rozeti' },
  { icon: '🎯', title: 'Öncelikli Eşleşme', desc: 'İlk üyeler projelere öncelikli başvurabilir' },
  { icon: '💬', title: 'Geri Bildirim Etkisi', desc: 'Özellik kararlarına oy ver, platforma şekil ver' },
];

export default function WaitlistPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8faff]">
      {/* Background blobs */}
      <div className="fixed w-[600px] h-[600px] rounded-full bg-blue-300 blur-[90px] opacity-[0.15] pointer-events-none -top-[200px] -right-[200px] z-0" />
      <div className="fixed w-[500px] h-[500px] rounded-full bg-cyan-200 blur-[90px] opacity-[0.15] pointer-events-none -bottom-[150px] -left-[150px] z-0" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white/85 backdrop-blur-[16px] border-b border-slate-200 max-sm:px-4">
        <Link href="/" className="font-nunito font-black text-[1.3rem] text-blue-600 tracking-tight no-underline">
          bir<span className="text-slate-900">prova</span>
        </Link>
        <Link href="/" className="text-[0.83rem] font-semibold text-slate-500 hover:text-blue-600 transition-colors no-underline">
          ← Geri dön
        </Link>
      </nav>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-28 sm:pt-32 pb-12 sm:pb-16 relative z-10">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-green-50 border-[1.5px] border-green-200 rounded-full px-4 py-1.5 text-[0.8rem] font-bold text-green-700 mb-8 animate-[fadeUp_0.4s_ease_both]">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Yakında Açılıyor — Bekleme Listesi Aktif
        </div>

        {/* Heading */}
        <h1 className="font-nunito font-black text-[clamp(2.4rem,6vw,4rem)] tracking-[-2px] leading-[1.1] text-center max-w-[600px] mb-5 animate-[fadeUp_0.4s_0.05s_ease_both]">
          İlk{' '}
          <span className="bg-gradient-to-br from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            100
          </span>{' '}
          kişiden<br />biri ol.
        </h1>

        <p className="text-[clamp(0.95rem,2vw,1.1rem)] text-slate-500 text-center leading-[1.7] max-w-[480px] mb-12 animate-[fadeUp_0.4s_0.1s_ease_both]">
          biprova henüz yayında değil ama yakında açılıyor.<br />
          Listeye katıl, platform açıldığında ilk sen öğren.
        </p>

        <WaitlistFormCard />

        {/* Stats */}
        <div className="flex justify-center gap-12 mb-12 animate-[fadeUp_0.4s_0.2s_ease_both] flex-wrap">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-nunito font-black text-[2rem] text-blue-600 leading-none">{s.num}</div>
              <div className="text-[0.76rem] font-semibold text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Perks */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 max-w-[680px] w-full animate-[fadeUp_0.4s_0.25s_ease_both]">
          {PERKS.map((p) => (
            <div key={p.title} className="bg-white border-[1.5px] border-slate-200 rounded-[16px] px-5 py-5 flex items-start gap-3">
              <span className="text-[1.3rem] shrink-0">{p.icon}</span>
              <div>
                <h4 className="font-nunito font-extrabold text-[0.9rem] text-slate-900 mb-0.5">{p.title}</h4>
                <p className="text-[0.78rem] text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Founder highlight */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-[1.5px] border-amber-200 rounded-[16px] px-5 py-4 flex items-center gap-3 max-w-[460px] w-full mt-8 animate-[fadeUp_0.4s_0.3s_ease_both]">
          <span className="text-2xl shrink-0">⚡</span>
          <p className="text-[0.82rem] text-amber-900 leading-relaxed">
            <strong>Sadece 100 kişi.</strong> İlk 100 kayıt tamamlandığında bekleme listesi kapanıyor. Şu an{' '}
            <strong>53</strong> yer kaldı.
          </p>
        </div>

      </main>
    </div>
  );
}
