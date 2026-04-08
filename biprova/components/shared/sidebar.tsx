"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import homeIcon from "@/app/icons/home.json";
import postsIcon from "@/app/icons/wired-outline-56-document-hover-swipe.json";
import createIcon from "@/app/icons/wired-outline-2844-magic-wand-hover-pinch.json";
import newsIcon from "@/app/icons/wired-outline-3090-document-letter-hover-pinch.json";
import profileIcon from "@/app/icons/wired-outline-268-avatar-man-hover-glance.json";
import folderIcon from "@/app/icons/wired-outline-1356-wooden-box-hover-pinch.json";

interface SidebarUser {
  name: string;
  role: string;
  initials: string;
}

interface SidebarProject {
  id: string;
  title: string;
  status: "open" | "full" | "active" | "completed" | "cancelled";
}

interface SidebarProps {
  user?: SidebarUser;
  projects?: SidebarProject[];
}

const NAV_MAIN = [
  { href: "/dashboard", animationData: homeIcon, label: "Ana Sayfa", exact: true },
  { href: "/dashboard/posts/teams", animationData: postsIcon, label: "Gönderiler" },
  { href: "/dashboard/createProject", animationData: createIcon, label: "Proje Oluştur" },
  { href: "/dashboard/posts/news", animationData: newsIcon, label: "Haberler" },
  { href: "/dashboard/profile", animationData: profileIcon, label: "Profilim" },
];

const STATUS_CONFIG: Record<
  SidebarProject["status"],
  { label: string; className: string }
> = {
  open:      { label: "Açık",       className: "text-blue-600 bg-blue-50 border-blue-100" },
  full:      { label: "Dolu",       className: "text-amber-600 bg-amber-50 border-amber-100" },
  active:    { label: "Aktif",      className: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  completed: { label: "Tamamlandı", className: "text-slate-400 bg-slate-100 border-slate-200" },
  cancelled: { label: "İptal",      className: "text-red-400 bg-red-50 border-red-100" },
};

function NavItem({
  href,
  animationData,
  label,
  isActive,
}: {
  href: string;
  animationData: object;
  label: string;
  exact?: boolean;
  isActive: boolean;
}) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  return (
    <Link
      href={href}
      className={`flex items-center gap-[0.65rem] px-3 py-[0.65rem] rounded-[10px] text-body font-semibold mb-0.5 transition-all duration-150 no-underline ${
        isActive
          ? "bg-blue-50 text-slate-600"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-600"
      }`}
      onMouseEnter={() => lottieRef.current?.play()}
      onMouseLeave={() => lottieRef.current?.stop()}
    >
      <span className="w-6 h-6 shrink-0">
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={false}
          autoplay={false}
          style={{ width: 24, height: 24 }}
        />
      </span>
      {label}
    </Link>
  );
}

function ProjectNavItem({ project, isActive }: { project: SidebarProject; isActive: boolean }) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold mb-0.5 transition-colors no-underline min-w-0 ${
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-600"
      }`}
      onMouseEnter={() => lottieRef.current?.play()}
      onMouseLeave={() => lottieRef.current?.stop()}
    >
      <span className="w-5 h-5 shrink-0">
        <Lottie
          lottieRef={lottieRef}
          animationData={folderIcon}
          loop={false}
          autoplay={false}
          style={{ width: 20, height: 20 }}
        />
      </span>
      <span className="truncate">{project.title.substring(0, 19) + "..."}</span>
      <StatusBadge status={project.status} />
    </Link>
  );
}

function StatusBadge({ status }: { status: SidebarProject["status"] }) {
  const { label, className } = STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={`ml-auto text-label font-bold flex-shrink-0 ${className}`}>
      {label}
    </Badge>
  );
}

export function Sidebar({ projects = [] }: SidebarProps) {
  const pathname = usePathname();
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [savedOpen, setSavedOpen] = useState(true);

  function isActive(href: string, exact?: boolean) {
    return exact
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <div
      id="dashboard-sidebar"
      className="bg-surface border border-slate-200 rounded-2xl shadow-sm flex-col sticky top-4 z-30 px-4 py-6 hidden lg:flex"
    >
      {/* Ana navigasyon */}
      <nav>
        {NAV_MAIN.map(({ href, animationData, label, exact }) => (
          <NavItem
            key={href}
            href={href}
            animationData={animationData}
            label={label}
            exact={exact}
            isActive={isActive(href, exact)}
          />
        ))}
      </nav>

      <Separator className="my-4" />

      {/* Projelerim */}
      <button
        onClick={() => setProjectsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-3 mb-1.5 group"
      >
        <span className="text-label font-bold tracking-[2px] uppercase text-slate-600">
          Projelerim
        </span>
        <svg
          className={`w-3 h-3 text-slate-600 transition-transform duration-200 ${projectsOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {projectsOpen && (
        <nav>
          {projects.length === 0 ? (
            <div className="px-3 py-2 text-caption text-slate-600">
              Henüz proje yok
            </div>
          ) : (
            projects.map((project) => (
              <ProjectNavItem
                key={project.id}
                project={project}
                isActive={isActive(`/dashboard/projects/${project.id}`)}
              />
            ))
            ))
          )}
        </nav>
      )}

      {/* Kaydettiklerim */}
      <button
        onClick={() => setSavedOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-3 mt-4 mb-1.5 group"
      >
        <span className="text-label font-bold tracking-[2px] uppercase text-slate-600">
          Kaydettiklerim
        </span>
        <svg
          className={`w-3 h-3 text-slate-600 transition-transform duration-200 ${savedOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {savedOpen && (
        <nav>
          <div className="px-3 py-2 text-caption text-slate-600">
            Henüz kaydedilen yok
          </div>
        </nav>
      )}
    </div>
  );
}
