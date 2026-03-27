"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard", icon: "🏠", label: "Ana Sayfa", exact: true },
  { href: "/dashboard/teams", icon: "👥", label: "Ekipler" },
  { href: "/dashboard/projects/new", icon: "＋", label: "Proje Aç", isCreate: true },
  { href: "/dashboard/news", icon: "📰", label: "Haberler" },
  { href: "/dashboard/profile", icon: "👤", label: "Profil" },
];

export function TabBar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-[100] pt-[0.4rem] pb-[calc(0.4rem+env(safe-area-inset-bottom))]">
      <div className="flex justify-around items-end">
        {TABS.map(({ href, icon, label, exact, isCreate }) => {
          if (isCreate) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-[0.2rem] flex-1 no-underline"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-[1.4rem] text-white shadow-[0_4px_14px_rgba(37,99,235,0.4)] -mt-[14px] mb-[0.1rem]">
                  {icon}
                </div>
                <span className="text-[0.62rem] font-extrabold font-nunito text-blue-600">
                  {label}
                </span>
              </Link>
            );
          }

          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-[0.2rem] px-3 py-[0.3rem] flex-1 no-underline"
            >
              <span className="text-[1.3rem] leading-none">{icon}</span>
              <span
                className={`text-[0.62rem] font-bold font-nunito ${
                  active ? "text-blue-600" : "text-slate-500"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
