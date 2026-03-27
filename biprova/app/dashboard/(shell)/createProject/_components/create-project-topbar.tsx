"use client";

import { useRouter } from "next/navigation";

export function CreateProjectTopbar() {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-40 bg-slate-100/90 backdrop-blur-[12px] border-b border-slate-200 px-8 py-[0.9rem] flex items-center gap-4">
      <button
        onClick={() => router.back()}
        className="w-9 h-9 rounded-[9px] bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-base cursor-pointer transition-colors hover:border-blue-600"
      >
        ←
      </button>

      <span className="font-nunito font-black text-[1.1rem] text-slate-900">
        ✨ Proje Oluştur
      </span>

      <div className="ml-auto flex items-center gap-2.5">
        <button className="bg-white text-slate-400 border-[1.5px] border-slate-200 rounded-[10px] font-nunito font-extrabold text-[0.86rem] px-4 py-[0.55rem] cursor-pointer transition-all hover:border-blue-600 hover:text-blue-600">
          Taslak Kaydet
        </button>
        <button className="bg-blue-600 text-white border-none rounded-[10px] font-nunito font-extrabold text-[0.88rem] px-5 py-[0.6rem] cursor-pointer flex items-center gap-1.5 shadow-[0_4px_12px_rgba(37,99,235,0.25)] transition-all hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(37,99,235,0.35)]">
          🚀 Yayınla
        </button>
      </div>
    </div>
  );
}
