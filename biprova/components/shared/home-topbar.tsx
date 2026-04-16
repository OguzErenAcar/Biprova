"use client";

import { useEffect, useRef, useState, ElementType } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocation } from "@/contexts/location-context";
import { notify } from "@/lib/notify";
import { getUserLocation } from "@/lib/location";
import { animate, createTimeline, splitText, stagger } from 'animejs';
import { Bell, Settings } from 'lucide-react';
import { NotificationBell } from "@/components/shared/notification-bell";
import { SearchBar } from "@/components/shared/search-bar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface DrawerProject {
  id: string;
  title: string;
  status: "open" | "full" | "active" | "completed" | "cancelled";
}

const STATUS_CONFIG: Record<DrawerProject["status"], { label: string; className: string }> = {
  open:      { label: "Açık",       className: "text-blue-600 bg-blue-50 border-blue-100" },
  full:      { label: "Dolu",       className: "text-amber-600 bg-amber-50 border-amber-100" },
  active:    { label: "Aktif",      className: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  completed: { label: "Tamamlandı", className: "text-slate-400 bg-slate-100 border-slate-200" },
  cancelled: { label: "İptal",      className: "text-red-400 bg-red-50 border-red-100" },
};

function StatusBadge({ status }: { status: DrawerProject["status"] }) {
  const { label, className } = STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={`ml-auto text-[10px] font-bold flex-shrink-0 ${className}`}>
      {label}
    </Badge>
  );
}

// ─── Buraya yaz ───────────────────────────────────────────────
const TICKER_TEXT = "Takım kur. Proje bul. Hayalini gerçeğe dönüştür. Biprova ile başla.";
const CHARS_PER_CHUNK = 30; // her seferinde kaç karakter gösterilsin (boşlukta bölmez)
// ─────────────────────────────────────────────────────────────


function chunkText(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const chunks: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      chunks.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

const CHUNKS = chunkText(TICKER_TEXT, CHARS_PER_CHUNK);

function TickerAnimation({ variant = "topbar" }: { variant?: "topbar" | "drawer" }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ps = Array.from(containerRef.current.querySelectorAll('p')) as HTMLElement[];

    const splits = ps.map((el) => splitText(el, { chars: { wrap: 'clip' } }));

    // tüm char'ları başlangıçta aşağıya göm
    splits.forEach(({ chars }) => animate(chars, { y: '100%', duration: 0 }));

    let tl = createTimeline({});

    function playLoop() {
      tl = createTimeline({ onComplete: playLoop });
      splits.forEach(({ chars }) => {
        tl.add(chars, {
          y: { from: '100%', to: '0%' },
          duration: 1500,
          ease: 'out(3)',
          delay: stagger(50),
        }).add(chars, {
          y: '-100%',
          duration: 1500,
          ease: 'in(3)',
          delay: stagger(50),
        }, '+=900');
      });
    }

    playLoop();

    return () => {
      tl.pause();
      splits.forEach((s) => s.revert());
    };
  }, []);

  if (variant === "drawer") {
    return (
      <div ref={containerRef} className="relative h-5 overflow-hidden flex items-center w-full">
        {CHUNKS.map((chunk) => (
          <p
            key={chunk}
            style={{ color: "rgba(55,100,236)" }}
            className="absolute left-0 text-sm font-semibold whitespace-nowrap"
          >
            {chunk}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="lg:inline hidden absolute right-10 lg:right-auto lg:left-1/2 lg:-translate-x-1/2 h-8 overflow-hidden flex items-center min-w-[140px] lg:min-w-[350px]"
    >
      {CHUNKS.map((chunk) => (
        <p
          key={chunk}
          style={{ color: "rgba(55,100,236)" }}
          className="absolute left-1/2 -translate-x-1/2 text-sm lg:text-lg font-semibold whitespace-nowrap"
        >
          {chunk}
        </p>
      ))}
    </div>
  );
}

function DrawerIconButton({ icon: Icon, label, onClick }: { icon: ElementType; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className=" flex-1 flex items-center justify-center gap-2 py-2 rounded-[10px] border-[1.5px] border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors font-semibold text-sm"
    >
      <Icon size={16} strokeWidth={2} />
      {label}
    </button>
  );
}

function MobileDrawer({ open, onClose, projects }: { open: boolean; onClose: () => void; projects: DrawerProject[] }) {
  const pathname = usePathname();
  const { locationOn, setLocation, clearLocation } = useLocation();
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
      clearLocation();
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
        setLocation(result.point!.lat, result.point!.lng, null);
        onClose();
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
        setLocation(pos.coords.latitude, pos.coords.longitude, null);
        onClose();
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

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`fixed right-0 top-0 h-full w-72 bg-white z-50 lg:hidden shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center px-5 py-5 border-b border-slate-100 gap-2">
          <TickerAnimation variant="drawer" />
          <button
            onClick={onClose}
            className="ml-auto flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Kapat"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* İçerik */}
        <div className="flex flex-col gap-3 px-5 py-5">
          <SearchBar className="max-w-full w-full" />
          <div className="flex gap-2">
            <DrawerIconButton
              icon={Bell}
              label="Bildirim"
              onClick={onClose}
            />
            <Link
              href="/dashboard/settings"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-[10px] border-[1.5px] border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors no-underline font-semibold text-sm"
            >
              <Settings size={16} strokeWidth={2} />
              Ayarlar
            </Link>
          </div>
        </div>

        <Separator />

        {/* Konum filtresi */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold tracking-[2px] text-slate-500">Konum</span>
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

        <Separator />

        {/* Projelerim */}
        <div className="flex flex-col px-5 py-4 overflow-y-auto flex-1">
          <button
            onClick={() => setProjectsOpen((prev) => !prev)}
            className="flex items-center justify-between w-full mb-2 group"
          >
            <span className="text-xs font-bold tracking-[2px] text-slate-500">Projelerim</span>
            <svg
              className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${projectsOpen ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {projectsOpen && (
            <nav className="mb-4">
              {projects.length === 0 ? (
                <div className="py-2 text-sm text-slate-400">Henüz proje yok</div>
              ) : (
                projects.map((project) => {
                  const active = pathname.startsWith(`/dashboard/projects/${project.id}`);
                  return (
                    <Link
                      key={project.id}
                      href={`/dashboard/projects/${project.id}`}
                      onClick={onClose}
                      className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-semibold mb-0.5 transition-colors no-underline min-w-0 ${
                        active ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="truncate">{project.title.length > 19 ? project.title.substring(0, 19) + "..." : project.title}</span>
                      <StatusBadge status={project.status} />
                    </Link>
                  );
                })
              )}
            </nav>
          )}

          {/* Kaydettiklerim */}
          <button
            onClick={() => setSavedOpen((prev) => !prev)}
            className="flex items-center justify-between w-full mb-2 group"
          >
            <span className="text-xs font-bold tracking-[2px] text-slate-500">Kaydettiklerim</span>
            <svg
              className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${savedOpen ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {savedOpen && (
            <nav>
              <div className="py-2 text-sm text-slate-400">Henüz kaydedilen yok</div>
            </nav>
          )}
        </div>
      </div>
    </>
  );
}

export function HomeTopbar({ projects = [] }: { projects?: DrawerProject[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setDrawerOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <div id="dashboard-topbar" className="relative z-50 md:mb-5 g-topbar shadow-xl  
       mx-auto w-100 md:w-full border-b-[3px] px-[12px]   py-[0.9rem] 
       flex items-center gap-4">
        <Link
          href="/dashboard"
          className="font-display font-black text-h2 text-blue-600  no-underline"
        >
          Bi<span className="text-slate-900">prova</span>
        </Link>

        <TickerAnimation />

        <div className="ml-auto flex items-center gap-[0.6rem]">
          <div className="hidden lg:flex items-center gap-[0.6rem]">
            <SearchBar />
            <Link href="/dashboard/settings" className="rounded-[10px] border-[1.5px] h-8 w-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
              <Settings size={16} strokeWidth={2} />
            </Link>
            <NotificationBell />
          </div>

          {/* Mobil menü butonu — sadece lg altında görünür */}
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-[10px] border-[1.5px] border-black text-slate-600 hover:bg-slate-100 transition-colors "
            onClick={() => setDrawerOpen(true)}
            aria-label="Menüyü aç"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} projects={projects} />
    </>
  );
}
