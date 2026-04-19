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
      <div className="flex justify-between text-[0.76rem] text-slate-500 font-semibold mb-1.5">
        <span>Ekip Doluluk</span>
        <span>{filled} / {total}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          ref={fillRef}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
          style={{ width: "0%", transition: 'width 1200ms cubic-bezier(.4,0,.2,1)' }}
        />
      </div>
    </div>
  );
}
