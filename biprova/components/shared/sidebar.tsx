"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { notify } from "@/lib/notify";
import { getUserLocation } from "@/lib/location";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

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
  locationOn?: boolean;
}

const NAV_MAIN = [
  { href: "/dashboard", animationData: homeIcon, label: "Projeler", exact: true },
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
      className={`flex text-label items-center hover:text-black gap-[0.65rem] px-3 py-[0.65rem] rounded-[10px] text-body font-semibold mb-0.5 transition-all duration-150 no-underline ${
        isActive
          ? "bg-blue-50 text-slate-900"
          : "text-ink  hover:bg-slate-100 "
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
          style={{ width: 27, height: 27 }}
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
      className={`flex  items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold mb-0.5 transition-colors no-underline min-w-0 ${
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-ink hover:bg-slate-100 hover:text-ink"
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
      <span className="truncate hover:text-black">{project.title.substring(0, 19) + "..."}</span>
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

export function Sidebar({ projects = [], locationOn: initialLocationOn = false }: SidebarProps) {
  const pathname = usePathname();

  const [locationOn, setLocationOn] = useState(initialLocationOn);
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [savedOpen, setSavedOpen] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    import('@capacitor/core')
      .then(({ Capacitor }) => setIsNative(Capacitor.isNativePlatform()))
      .catch(() => {});
  }, []);

  function handleLocationToggle(checked: boolean) {
    if (!checked) {
      import('@/features/projects/location-actions').then(({ clearLocationFilter }) => {
        clearLocationFilter().then(() => setLocationOn(false));
      });
      return;
    }

    if (isNative) {
      setLocationLoading(true);
      getUserLocation().then((result) => {
        setLocationLoading(false);
        if (result.error) {
          if (result.error === 'permission_denied') notify.location.denied();
          else if (result.error === 'unsupported') notify.location.unsupported();
          else notify.location.unavailable();
          return;
        }
        import('@/features/projects/location-actions').then(({ setLocationFilter }) => {
          setLocationFilter(result.point!.lat, result.point!.lng).then(() => setLocationOn(true));
        });
      });
      return;
    }

    if (!navigator?.geolocation) {
      notify.location.unsupported();
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationLoading(false);
        import('@/features/projects/location-actions').then(({ setLocationFilter }) => {
          setLocationFilter(pos.coords.latitude, pos.coords.longitude).then(() => setLocationOn(true));
        });
      },
      (err) => {
        setLocationLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          notify.location.denied();
        } else {
          notify.location.unavailable();
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60_000 }
    );
  }

  function isActive(href: string, exact?: boolean) {
    return exact
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <div
      id="dashboard-sidebar"
      className="g-bg bg-surface border border-slate-400   shadow-sm flex-col sticky top-4 z-30 px-4 py-6 hidden lg:flex"
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

      {/* Konum filtresi */}
      <div className="px-3 mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-label font-bold tracking-[2px] text-ink">Konum</span>
          <Switch
            checked={locationOn}
            disabled={locationLoading}
            onCheckedChange={handleLocationToggle}
          />
        </div>
        {locationLoading && (
          <p className="text-[11px] text-slate-400 leading-snug">Konum alınıyor...</p>
        )}
        {locationOn && !locationLoading && (
          <p className="text-[11px] text-slate-400 leading-snug">
            Yakınımdaki projeler gösteriliyor
          </p>
        )}
      </div>

      <Separator className="mb-4" />

      {/* Projelerim */}
      <button
        onClick={() => setProjectsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-3 mb-1.5 group"
      >
        <span className="text-label font-bold tracking-[2px]  text-ink">
          Projelerim
        </span>
        <svg
          className={`w-3 h-3 text-ink transition-transform duration-200 ${projectsOpen ? "rotate-180" : ""}`}
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
            <div className="px-3 py-2  text-ink">
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
            )
          }
        </nav>
      )}

      {/* Kaydettiklerim */}
      <button
        onClick={() => setSavedOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-3 mt-4 mb-1.5 group"
      >
        <span className="text-label font-bold tracking-[2px]  text-ink">
          Kaydettiklerim
        </span>
        <svg
          className={`w-3 h-3 text-ink transition-transform duration-200 ${savedOpen ? "rotate-180" : ""}`}
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
          <div className="px-3 py-2 text-sm text-ink">
            Henüz kaydedilen yok
          </div>
        </nav>
      )}
    </div>
  );
}
