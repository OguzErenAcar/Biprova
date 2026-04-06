"use client";

import { useState } from "react";
import { TeamBar } from "@/components/shared/team-bar";
import { RoleJoinButton } from "@/features/applications/components/apply-button";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

type ProjectStatus = "open" | "almost" | "full";

interface Role {
  id: string;
  name: string;
  filled: boolean;
  skills: string[];
}

interface ProjectCardProps {
  projectId: string;
  isOwnProject: boolean;
  city: string;
  isRemote?: boolean;
  status: ProjectStatus;
  category: string;
  postedAt: string;
  title: string;
  description: string;
  poster: { id: string; name: string; initials: string; color: string };
  roles: Role[];
}

const STATUS_STYLES: Record<ProjectStatus, string> = {
  open: "bg-green-100 text-green-700",
  almost: "bg-amber-100 text-amber-700",
  full: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<ProjectStatus, string> = {
  open: "Açık",
  almost: "Neredeyse Doldu",
  full: "Doldu",
};

export function ProjectCard({
  projectId,
  isOwnProject,
  city,
  isRemote,
  status,
  category,
  postedAt,
  title,
  description,
  poster,
  roles,
}: ProjectCardProps) {
  const [rolesOpen, setRolesOpen] = useState(false);

  const filled = roles.filter((r) => r.filled).length;
  const total = roles.length;

  const openRoles = roles.filter((r) => !r.filled);
  const filledRoles = roles.filter((r) => r.filled);

  return (
    <div
      id={`project-card-${projectId}`}
      className="bg-white border-[1.5px] border-slate-200 rounded-2xl p-[1.4rem] mb-4 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-all duration-150 cursor-pointer"
    >
      {/* Üst satır: etiketler + zaman */}

      <div className="flex items-center justify-between mb-4">
        <Link
          href={`/dashboard/profile/${poster.id}`}
          className="flex items-center gap-2 hover:opacity-75 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] font-nunito font-black text-white flex-shrink-0"
            style={{ background: poster.color }}
          >
            {poster.initials}
          </div>
          <span className="text-[0.8rem] font-semibold text-slate-900">
            {poster.name}
          </span>
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[0.72rem] font-bold px-[0.65rem] py-[0.25rem] rounded-full bg-blue-50 text-blue-600">
            {isRemote ? "🌐 Remote" : `📍 ${city}`}
          </span>
          <span
            className={`text-[0.72rem] font-bold px-[0.65rem] py-[0.25rem] rounded-full ${STATUS_STYLES[status]}`}
          >
            {STATUS_LABELS[status]}
          </span>
        </div>
      </div>

      {/* Başlık */}
      <div className="font-nunito font-black text-[1.05rem] leading-[1.3] text-slate-900 mb-[0.35rem]">
        {title}
      </div>

      {/* Açıklama */}
      <div className="text-[0.84rem] text-slate-500 mb-4 leading-[1.55]">
        {description}
      </div>

      {/* Açan kişi */}

      {/* Aranan pozisyonlar */}
      {openRoles.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setRolesOpen((prev) => !prev)}
            className="flex items-center justify-between w-full mb-2 group"
          >
            <p className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider">
              Aranan Pozisyonlar ({openRoles.length})
            </p>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${rolesOpen ? "rotate-180" : ""}`}
            />
          </button>
          {rolesOpen && (
            <div className="flex flex-col gap-2">
              {openRoles.map((role, i) => (
                <div
                  key={i}
                  className="rounded-xl border-[1.5px] border-amber-100 bg-amber-50/50 px-3 py-2.5 flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                      <span className="text-[0.82rem] font-bold text-slate-700">
                        {role.name}
                      </span>
                    </div>
                  </div>
                  {!isOwnProject && (
                    <RoleJoinButton projectId={projectId} roleId={role.id} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dolu roller */}
      {filledRoles.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {filledRoles.map((role, i) => (
            <span
              key={i}
              className="text-[0.72rem] font-semibold px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
              {role.name}
            </span>
          ))}
        </div>
      )}

      {/* Ekip doluluk barı */}
      <div className="mb-4">
        <TeamBar filled={filled} total={total} />
      </div>
    </div>
  );
}
