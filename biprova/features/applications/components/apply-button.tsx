"use client";

import { useState, useTransition } from "react";
import { applyToProject } from "@/features/applications/actions";

interface OpenRole {
  id: string;
  name: string;
  skills: string[];
}

interface ApplyButtonProps {
  projectId: string;
  openRoles: OpenRole[];
}

type State = "idle" | "selecting" | "submitting" | "success" | "error";

export function ApplyButton({ projectId, openRoles }: ApplyButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleApply(roleId: string) {
    setState("submitting");
    startTransition(async () => {
      const result = await applyToProject(projectId, roleId);
      if (result.error) {
        setErrorMsg(result.error);
        setState("error");
      } else {
        setState("success");
      }
    });
  }

  if (state === "success") {
    return (
      <span id={`apply-${projectId}`} className="text-[0.84rem] font-nunito font-extrabold text-green-600 px-5 py-[0.55rem]">
        ✓ Başvuruldu
      </span>
    );
  }

  if (state === "idle") {
    return (
      <button
        id={`apply-${projectId}`}
        onClick={() => setState("selecting")}
        className="bg-blue-600 text-white border-none rounded-lg font-nunito font-extrabold text-[0.84rem] px-5 py-[0.55rem] cursor-pointer hover:bg-blue-700 transition-colors duration-150"
      >
        Başvur →
      </button>
    );
  }

  return (
    <div id={`apply-${projectId}`} className="flex flex-col gap-2 w-full">
      <p className="text-[0.72rem] font-bold text-slate-400 uppercase tracking-wider">
        Hangi pozisyon için başvuruyorsun?
      </p>
      <div className="flex flex-col gap-2">
        {openRoles.map((role) => (
          <button
            key={role.id}
            disabled={state === "submitting"}
            onClick={() => handleApply(role.id)}
            className="text-left rounded-xl border-[1.5px] border-slate-200 px-3 py-2.5 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 group-hover:bg-blue-500 transition-colors" />
              <span className="text-[0.82rem] font-bold text-slate-700 group-hover:text-blue-700 transition-colors">
                {role.name}
              </span>
            </div>
            {role.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {role.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setState("idle")}
          disabled={state === "submitting"}
          className="text-[0.78rem] text-slate-400 hover:text-slate-600 font-semibold transition-colors disabled:opacity-40"
        >
          İptal
        </button>
        {state === "error" && (
          <span className="text-[0.75rem] text-red-500 font-semibold">{errorMsg}</span>
        )}
      </div>
    </div>
  );
}
