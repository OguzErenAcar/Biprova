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
      <span className="text-[0.75rem] font-extrabold text-green-600 whitespace-nowrap">
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
        className="bg-blue-600 text-white rounded-lg font-nunito font-extrabold text-[0.75rem] px-3 py-1.5 cursor-pointer hover:bg-blue-700 transition-colors duration-150 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "…" : "Katıl →"}
      </button>
      {error && (
        <span className="text-[0.68rem] text-red-500 font-semibold text-right">{error}</span>
      )}
    </div>
  );
}
