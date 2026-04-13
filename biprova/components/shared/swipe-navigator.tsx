"use client";

import { useRouter, usePathname } from "next/navigation";
import { useRef, useState, useCallback } from "react";

const TABS = [
  "/dashboard",
  "/dashboard/posts/teams",
  "/dashboard/createProject",
  "/dashboard/posts/news",
  "/dashboard/profile",
];

const THRESHOLD = 80;       // px — this much drag confirms navigation
const RESISTANCE = 0.35;    // how much the drag is dampened

function getCurrentTabIndex(pathname: string): number {
  const exact = TABS.findIndex((t) => t === pathname);
  if (exact !== -1) return exact;
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
  const [translateX, setTranslateX] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const animatingRef = useRef(false);

  const navigate = useCallback(
    (direction: "left" | "right") => {
      if (animatingRef.current) return;
      const currentIndex = getCurrentTabIndex(pathname);
      if (currentIndex === -1) return;

      const nextIndex =
        direction === "left"
          ? Math.min(currentIndex + 1, TABS.length - 1)
          : Math.max(currentIndex - 1, 0);

      if (nextIndex === currentIndex) {
        // Edge — spring back
        setTransitioning(true);
        setTranslateX(0);
        return;
      }

      animatingRef.current = true;
      const exitTo = direction === "left" ? -window.innerWidth : window.innerWidth;

      setTransitioning(true);
      setTranslateX(exitTo);

      setTimeout(() => {
        router.push(TABS[nextIndex]);
        // Reset without transition so the incoming page starts from the other side
        setTransitioning(false);
        setTranslateX(direction === "left" ? window.innerWidth : -window.innerWidth);

        // Then slide into view
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTransitioning(true);
            setTranslateX(0);
            setTimeout(() => {
              animatingRef.current = false;
            }, 320);
          });
        });
      }, 280);
    },
    [pathname, router]
  );

  function handleTouchStart(e: React.TouchEvent) {
    if (animatingRef.current) return;
    touchStartX.current = e.touches[0].clientX;
    setTransitioning(false);
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (touchStartX.current === null || animatingRef.current) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    const currentIndex = getCurrentTabIndex(pathname);

    // Apply resistance at edges
    const atStart = currentIndex <= 0 && delta > 0;
    const atEnd = currentIndex >= TABS.length - 1 && delta < 0;
    const dampened = (atStart || atEnd) ? delta * 0.15 : delta * RESISTANCE;

    setTranslateX(dampened);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || animatingRef.current) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) >= THRESHOLD) {
      navigate(delta < 0 ? "left" : "right");
    } else {
      // Spring back
      setTransitioning(true);
      setTranslateX(0);
    }
  }

  return (
    <div
      className="h-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        style={{
          transform: `translateX(${translateX}px)`,
          transition: transitioning ? "transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "none",
          height: "100%",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
