"use client";

import { useState, useTransition } from "react";
import { applyToProject } from "@/features/applications/actions";

interface RoleJoinButtonProps {
  projectId: string;
  roleId: string;
}

export function RoleJoinButton({ projectId, roleId }: RoleJoinButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (done) {
    return (
      <span className="text-meta font-extrabold text-success whitespace-nowrap">
        ✓ Başvuruldu
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const result = await applyToProject(projectId, roleId);
            if (result.error) {
              setError(result.error);
            } else {
              setDone(true);
            }
          })
        }
        className="bg-brand text-white rounded-lg font-nunito font-extrabold text-meta px-3 py-1.5 cursor-pointer hover:bg-brand-hover transition-colors duration-150 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "…" : "Başvur →"}
      </button>
      {error && (
        <span className="text-label text-danger font-semibold text-right">{error}</span>
      )}
    </div>
  );
}
