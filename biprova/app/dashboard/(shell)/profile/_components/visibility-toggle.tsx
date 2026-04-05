"use client";

import { useTransition } from "react";
import { saveProjectsPublic, saveApplicationsPublic } from "@/features/users/actions";

interface VisibilityToggleProps {
  isPublic: boolean;
  section: "projects" | "applications";
}

export function VisibilityToggle({ isPublic, section }: VisibilityToggleProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const newValue = !isPublic;
    startTransition(async () => {
      if (section === "projects") {
        await saveProjectsPublic(newValue);
      } else {
        await saveApplicationsPublic(newValue);
      }
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      title={isPublic ? "Herkese açık — gizlemek için tıkla" : "Gizli — herkese açmak için tıkla"}
      className={`flex items-center gap-1.5 text-[0.75rem] font-semibold px-2.5 py-1 rounded-[8px] border transition-colors disabled:opacity-50 ${
        isPublic
          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
      }`}
    >
      {isPublic ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
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
    </button>
  );
}
