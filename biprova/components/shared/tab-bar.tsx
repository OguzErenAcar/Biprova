"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
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
  { href: "/dashboard/createProject", animationData: createIcon, label: "Oluştur", isCreate: true },
  { href: "/dashboard/posts/news", animationData: newsIcon, label: "Haberler" },
  { href: "/dashboard/profile", animationData: profileIcon, label: "Profil" },
];

function TabItem({ tab, active }: { tab: Tab; active: boolean }) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  if (tab.isCreate) {
    return (
      <Link
        href={tab.href}
        className="flex flex-col items-center flex-1 no-underline"
        onMouseEnter={() => lottieRef.current?.play()}
        onMouseLeave={() => lottieRef.current?.stop()}
      >
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_4px_14px_rgba(37,99,235,0.4)] -mt-[14px]">
          <Lottie
            lottieRef={lottieRef}
            animationData={tab.animationData}
            loop={false}
            autoplay={false}
            style={{ width: 26, height: 26, filter: "brightness(0) invert(1)" }}
          />
        </div>
        <span className="text-[10px] mt-0.5 text-blue-600 font-medium">{tab.label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={tab.href}
      className="flex flex-col items-center px-3 py-[0.3rem] flex-1 no-underline"
      onMouseEnter={() => lottieRef.current?.play()}
      onMouseLeave={() => lottieRef.current?.stop()}
    >
      <span className={`rounded-xl px-3 py-1 transition-colors ${active ? "opacity-100 bg-slate-100" : "opacity-50"}`}>
        <Lottie
          lottieRef={lottieRef}
          animationData={tab.animationData}
          loop={false}
          autoplay={false}
          style={{ width: 28, height: 28 }}
        />
      </span>
      <span className={`text-[10px] mt-0.5 font-medium transition-opacity ${active ? "opacity-100 text-slate-700" : "opacity-40 text-slate-500"}`}>
        {tab.label}
      </span>
    </Link>
  );
}

export function TabBar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav
      id="dashboard-tab-bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-slate-200 z-[100] pt-[0.4rem] pb-[calc(0.4rem+env(safe-area-inset-bottom))]"
    >
      <div className="flex justify-around items-end">
        {TABS.map((tab) => (
          <TabItem key={tab.href} tab={tab} active={isActive(tab.href, tab.exact)} />
        ))}
      </div>
    </nav>
  );
}
