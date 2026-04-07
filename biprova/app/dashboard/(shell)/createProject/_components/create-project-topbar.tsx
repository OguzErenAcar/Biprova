"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CreateProjectTopbar() {
  const router = useRouter();

  return (
    <div id="create-project-topbar" className="bg-slate-100/90 backdrop-blur-md border-b border-edge sm:px-6 lg:px-8 py-[0.9rem] flex items-center gap-4 px-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.back()}
        className="rounded-[9px]"
      >
        ←
      </Button>

      <span className="font-nunito font-black text-title text-ink">
        ✨ Proje Oluştur
      </span>

      <div className="ml-auto">
        <Button
          type="submit"
          form="create-project-form"
          className="font-nunito font-extrabold gap-1.5 shadow-brand hover:-translate-y-px hover:shadow-brand-lg"
        >
          🚀 Yayınla
        </Button>
      </div>
    </div>
  );
}
