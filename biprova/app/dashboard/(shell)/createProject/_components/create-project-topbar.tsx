"use client";

import { Rocket } from "lucide-react";
import { ContentHeader } from "@/components/shared/content-header";

export function CreateProjectTopbar() {
  return (
    <ContentHeader title="Biprova Oluştur.">
      <button
        type="submit"
        form="create-project-form"
        className="text-white bg-ink-muted border border-black mr-1  rounded-[10px] font-nunito font-extrabold text-sm px-3 py-[0.2rem] cursor-pointer flex items-center gap-1.5 shadow-[0_4px_12px_rgba(37,99,235,0.25)] transition-all hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(37,99,235,0.35)] disabled:opacity-60 disabled:cursor-not-allowed">
        <Rocket size={14} className="text-white" />
        Yayınla
      </button>
    </ContentHeader>
  );
}
