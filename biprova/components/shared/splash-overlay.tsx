"use client";

import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import { animate } from "animejs";
import iconData from "@/app/icons/wired-outline-1827-growing-plant-hover-pinch.json";

export function SplashOverlay() {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!overlayRef.current) return;
      animate(overlayRef.current, {
        opacity: [1, 0],
        duration: 600,
        ease: "out(2)",
        onComplete: () => setVisible(false),
      });
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
    >
      <div className="w-36 h-36">
        <Lottie animationData={iconData} loop={false} autoplay />
      </div>
      <span className="mt-4 font-black text-2xl text-blue-600 tracking-tight">
        Bi<span className="text-slate-900">prova</span>
      </span>
    </div>
  );
}
