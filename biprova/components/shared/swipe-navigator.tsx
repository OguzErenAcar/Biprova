"use client";

import { useRouter, usePathname } from "next/navigation";
import { useRef } from "react";

const TABS = [
  "/dashboard",
  "/dashboard/posts/teams",
  "/dashboard/createProject",
  "/dashboard/posts/news",
  "/dashboard/profile",
];

const MIN_SWIPE_DISTANCE = 60;

function getCurrentTabIndex(pathname: string): number {
  // Exact match first
  const exact = TABS.findIndex((t) => t === pathname);
  if (exact !== -1) return exact;
  // Prefix match (longest wins)
  let best = -1;
  let bestLen = 0;
  TABS.forEach((t, i) => {
    if (pathname.startsWith(t + "/") && t.length > bestLen) {
      best = i;
      bestLen = t.length;
    }
  });
  return best;
}

interface SwipeNavigatorProps {
  children: React.ReactNode;
}

export function SwipeNavigator({ children }: SwipeNavigatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const touchStartX = useRef<number | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < MIN_SWIPE_DISTANCE) return;

    const currentIndex = getCurrentTabIndex(pathname);
    if (currentIndex === -1) return;

    const nextIndex =
      delta < 0
        ? Math.min(currentIndex + 1, TABS.length - 1)
        : Math.max(currentIndex - 1, 0);

    if (nextIndex !== currentIndex) {
      router.push(TABS[nextIndex]);
    }
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="h-full"
    >
      {children}
    </div>
  );
}
