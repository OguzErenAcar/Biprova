"use client";

import { useRouter, usePathname } from "next/navigation";
import { useRef, useState, useEffect, useTransition } from "react";

const TABS = [
  "/dashboard",
  "/dashboard/posts/teams",
  "/dashboard/createProject",
  "/dashboard/posts/news",
  "/dashboard/profile",
];

const THRESHOLD = 80;
const RESISTANCE = 0.35;

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
  const [isPending, startTransition] = useTransition();

  const touchStartX = useRef<number | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const [animated, setAnimated] = useState(false);
  const isNavigatingRef = useRef(false);
  const directionRef = useRef<"left" | "right">("left");

  // Prefetch adjacent tabs for instant navigation
  useEffect(() => {
    const currentIndex = getCurrentTabIndex(pathname);
    if (currentIndex > 0) router.prefetch(TABS[currentIndex - 1]);
    if (currentIndex < TABS.length - 1) router.prefetch(TABS[currentIndex + 1]);
  }, [pathname, router]);

  // When the new page is ready (isPending → false), slide it in
  useEffect(() => {
    if (!isPending && isNavigatingRef.current) {
      const fromX =
        directionRef.current === "left" ? window.innerWidth : -window.innerWidth;

      // Position new content off-screen without animation
      setAnimated(false);
      setTranslateX(fromX);

      // Two rAF frames ensure the browser paints the off-screen position first
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimated(true);
          setTranslateX(0);
          setTimeout(() => {
            isNavigatingRef.current = false;
          }, 320);
        });
      });
    }
  }, [isPending]);

  function triggerNavigate(direction: "left" | "right") {
    if (isNavigatingRef.current) return;
    const currentIndex = getCurrentTabIndex(pathname);
    if (currentIndex === -1) return;

    const nextIndex =
      direction === "left"
        ? Math.min(currentIndex + 1, TABS.length - 1)
        : Math.max(currentIndex - 1, 0);

    if (nextIndex === currentIndex) {
      // Edge: spring back
      setAnimated(true);
      setTranslateX(0);
      return;
    }

    isNavigatingRef.current = true;
    directionRef.current = direction;

    // Slide current content off screen
    const exitTo =
      direction === "left" ? -window.innerWidth : window.innerWidth;
    setAnimated(true);
    setTranslateX(exitTo);

    // Navigate inside startTransition — React defers re-render until new page is ready
    startTransition(() => {
      router.push(TABS[nextIndex]);
    });
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (isNavigatingRef.current) return;
    touchStartX.current = e.touches[0].clientX;
    setAnimated(false);
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (touchStartX.current === null || isNavigatingRef.current) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    const currentIndex = getCurrentTabIndex(pathname);

    const atStart = currentIndex <= 0 && delta > 0;
    const atEnd = currentIndex >= TABS.length - 1 && delta < 0;
    const dampened =
      atStart || atEnd ? delta * 0.12 : delta * RESISTANCE;

    setTranslateX(dampened);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || isNavigatingRef.current) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) >= THRESHOLD) {
      triggerNavigate(delta < 0 ? "left" : "right");
    } else {
      setAnimated(true);
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
          transition: animated
            ? "transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
            : "none",
          height: "100%",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
