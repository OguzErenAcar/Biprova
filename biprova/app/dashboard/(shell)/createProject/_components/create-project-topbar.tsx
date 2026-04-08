"use client";

import { useRouter } from "next/navigation";

export function CreateProjectTopbar() {
  const router = useRouter();

  return (
    <div id="create-project-topbar" className="bg-slate-100/90 backdrop-blur-md border-b border-edge sm:px-6 lg:px-8 py-[0.9rem] flex items-center gap-4 px-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="w-9 h-9 rounded-[9px] border border-edge bg-canvas text-ink flex items-center justify-center hover:bg-slate-50 transition-colors"
      >
        ←
      </button>

      <span className="font-nunito font-black text-title text-ink">
        ✨ Proje Oluştur
      </span>

      <div className="ml-auto">
        <button
          type="submit"
          form="create-project-form"
          className="font-nunito font-extrabold bg-brand text-white px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-brand hover:-translate-y-px hover:shadow-brand-lg transition-all"
        >
          🚀 Yayınla
        </button>
      </div>
    </div>
  );
}
