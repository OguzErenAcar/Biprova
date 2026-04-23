"use client";

import { useState } from "react";
import { TeamBar } from "@/components/shared/team-bar";
import { ChevronDown } from "lucide-react";

interface Role {
  id: string;
  role_name: string;
  is_filled: boolean;
  filled_by_name: string | null;
}

interface TeamBarSectionProps {
  roles: Role[];
  leaderName: string;
}

export function TeamBarSection({ roles, leaderName }: TeamBarSectionProps) {
  const [open, setOpen] = useState(false);
  const filled = roles.filter((r) => r.is_filled).length;

  return (
    <div className="bg-white border-x border-b border-slate-200 rounded-b-2xl px-[1.8rem] py-[1rem]">
      <TeamBar filled={filled} total={roles.length} />
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 mt-[0.6rem] text-[0.72rem] text-slate-400 hover:text-slate-600 transition-colors"
      >
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        {open ? "Rolleri gizle" : "Rolleri göster"}
      </button>
      {open && (
        <div className="mt-[0.4rem]">
          <div className="flex items-center gap-2 mt-[0.6rem]">
            <div className="w-2 h-2 rounded-full shrink-0 bg-blue-500" />
            <span className="text-[0.75rem] text-slate-700 font-semibold">Lider</span>
            <span className="text-[0.72rem] text-slate-400 ml-auto">{leaderName}</span>
          </div>
          {roles.map((r) => (
            <div key={r.id} className="flex items-center gap-2 mt-[0.6rem]">
              <div className={`w-2 h-2 rounded-full shrink-0 ${r.is_filled ? "bg-blue-500" : "bg-slate-200"}`} />
              <span className={`text-[0.75rem] ${r.is_filled ? "text-slate-700 font-semibold" : "text-slate-400"}`}>
                {r.role_name}
              </span>
              {r.is_filled && r.filled_by_name && (
                <span className="text-[0.72rem] text-slate-400 ml-auto">{r.filled_by_name}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
