"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Lottie from "lottie-react";
import iconData from "@/app/icons/wired-outline-45-clock-time-hover-pinch (1).json";

export function SplashWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="relative">
      {children}
      {visible && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 transition-opacity duration-200">
          <div className="w-32 h-32">
            <Lottie animationData={iconData as object} loop={false} autoplay />
          </div>
          <span className="mt-3 font-black text-xl text-blue-600 tracking-tight">
            Bi<span className="text-slate-900">prova</span>
          </span>
        </div>
      )}
    </div>
  );
}
