"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const THRESHOLD = 72;

export function PullToRefresh() {
  const router = useRouter();
  const startYRef = useRef<number | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startYRef.current = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (startYRef.current === null || refreshing) return;
      const delta = e.touches[0].clientY - startYRef.current;
      if (delta > 0 && window.scrollY === 0) {
        setPullDistance(Math.min(delta, THRESHOLD * 1.5));
      }
    };

    const onTouchEnd = async () => {
      if (pullDistance >= THRESHOLD && !refreshing) {
        setRefreshing(true);
        router.refresh();
        await new Promise((r) => setTimeout(r, 1000));
        setRefreshing(false);
      }
      startYRef.current = null;
      setPullDistance(0);
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [pullDistance, refreshing, router]);

  const triggered = pullDistance >= THRESHOLD || refreshing;
  const visible = pullDistance > 8 || refreshing;

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{ paddingTop: refreshing ? 12 : Math.min(pullDistance * 0.15, 12) }}
    >
      <div className="bg-white rounded-full shadow-lg p-2.5 flex items-center justify-center">
        <svg
          className={`w-5 h-5 text-brand ${refreshing ? "animate-spin" : ""}`}
          style={
            !refreshing
              ? { transform: `rotate(${(pullDistance / THRESHOLD) * 360}deg)` }
              : undefined
          }
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {triggered ? (
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          ) : (
            <>
              <path d="M12 5v14M5 12l7-7 7 7" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
