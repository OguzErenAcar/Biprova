"use client";

import { useEffect, useRef } from "react";

interface TeamBarProps {
  filled: number;
  total: number;
}

export function TeamBar({ filled, total }: TeamBarProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            fill.style.width = `${pct}%`;
          }, 200);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    obs.observe(fill.parentElement!);
    return () => obs.disconnect();
  }, [pct]);

  return (
    <div>
      <div className="flex justify-between text-meta text-ink font-semibold mb-1.5">
        <span>Rol Doluluk</span>
        <span>
          {filled+1} / {total+1}
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          ref={fillRef}
          className="h-full rounded-full bg-green-400"
          style={{ width: "0%", transitionProperty: "width", transitionDuration: "1200ms", transitionTimingFunction: "cubic-bezier(.4,0,.2,1)" }}
        />
      </div>
    </div>
  );
}
