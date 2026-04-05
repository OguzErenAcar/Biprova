"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SidebarAccountActions } from "@/components/shared/sidebar-account-actions";

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
  { href: "/dashboard", icon: "🏠", label: "Ana Sayfa", exact: true },
  { href: "/dashboard/posts/teams", icon: "📝", label: "Gönderiler" },
  { href: "/dashboard/createProject", icon: "✨", label: "Proje Oluştur" },
  { href: "/dashboard/posts/news", icon: "📰", label: "Haberler" },
  { href: "/dashboard/profile", icon: "👤", label: "Profilim" },
];

function NavItem({
  href,
  icon,
  label,
  isActive,
}: {
  href: string;
  icon: string;
  label: string;
  exact?: boolean;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-[0.65rem] px-3 py-[0.65rem] rounded-[10px] text-[0.9rem] font-semibold mb-0.5 transition-all duration-150 no-underline ${
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <span className="text-[1.1rem] w-5 text-center">{icon}</span>
      {label}
    </Link>
  );
}

const STATUS_LABEL: Record<
  SidebarProject["status"],
  { label: string; className: string }
> = {
  open: { label: "Açık", className: "text-blue-600 bg-blue-50" },
  full: { label: "Dolu", className: "text-amber-600 bg-amber-50" },
  active: { label: "Aktif", className: "text-emerald-600 bg-emerald-50" },
  completed: { label: "Tamamlandı", className: "text-slate-400 bg-slate-100" },
  cancelled: { label: "İptal", className: "text-red-400 bg-red-50" },
};

function StatusBadge({ status }: { status: SidebarProject["status"] }) {
  const { label, className } = STATUS_LABEL[status];
  return (
    <span
      className={`ml-auto text-[0.65rem] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${className}`}
    >
      {label}
    </span>
  );
}

export function Sidebar({ user, projects = [] }: SidebarProps) {
  const pathname = usePathname();
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [savedOpen, setSavedOpen] = useState(true);


  function isActive(href: string, exact?: boolean) {
    return exact
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside
      id="dashboard-sidebar"
      className="w-60 bg-white border-r border-slate-200 flex flex-col fixed top-0 left-0 bottom-0 z-50 px-4 py-6 -translate-x-full lg:translate-x-0 transition-transform duration-200"
    >
      {/* Logo */}
      <Link
        href="/dashboard"
        className="font-nunito font-black text-[1.3rem] text-blue-600 px-2 mb-8 no-underline"
      >
        bir<span className="text-slate-900">prova</span>
      </Link>

      {/* Ana navigasyon */}
      <nav>
        {NAV_MAIN.map(({ href, icon, label, exact }) => (
          <NavItem
            key={href}
            href={href}
            icon={icon}
            label={label}
            exact={exact}
            isActive={isActive(href, exact)}
          />
        ))}
      </nav>

      {/* Kaydettiklerim */}
      <button
        onClick={() => setSavedOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-3 mt-4 mb-1.5 group"
      >
        <span className="text-[0.68rem] font-bold tracking-[2px] uppercase text-slate-400">
          Kaydettiklerim
        </span>
        <svg
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${savedOpen ? "rotate-180" : ""}`}
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
          <div className="px-3 py-2 text-[0.8rem] text-slate-400">
            Henüz kaydedilen yok
          </div>
        </nav>
      )}

      {/* Projelerim */}
      <button
        onClick={() => setProjectsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-3 mt-4 mb-1.5 group"
      >
        <span className="text-[0.68rem] font-bold tracking-[2px] uppercase text-slate-400">
          Projelerim
        </span>
        <svg
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${projectsOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {projectsOpen && (
        <nav>
          {projects.length === 0 ? (
            <div className="px-3 py-2 text-[0.8rem] text-slate-400">
              Henüz proje yok
            </div>
          ) : (
            projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className={`flex items-center gap-[0.65rem] px-3 py-[0.65rem] rounded-[10px] text-[0.9rem] font-semibold mb-0.5 transition-all duration-150 no-underline ${
                  isActive(`/dashboard/projects/${project.id}`)
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className="text-[1.1rem] w-5 text-center flex-shrink-0">
                  📁
                </span>
                <span className="truncate flex-1 min-w-0">{project.title}</span>
                <StatusBadge status={project.status} />
              </Link>
            ))
          )}
        </nav>
      )}

      {/* Hesap */}
      <div className="text-[0.68rem] font-bold tracking-[2px] uppercase text-slate-400 px-3 mt-4 mb-1.5">
        Hesap
      </div>
      <SidebarAccountActions />

      {/* Footer — kullanıcı mini profil */}
      {user && (
        <div className="mt-auto pt-4 border-t border-slate-200">
          <div className="flex items-center gap-[0.7rem] px-2 py-[0.6rem] rounded-[10px] cursor-pointer hover:bg-slate-100 transition-colors duration-150">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center font-nunito font-black text-[0.85rem] text-white flex-shrink-0">
              {user.initials}
            </div>
            <div>
              <div className="text-[0.85rem] font-bold text-slate-900">
                {user.name}
              </div>
              {user.role && (
                <div className="text-[0.72rem] text-slate-500">{user.role}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
