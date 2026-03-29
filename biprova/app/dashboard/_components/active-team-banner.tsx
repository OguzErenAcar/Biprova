const AVATARS = [
  { initials: "AK", color: "#3b82f6" },
  { initials: "ME", color: "#8b5cf6" },
  { initials: "SY", color: "#22c55e" },
  { initials: "BT", color: "#f59e0b" },
];

export function ActiveTeamBanner() {
  return (
    <div id="active-team-banner" className="bg-gradient-to-br from-blue-700 to-indigo-500 rounded-2xl px-[1.6rem] py-[1.4rem] mb-6 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center text-[1.3rem] flex-shrink-0">
          🎬
        </div>
        <div>
          <div className="font-nunito font-black text-[0.95rem] text-white mb-0.5">
            Kısa Film Projesi — Aktif Ekibindesin!
          </div>
          <div className="text-[0.8rem] text-white/70">
            İstanbul · 4 kişilik ekip · Dün kuruldu
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[0.6rem]">
        <div className="flex items-center">
          {AVATARS.map((av, i) => (
            <div
              key={i}
              className="w-[30px] h-[30px] rounded-full border-2 border-white/40 -ml-2 first:ml-0 text-[0.7rem] font-nunito font-black text-white flex items-center justify-center"
              style={{ background: av.color }}
            >
              {av.initials}
            </div>
          ))}
        </div>
        <button className="bg-white text-blue-600 border-none rounded-lg font-nunito font-extrabold text-[0.82rem] px-4 py-[0.45rem] cursor-pointer hover:bg-blue-50 transition-colors duration-150">
          Gruba Git →
        </button>
      </div>
    </div>
  );
}
