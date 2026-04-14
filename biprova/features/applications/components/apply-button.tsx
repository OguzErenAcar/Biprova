"use client";

import { useState, useTransition } from "react";
import { notify } from "@/lib/notify";
import { applyToProject } from "@/features/applications/actions";

interface RoleJoinButtonProps {
  projectId: string;
  roleId: string;
}

export function RoleJoinButton({ projectId, roleId }: RoleJoinButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <span className="text-meta font-extrabold text-success whitespace-nowrap">
        ✓ Başvuruldu
      </span>
    );
  }

  return (
    <div className="flex  flex-col items-end gap-0.5 flex-shrink-0">
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const result = await applyToProject(projectId, roleId);
            if (result.error) {
              notify.error(result.error);
            } else {
              setDone(true);
            }
          })
        }
          // open: "bg-success-surface text-success border-success-surface",

        className=" bg-brand-surface font-semibold text-success hover:text-black hover:border-black rounded-lg text-xs px-3 py-1.5 cursor-pointer   transition-colors duration-150 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "…" : "Başvur →"}
      </button>
    </div>
  );
}
