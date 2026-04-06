"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { FeedFilter } from "@/features/projects/actions";

const FILTER_OPTIONS: { label: string; value: FeedFilter }[] = [
  { label: "Tümü", value: "all" },
  { label: "Şehrim", value: "sehrim" },
  { label: "Remote", value: "remote" },
];

interface FeedFilterDropdownProps {
  activeFilter: FeedFilter;
}

export function FeedFilterDropdown({ activeFilter }: FeedFilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeLabel = FILTER_OPTIONS.find((o) => o.value === activeFilter)?.label ?? "Tümü";

  function handleSelect(value: FeedFilter) {
    setOpen(false);
    router.push(value === "all" ? "/dashboard" : `?filter=${value}`);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[0.8rem] font-semibold text-slate-600 bg-white border-[1.5px] border-slate-200 rounded-[9px] px-3 py-[0.35rem] hover:border-slate-300 transition-colors cursor-pointer"
      >
        {activeLabel}
        <span className="text-[0.7rem] text-slate-400">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] bg-white border-[1.5px] border-slate-200 rounded-[10px] shadow-lg z-50 min-w-[140px] overflow-hidden">
          {FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              className={`w-full text-left px-4 py-[0.55rem] text-[0.82rem] font-semibold transition-colors bg-transparent border-none cursor-pointer ${
                activeFilter === value
                  ? "text-blue-600 bg-blue-50"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
