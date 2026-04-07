"use client";

import { useState, useTransition } from "react";
import { saveProfileVisibility, VisibilitySection } from "@/features/users/actions";
import { Button } from "@/components/ui/button";

interface VisibilityToggleProps {
  section: VisibilitySection;
  initialValue: boolean;
}

export function VisibilityToggle({ section, initialValue }: VisibilityToggleProps) {
  const [isPublic, setIsPublic] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const next = !isPublic;
    setIsPublic(next);
    startTransition(async () => {
      await saveProfileVisibility(section, next);
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      title={isPublic ? "Herkese açık" : "Gizli"}
      className={`gap-1.5 text-meta font-semibold h-auto px-2.5 py-1 rounded-[8px] transition-colors ${
        isPublic
          ? "bg-success-surface text-success border-success-surface hover:bg-success-surface hover:text-success"
          : "bg-slate-100 text-ink-muted border-edge hover:bg-slate-200 hover:text-ink-muted"
      }`}
    >
      {isPublic ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
          </svg>
          Herkese açık
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
          Gizli
        </>
      )}
    </Button>
  );
}
