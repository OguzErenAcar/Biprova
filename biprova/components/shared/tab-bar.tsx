"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

import homeIcon from "@/app/icons/home.json";
import postsIcon from "@/app/icons/wired-outline-56-document-hover-swipe.json";
import createIcon from "@/app/icons/wired-outline-2844-magic-wand-hover-pinch.json";
import newsIcon from "@/app/icons/wired-outline-3090-document-letter-hover-pinch.json";
import profileIcon from "@/app/icons/wired-outline-268-avatar-man-hover-glance.json";

interface Tab {
  href: string;
  animationData: object;
  label: string;
  exact?: boolean;
  isCreate?: boolean;
}

const TABS: Tab[] = [
  { href: "/dashboard", animationData: homeIcon, label: "Ana Sayfa", exact: true },
  { href: "/dashboard/posts/teams", animationData: postsIcon, label: "Ekipler" },
  { href: "/dashboard/createProject", animationData: createIcon, label: "Biprova", isCreate: true },
  { href: "/dashboard/posts/news", animationData: newsIcon, label: "Haberler" },
  { href: "/dashboard/profile", animationData: profileIcon, label: "Profil" },
];

function TabItem({ tab, active, onNavigate }: { tab: Tab; active: boolean; onNavigate: () => void }) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  if (tab.isCreate) {
    return (
      <Link
        href={tab.href}
        onClick={onNavigate}
        className="flex flex-col items-center flex-1 h-[60px] tab-inactive"
        onMouseEnter={() => lottieRef.current?.play()}
        onMouseLeave={() => lottieRef.current?.stop()}>
          
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_4px_14px_rgba(37,99,235,0.4)] -mt-[14px]">
          <Lottie
            lottieRef={lottieRef}
            animationData={tab.animationData}
            loop={false}
            autoplay={false}
            style={{ width: 26, height: 26, filter: "brightness(0) invert(1)" }}
          />
        </div>
        <span className="text-xs mt-0.5 text-white font-semibold">{tab.label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={tab.href}
      onClick={onNavigate}
      className={`flex flex-col items-center px-3 h-[60px]  flex-1 no-underline ${active ? "opacity-100 bg-slate-100" : "tab-inactive"}`}
      onMouseEnter={() => lottieRef.current?.play()}
      onMouseLeave={() => lottieRef.current?.stop()}
    >
      <span className={`  px-3 py-1 transition-colors `}>
        <Lottie
          lottieRef={lottieRef}
          animationData={tab.animationData}
          loop={false}
          autoplay={false}
          style={{ width: 28, height: 28 }}
        />
      </span>
      <span className={`text-xs mt-0.5 font-semibold transition-opacity text-white ${active ? "opacity-100" : "opacity-70"}`}>
        {tab.label}
      </span>
    </Link>
  );
}

export function TabBar() {
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);
  const [scrolledDown, setScrolledDown] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setNavigating(false);
    setScrolledDown(false);
    lastScrollY.current = 0;
  }, [pathname]);

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 60) {
        setScrolledDown(true);
      } else if (currentY < lastScrollY.current) {
        setScrolledDown(false);
      }
      lastScrollY.current = currentY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  }

  const isProjectChat = /^\/dashboard\/projects\/[^/]+$/.test(pathname);
  const isHidden = isProjectChat || navigating || scrolledDown;

  return (
    <nav
      id="dashboard-tab-bar"
      className={`mobiletabbar lg:hidden fixed bottom-0 left-0 right-0 bg-surface z-[100] transition-transform duration-200 ${isHidden ? 'translate-y-20' : ''}`}
    >
      <div className="flex justify-around items-end relative z-0">
        {TABS.map((tab) => (
          <TabItem
            key={tab.href}
            tab={tab}
            active={isActive(tab.href, tab.exact)}
            onNavigate={() => { if (!isActive(tab.href, tab.exact)) setNavigating(true); }}
          />
        ))}
      </div>
    </nav>
  );
}
