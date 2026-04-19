"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lottie from "lottie-react";
import { animate } from "animejs";
import iconData from "@/app/icons/wired-outline-45-clock-time-hover-pinch (1).json";

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showSplash, setShowSplash] = useState(true);
  const splashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowSplash(true);

    const timer = setTimeout(() => {
      if (!splashRef.current) {
        setShowSplash(false);
        return;
      }
      animate(splashRef.current, {
        opacity: [1, 0],
        duration: 250,
        ease: "out(2)",
        onComplete: () => setShowSplash(false),
      });
      // animejs onComplete bazen tetiklenmez, garantili fallback
      setTimeout(() => setShowSplash(false), 400);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  // hydration tamamlanana kadar hiçbir şey render etme
  if (showSplash === null) return null;

  if (showSplash) {
    return (
      <div
        ref={splashRef}
        className="flex flex-col items-center justify-center h-full min-h-[400px]"
      >
        <div className="w-32 h-32">
          <Lottie  animationData={iconData as object} loop={false} autoplay />
        </div>
        <span className="mt-3 font-black text-xl text-blue-600 tracking-tight">
          Bi<span className="text-slate-900">prova</span>
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
