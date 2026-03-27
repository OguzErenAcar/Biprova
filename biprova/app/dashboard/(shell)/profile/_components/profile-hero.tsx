export function ProfileHero() {
  return (
    <div className="bg-white border border-slate-200 rounded-[16px] overflow-hidden mb-5">
      {/* Cover */}
      <div className="h-[100px] bg-gradient-to-br from-blue-800 via-indigo-500 to-violet-500" />

      <div className="px-6 pb-6 relative">
        {/* Avatar */}
        <div className="absolute -top-10 left-6 w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center font-nunito font-black text-[1.8rem] text-white border-4 border-white shadow-[0_4px_16px_rgba(37,99,235,0.25)]">
          AK
        </div>

        {/* Badges row */}
        <div className="flex justify-end items-center gap-2 pt-2.5 mb-9">
          <span className="flex items-center gap-1.5 bg-amber-50 text-amber-800 text-[0.75rem] font-bold px-2.5 py-1 rounded-[8px]">
            🏅 İlk 100 Kurucu Üye
          </span>
          <a
            href="#"
            className="flex items-center gap-1.5 bg-[#0a66c2] text-white text-[0.75rem] font-bold px-2.5 py-1 rounded-[8px] no-underline"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
        </div>

        {/* Name & title */}
        <div className="font-nunito font-black text-[1.4rem] text-slate-900 mb-1">
          Ahmet Kaya
        </div>
        <div className="text-[0.92rem] text-slate-500 mb-3">
          UI/UX Tasarımcı · Ürün Stratejisti
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-[0.82rem] text-slate-500">
          <span>📍 İstanbul</span>
          <span>🌐 Remote uyumlu</span>
          <span>📅 Mart 2024'ten beri üye</span>
        </div>

        {/* Bio */}
        <p className="mt-4 pt-4 border-t border-slate-100 text-[0.88rem] text-slate-700 leading-[1.6]">
          Kullanıcı odaklı ürünler tasarlıyorum. Startup ekiplerinde çalışmayı, sıfırdan bir şey
          inşa etmeyi seviyorum. Şu an yan projeler için güçlü bir ekip arıyorum — özellikle sosyal
          etki alanında.
        </p>
      </div>
    </div>
  );
}
