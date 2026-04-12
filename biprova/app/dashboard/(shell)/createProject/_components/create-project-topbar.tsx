"use client";

import { ContentHeader } from "@/components/shared/content-header";

export function CreateProjectTopbar() {
  return (
    <ContentHeader title="Proje Oluştur">
      <button
        type="submit"
        form="create-project-form"
        className="text-white border rounded-[10px] font-nunito font-extrabold text-[0.88rem] px-5 py-[0.6rem] cursor-pointer flex items-center gap-1.5 shadow-[0_4px_12px_rgba(37,99,235,0.25)] transition-all hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(37,99,235,0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Yayınla
      </button>
    </ContentHeader>
  );
}
