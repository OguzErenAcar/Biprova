"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1 text-ink-muted mb-4 hover:text-ink transition-colors"
    >
      <ChevronLeft className="w-4 h-4" />
      <span className="text-sm">Geri</span>
    </button>
  );
}
