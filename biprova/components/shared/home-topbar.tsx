"use client";

import { useEffect, useRef } from 'react';
import Link from "next/link";
import { animate, splitText, stagger } from 'animejs';
import { NotificationBell } from "@/components/shared/notification-bell";
import { SearchBar } from "@/components/shared/search-bar";

function HelloWorldAnimation() {
  const pRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!pRef.current) return;

    const { chars } = splitText(pRef.current, {
      chars: { wrap: 'clip' },
    });

    animate(chars, {
      y: [
        { to: ['100%', '0%'] },
        { to: '-100%', delay: 750, ease: 'in(3)' }
      ],
      duration: 750,
      ease: 'out(3)',
      delay: stagger(50),
      loop: true,
    });
  }, []);

  return (
    <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
      <p ref={pRef} className="text-sm font-semibold text-slate-700">Hello World</p>
    </div>
  );
}

export function HomeTopbar() {
  return (
    <div id="dashboard-topbar" className="relative my-5 g-topbar shadow-lg shadow-black/10 rounded-md mx-auto w-[90%] border border-slate-400 px-4 sm:px-6 lg:px-8 py-[0.9rem] flex items-center gap-4">
      <Link
        href="/dashboard"
        className="font-display font-black text-h2 text-blue-600 px-2 no-underline"
      >
        Bi<span className="text-slate-900">prova</span>
      </Link>

      <HelloWorldAnimation />

      <div className="ml-auto flex items-center gap-[0.6rem]">
        <SearchBar />
        <button className="rounded-[10px] border-[1.5px] h-8 w-8">
          <Link href="/dashboard/settings">⚙️</Link>
        </button>

        <NotificationBell />
      </div>
    </div>
  );
}
