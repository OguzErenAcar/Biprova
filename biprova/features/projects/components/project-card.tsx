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
  poster: { id: string; name: string; initials: string;color:string  };
  roles: Role[];
}

const STATUS_STYLES: Record<ProjectStatus, string> = {
  open:   "bg-success-surface text-success border-success-surface",
  almost: "bg-warning-surface text-warning border-warning-surface",
  full:   "bg-danger-surface text-danger border-danger-surface",
};

const STATUS_LABELS: Record<ProjectStatus, string> = {
  open:   "Açık",
  almost: "Neredeyse Doldu",
  full:   "Doldu",
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

  const filled = roles.filter((r) => r.filled).length;
  const total = roles.length;
  const openRoles = roles.filter((r) => !r.filled);
  const filledRoles = roles.filter((r) => r.filled);

  return (
    <Card
      id={`project-card-${projectId}`}
      className="hover:-translate-y-0.5   transition-all duration-150 cursor-pointer"
    >
      <CardContent className="p-[1.4rem]">
        {/* Üst satır: poster + etiketler */}
        <div className="flex items-center justify-between mb-4">
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

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-brand-surface text-brand border-brand-surface font-bold">
              {isRemote ? "🌐 Remote" : `📍 ${city}`}
            </Badge>
            <Badge variant="outline" className={`font-bold ${STATUS_STYLES[status]}`}>
              {STATUS_LABELS[status]}
            </Badge>
          </div>
        </div>

        {/* Başlık */}
        <div className="font-nunito font-black text-title leading-[1.3] text-ink mb-[0.35rem]">
          {title}
        </div>

        {/* Açıklama */}
        <div className="text-body text-ink-muted mb-4 leading-[1.55]">
          {description}
        </div>

        {/* Aranan pozisyonlar */}
        {openRoles.length > 0 && (
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRolesOpen((prev) => !prev)}
              className="w-full justify-between px-0 h-auto py-1 mb-2 hover:bg-transparent"
            >
              <span className="text-label font-bold text-ink-subtle uppercase tracking-wider">
                Aranan Pozisyonlar ({openRoles.length})
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-ink-subtle transition-transform duration-200 ${rolesOpen ? "rotate-180" : ""}`}
              />
            </Button>
            {rolesOpen && (
              <div className="flex flex-col gap-2">
                {openRoles.map((role, i) => (
                  <div
                    key={i}
                    className="rounded-xl border-[1.5px] border-warning-surface bg-warning-surface/50 px-3 py-2.5 flex items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-warning flex-shrink-0" />
                        <span className="text-caption font-bold text-ink-muted">
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
              <Badge
                key={i}
                variant="outline"
                className="bg-success-surface text-success border-success-surface font-semibold gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
                {role.name}
              </Badge>
            ))}
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
