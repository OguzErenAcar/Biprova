"use client";

import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import { animate } from "animejs";
import iconData from "@/app/icons/wired-outline-1827-growing-plant-hover-pinch.json";

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  // null = henüz karar verilmedi (hydration öncesi)
  const [showSplash, setShowSplash] = useState<boolean | null>(null);
  const splashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem("splash_seen");
    if (seen) {
      setShowSplash(false);
      return;
    }

    sessionStorage.setItem("splash_seen", "1");
    setShowSplash(true);

    const timer = setTimeout(() => {
      if (!splashRef.current) return;
      animate(splashRef.current, {
        opacity: [1, 0],
        duration: 500,
        ease: "out(2)",
        onComplete: () => setShowSplash(false),
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // hydration tamamlanana kadar hiçbir şey render etme
  if (showSplash === null) return null;

  if (showSplash) {
    return (
      <div
        ref={splashRef}
        className="flex flex-col items-center justify-center h-full min-h-[400px]"
      >
        <div className="w-32 h-32">
          <Lottie animationData={iconData} loop={false} autoplay />
        </div>
        <span className="mt-3 font-black text-xl text-blue-600 tracking-tight">
          Bi<span className="text-slate-900">prova</span>
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
