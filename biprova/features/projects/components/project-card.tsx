"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  poster: { id: string; name: string; initials: string; color: string; badge: string | null };
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

  const [desOpen, setDesOpen] = useState(true);

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
            <UserAvatar initials={poster.initials} badge={poster.badge} size={28} className="text-[0.72rem]" />
            <span className=" text-ink-muted">
              {poster.name}
            </span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end ">
            <Badge
              variant="outline"
              className="bg-brand-surface text-gray-800 border-brand-surface font-bold text-[0.7rem] sm:text-xs px-2 sm:px-2"
            >
              {isRemote ? "Remote" : `${city}`}
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

        {/* Açıklama — mobilde 2 satırla sınırlı */}
        <div className=" text-justify sm:text-body text-md md:text-lg mt-2 sm:mb-4 text-ink-muted ">
          {desOpen && description}
        </div>

        {/* Aranan pozisyonlar */}
        {openRoles.length > 0 && (
          <div className="mb-1 sm:mb-4">
            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => setRolesOpen((prev) => !prev)}
                className="justify-between px-0 h-auto hover:bg-transparent"
              >
                <div className="flex items-center text-sm md:text-lg text-ink border py-1 px-2 rounded-lg font-bold bg-white">
                  <span style={{color:"#3764ec"}}>
                    Aranan Pozisyonlar ({openRoles.length})
                  </span>
                  <ChevronDown
                    style={{color:"#3764ec"}}
                    className={`w-3.5 h-3.5 transition-transform duration-300 ms-2 ${rolesOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </button>
              {!disableNavigation && (
                <button
                  onClick={() => router.push(`/dashboard/posts/projects/${projectId}`)}
                  className="flex items-center text-sm text-ink border py-1 px-2 rounded-lg font-bold bg-white"
                >
                  <span style={{ color: "#3764ec" }}>Detay</span>
                  <ChevronRight style={{ color: "#3764ec" }} className="w-3.5 h-3.5 ms-1" />
                </button>
              )}
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                rolesOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex flex-col gap-1.5 sm:gap-2 rounded-md p-2">
                {openRoles.map((role, i) => (
                  <div className="shadow3 rounded-lg" key={i}>
                    <div className="rounded-xl border text-black px-3 py-2 sm:py-2.5 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="text-caption text-ink ">
                          {role.name}
                        </span>
                      </div>
                      {!isOwnProject && (
                        <RoleJoinButton
                          projectId={projectId}
                          roleId={role.id}
                        />
                      )}
                    </div>
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
