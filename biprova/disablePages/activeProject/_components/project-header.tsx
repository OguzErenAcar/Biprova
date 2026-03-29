"use client";

import { useState } from "react";

interface Member {
  initials: string;
  gradient: string;
  online: boolean;
  title: string;
}

const members: Member[] = [
  { initials: "ZK", gradient: "from-blue-600 to-indigo-500", online: true, title: "Zeynep K. — Lider" },
  { initials: "SK", gradient: "from-cyan-600 to-green-500", online: true, title: "Selin K. — Frontend Dev" },
  { initials: "AY", gradient: "from-violet-700 to-pink-500", online: false, title: "Ali Y. — Backend Dev" },
  { initials: "MB", gradient: "from-amber-500 to-red-500", online: true, title: "Merve B. — UI Tasarımcı" },
];

function MemberAvatar({ member, first }: { member: Member; first: boolean }) {
  return (
    <div
      className={`relative w-7 h-7 rounded-full flex items-center justify-center font-nunito font-black text-[0.65rem] text-white border-2 border-white ${!first ? "-ml-[7px]" : ""} shrink-0 cursor-pointer transition-transform hover:-translate-y-0.5 bg-gradient-to-br ${member.gradient}`}
      title={member.title}
    >
      {member.initials}
      {member.online && (
        <span className="absolute bottom-0 right-0 w-[7px] h-[7px] bg-green-500 rounded-full border-[1.5px] border-white" />
      )}
    </div>
  );
}

export function ProjectHeader() {
  const [gearOpen, setGearOpen] = useState(false);

  return (
    <header id="active-project-header" className="bg-white border-b border-slate-200 px-5 py-[0.8rem] flex items-center gap-[0.85rem] shrink-0">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-[11px] flex items-center justify-center text-[1.15rem] shrink-0">
        📱
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-nunito font-black text-[0.95rem] text-slate-900 truncate">
          Sokak Hayvanları Takip Uygulaması
        </div>
        <div className="text-[0.7rem] text-slate-400 mt-[0.08rem]">
          Mobil Uygulama · İstanbul
        </div>
      </div>

      <div className="flex items-center shrink-0">
        {members.map((m, i) => (
          <MemberAvatar key={m.initials} member={m} first={i === 0} />
        ))}
      </div>

      <div className="flex flex-col items-center shrink-0">
        <div className="text-[0.58rem] font-bold uppercase tracking-[1px] text-slate-400 mb-[0.1rem]">
          Kickoff&apos;a kalan
        </div>
        <div className="font-nunito font-black text-[1.15rem] tracking-[1px] text-red-500 animate-pulse">
          18:42:07
        </div>
      </div>

      <div className="flex items-center gap-[0.45rem] shrink-0">
        <button className="bg-blue-600 text-white border-none rounded-[9px] py-[0.45rem] px-[0.9rem] font-['Plus_Jakarta_Sans'] font-bold text-[0.8rem] cursor-pointer flex items-center gap-[0.35rem] transition-all hover:bg-blue-700 hover:-translate-y-px">
          🚀 Kickoff&apos;u Başlat
        </button>

        <div className="relative">
          <button
            onClick={() => setGearOpen(!gearOpen)}
            className={`w-[34px] h-[34px] border-[1.5px] rounded-[9px] flex items-center justify-center text-[0.95rem] cursor-pointer transition-all ${
              gearOpen
                ? "border-blue-600 bg-blue-50"
                : "bg-slate-50 border-slate-200 hover:border-blue-600 hover:bg-blue-50"
            }`}
          >
            ⚙️
          </button>

          {gearOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 bg-white border-[1.5px] border-slate-200 rounded-[14px] shadow-[0_8px_28px_rgba(0,0,0,0.1)] min-w-[195px] z-50 overflow-hidden">
              <div className="text-[0.6rem] font-bold tracking-[1.5px] uppercase text-slate-300 px-[0.9rem] pt-[0.6rem] pb-[0.25rem]">
                Lider İşlemleri
              </div>
              <a href="#" className="flex items-center gap-[0.55rem] px-[0.9rem] py-[0.55rem] text-[0.82rem] font-semibold text-slate-900 cursor-pointer hover:bg-slate-50 no-underline">
                <span className="text-[0.9rem] w-[18px] text-center">🚀</span> Kickoff&apos;u Başlat
              </a>
              <div className="h-px bg-slate-200 my-1" />
              <div className="text-[0.6rem] font-bold tracking-[1.5px] uppercase text-slate-300 px-[0.9rem] pt-[0.6rem] pb-[0.25rem]">
                Ekip
              </div>
              <a href="#" className="flex items-center gap-[0.55rem] px-[0.9rem] py-[0.55rem] text-[0.82rem] font-semibold text-slate-900 cursor-pointer hover:bg-slate-50 no-underline">
                <span className="text-[0.9rem] w-[18px] text-center">👥</span> Üyeleri Yönet
              </a>
              <div className="h-px bg-slate-200 my-1" />
              <a href="#" className="flex items-center gap-[0.55rem] px-[0.9rem] py-[0.55rem] text-[0.82rem] font-semibold text-red-500 cursor-pointer hover:bg-red-50 no-underline">
                <span className="text-[0.9rem] w-[18px] text-center">💣</span> Ekibi Dağıt
              </a>
              <a href="#" className="flex items-center gap-[0.55rem] px-[0.9rem] py-[0.55rem] text-[0.82rem] font-semibold text-red-500 cursor-pointer hover:bg-red-50 no-underline">
                <span className="text-[0.9rem] w-[18px] text-center">🚪</span> Ekipten Ayrıl
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
