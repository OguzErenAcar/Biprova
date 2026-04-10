"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TeamBar } from "@/components/shared/team-bar";
import { RoleJoinButton } from "@/features/applications/components/apply-button";

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
  open: "bg-success-surface text-success border-success-surface",
  almost: "bg-warning-surface text-warning border-warning-surface",
  full: "bg-danger-surface text-danger border-danger-surface",
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
  title,
  description,
  poster,
  roles,
}: ProjectCardProps) {
  const [rolesOpen, setRolesOpen] = useState(false);
  const [desOpen, setDesOpen] = useState(false);

  const filled = roles.filter((r) => r.filled).length;
  const total = roles.length;
  const openRoles = roles.filter((r) => !r.filled);

  return (
    <Card
      id={`project-card-${projectId}`}
      className="hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
    >
      <CardContent className="px-3 sm:p-[1.4rem]">
        {/* Üst satır: poster + etiketler */}
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <Link
            href={`/dashboard/profile/${poster.id}`}
            className="flex items-center gap-2 hover:opacity-75 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar className="w-6 h-6 flex-shrink-0">
              <AvatarFallback
                className="text-label text-white"
                style={{ backgroundColor: poster.color }}
              >
                {poster.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-caption font-semibold text-ink">
              {poster.name}
            </span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
            <Badge
              variant="outline"
              className="bg-brand-surface text-brand border-brand-surface font-bold text-[0.7rem] sm:text-xs px-1.5 sm:px-2"
            >
              {isRemote ? "🌐 Remote" : `📍 ${city}`}
            </Badge>
            <Badge
              variant="outline"
              className={`font-bold text-[0.7rem] sm:text-xs px-1.5 sm:px-2 ${STATUS_STYLES[status]}`}
            >
              {STATUS_LABELS[status]}
            </Badge>
          </div>
        </div>

        {/* Başlık */}
        <button
          className="hover:bg-transparent w-full"
          onClick={() => setDesOpen(!desOpen)}
        >
          <div className="flex justify-between font-nunito font-black text-[1rem] sm:text-title leading-[1.3] text-ink mb-1 sm:mb-[0.35rem]">
            {title}

            <ChevronDown
              className={` w-4.5 h-4.5 text-ink transition-transform duration-200 ${desOpen ? "rotate-180" : ""}`}
            />
          </div>
        </button>

        {/* Açıklama — mobilde 2 satırla sınırlı */}
        <div className="text-[0.8rem] sm:text-body text-ink-muted mb-2 sm:mb-4 leading-[1.5] line-clamp-2 sm:line-clamp-none">
          {desOpen && description}
        </div>

        {/* Aranan pozisyonlar */}
        {openRoles.length > 0 && (
          <div className="mb-2 sm:mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRolesOpen((prev) => !prev)}
              className="w-full justify-between px-0 h-auto py-1 mb-2 hover:bg-transparent"
            >
              <div className="block border px-2 py-1 rounded-lg">
                <span className=" font-bold text-ink uppercase tracking-wider text-[0.72rem] sm:text-sm">
                  Aranan Pozisyonlar ({openRoles.length})
                </span>
              </div>
            </Button>
            {rolesOpen && (
              <div className="flex flex-col gap-1.5 sm:gap-2">
                {openRoles.map((role, i) => (
                  <div
                    key={i}
                    className="rounded-xl text-black px-3 py-2 sm:py-2.5 flex items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-caption text-ink-muted">
                        {role.name}
                      </span>
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

        {/* Ekip doluluk barı */}
        <div className="mb-0">
          <TeamBar filled={filled} total={total} />
        </div>
      </CardContent>
    </Card>
  );
}
