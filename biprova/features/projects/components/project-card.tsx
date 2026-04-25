"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TeamBar } from "@/components/shared/team-bar";
import { UserAvatar } from "@/components/shared/user-avatar";
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
  distanceKm?: number;
  poster: {
    id: string;
    name: string;
    initials: string;
    color: string;
    badge: string | null;
  };
  roles: Role[];
  defaultOpen?: boolean;
  disableNavigation?: boolean;
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
  distanceKm,
  poster,
  roles,
  defaultOpen = false,
  disableNavigation = false,
}: ProjectCardProps) {
  const router = useRouter();
  const [rolesOpen, setRolesOpen] = useState(defaultOpen);

  const [desOpen, setDesOpen] = useState(false);

  const filled = roles.filter((r) => r.filled).length;
  const total = roles.length;
  const openRoles = roles.filter((r) => !r.filled);

  return (
    <Card
      id={`project-card-${projectId}`}
      className="mb-3.5 hover:-translate-y-0.5 transition-all duration-150"
    >
      <CardContent className="px-3">
        {/* Üst satır: poster + etiketler */}
        <div className="flex items-center justify-between  mb-1 sm:mb-4">
          <Link
            href={`/dashboard/profile/${poster.id}`}
            className="flex items-center gap-2 hover:opacity-75 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <UserAvatar
              initials={poster.initials}
              badge={poster.badge}
              size={28}
              className="text-[0.72rem]"
            />
            <span className=" text-ink-muted">{poster.name}</span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end ">
            <Badge
              variant="outline"
              className="bg-brand-surface text-gray-800 border-brand-surface font-bold text-[0.7rem] sm:text-xs px-2 sm:px-2"
            >
              {isRemote ? "Uzaktan" : `${city}`}
            </Badge>
            {distanceKm !== undefined && (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-600 border-blue-100 font-bold text-[0.7rem] sm:text-xs px-2 sm:px-2"
              >
                ~{distanceKm} km
              </Badge>
            )}
            <Badge
              variant="outline"
              className={`font-bold text-[0.7rem] sm:text-xs px-2 sm:px-2 ${STATUS_STYLES[status]}`}
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
          <div className="flex justify-between font-semibold text-ink text-xl md:text-2xl mt-2">
            {title}

            <ChevronDown
              className={` w-3.5  h-3.5 my-auto  transition-transform duration-200 ${desOpen ? "rotate-180" : ""}`}
            />
          </div>
        </button>

        {/* Açıklama */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out text-justify sm:text-body text-md md:text-lg text-ink-muted ${
            desOpen
              ? "max-h-[400px] opacity-100 mt-2 sm:mb-4"
              : "max-h-0 opacity-0"
          }`}
        >
          {description}
        </div>

        {/* Aranan pozisyonlar */}
        {openRoles.length > 0 && (
          <div className="mb-1 sm:mb-4">
            <div className="flex items-center justify-between mt-5">
              <button
                onClick={() => setRolesOpen((prev) => !prev)}
                className="flex items-center gap-2 px-0 h-auto hover:bg-transparent"
              >
                <Users className="w-4 h-4 text-[#3764ec]" />
                <span className="text-sm font-semibold text-[#3764ec]">
                  Aranan Pozisyonlar
                </span>
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#3764ec] text-white text-[0.65rem] font-bold">
                  {openRoles.length}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#3764ec] transition-transform duration-300 ${rolesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {!disableNavigation && (
                <button
                  onClick={() =>
                    router.push(`/dashboard/posts/projects/${projectId}`)
                  }
                  className="flex items-center text-sm text-[#3764ec] font-semibold"
                >
                  Detay
                  <ChevronRight className="w-3.5 h-3.5 ms-1 text-[#3764ec]" />
                </button>
              )}
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                rolesOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="grid grid-cols-2 gap-2 py-2">
                {openRoles.map((role, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 rounded-xl bg-blue-50/60 border border-blue-100 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#3764ec]/10 flex items-center justify-center">
                        <span className="text-[0.6rem] font-bold text-[#3764ec]">
                          {i + 1}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-ink leading-tight truncate">
                        {role.name}
                      </span>
                    </div>
                    {!isOwnProject && (
                      <RoleJoinButton projectId={projectId} roleId={role.id} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ekip doluluk barı */}
        <div className="">
          <TeamBar filled={filled} total={total} />
        </div>
      </CardContent>
    </Card>
  );
}
