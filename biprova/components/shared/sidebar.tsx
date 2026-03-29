"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarAccountActions } from "@/components/shared/sidebar-account-actions";

interface SidebarUser {
  name: string;
  role: string;
  initials: string;
}

interface SidebarTeam {
  id: string;
  name: string;
}

interface SidebarProject {
  id: string;
  title: string;
  status: "open" | "full" | "active" | "completed" | "cancelled";
}

interface SidebarProps {
  user?: SidebarUser;
  teams?: SidebarTeam[];
  projects?: SidebarProject[];
}

const NAV_MAIN = [
  { href: "/dashboard", icon: "🏠", label: "Ana Sayfa", exact: true },
  { href: "/dashboard/teams", icon: "👥", label: "Ekipler" },
  { href: "/dashboard/createProject", icon: "✨", label: "Proje Oluştur" },
  { href: "/dashboard/news", icon: "📰", label: "Haberler" },
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

export function Sidebar({ user, teams = [], projects = [] }: SidebarProps) {
  const activeProjects = projects.filter((p) => p.status === "active");
  const completedProjects = projects.filter((p) => p.status === "completed");
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside id="dashboard-sidebar" className="w-60 bg-white border-r border-slate-200 flex flex-col fixed top-0 left-0 bottom-0 z-50 px-4 py-6 -translate-x-full lg:translate-x-0 transition-transform duration-200">
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

      {/* Ekiplerim */}
      <div className="text-[0.68rem] font-bold tracking-[2px] uppercase text-slate-400 px-3 mt-4 mb-1.5">
        Ekiplerim
      </div>
      <nav>
        {teams.length === 0 ? (
          <div className="px-3 py-2 text-[0.8rem] text-slate-400">Henüz ekip yok</div>
        ) : (
          teams.map((team) => (
            <Link
              key={team.id}
              href={`/dashboard/teams/${team.id}`}
              className={`flex items-center gap-[0.65rem] px-3 py-[0.65rem] rounded-[10px] text-[0.9rem] font-semibold mb-0.5 transition-all duration-150 no-underline ${
                isActive(`/dashboard/teams/${team.id}`)
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className="text-[1.1rem] w-5 text-center">👥</span>
              <span className="truncate">{team.name}</span>
            </Link>
          ))
        )}
      </nav>

      {/* Projelerim */}
      <div className="text-[0.68rem] font-bold tracking-[2px] uppercase text-slate-400 px-3 mt-4 mb-1.5">
        Projelerim
      </div>
      <nav>
        <div className="text-[0.68rem] font-semibold text-slate-400 px-3 mt-1 mb-0.5">Aktif</div>
        {activeProjects.length === 0 ? (
          <div className="px-3 py-1.5 text-[0.8rem] text-slate-400">—</div>
        ) : (
          activeProjects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className={`flex items-center gap-[0.65rem] px-3 py-[0.65rem] rounded-[10px] text-[0.9rem] font-semibold mb-0.5 transition-all duration-150 no-underline ${
                isActive(`/dashboard/projects/${project.id}`)
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className="text-[1.1rem] w-5 text-center">⚡</span>
              <span className="truncate">{project.title}</span>
            </Link>
          ))
        )}

        <div className="text-[0.68rem] font-semibold text-slate-400 px-3 mt-2 mb-0.5">Tamamlanan</div>
        {completedProjects.length === 0 ? (
          <div className="px-3 py-1.5 text-[0.8rem] text-slate-400">—</div>
        ) : (
          completedProjects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className={`flex items-center gap-[0.65rem] px-3 py-[0.65rem] rounded-[10px] text-[0.9rem] font-semibold mb-0.5 transition-all duration-150 no-underline ${
                isActive(`/dashboard/projects/${project.id}`)
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className="text-[1.1rem] w-5 text-center">✅</span>
              <span className="truncate">{project.title}</span>
            </Link>
          ))
        )}
      </nav>

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
              <div className="text-[0.85rem] font-bold text-slate-900">{user.name}</div>
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
