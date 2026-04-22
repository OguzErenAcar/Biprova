"use client";

import { LottieIcon } from "@/components/shared/lottie-icon";
import { ContentHeader } from "@/components/shared/content-header";
import shareArrow from "@/app/icons/wired-outline-259-share-arrow-hover-pointing.json";

export function CreateProjectTopbar() {
  return (
    <ContentHeader title="Biprova Oluştur.">
      <button
        type="submit"
        form="create-project-form"
        className="text-white bg-ink-muted border border-black mr-1  rounded-[10px] font-nunito font-extrabold text-sm px-3 py-[0.2rem] cursor-pointer flex items-center gap-1 shadow-[0_4px_12px_rgba(37,99,235,0.25)] transition-all hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(37,99,235,0.35)] disabled:opacity-60 disabled:cursor-not-allowed">
        <LottieIcon animationData={shareArrow} size={20} className="brightness-0 invert" />
        Yayınla
      </button>
    </ContentHeader>
  );
}
