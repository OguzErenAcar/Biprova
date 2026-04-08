"use client";

import { useEffect, useRef } from 'react';
import Link from "next/link";
import { createTimeline, splitText, stagger } from 'animejs';
import { NotificationBell } from "@/components/shared/notification-bell";
import { SearchBar } from "@/components/shared/search-bar";


function HelloWorldAnimation() {
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!p1Ref.current || !p2Ref.current) return;

    const splits = [p1Ref.current, p2Ref.current].map((el) =>
      splitText(el, { chars: { wrap: 'clip' } })
    );

    let tl = createTimeline({});

    function playLoop() {
      tl = createTimeline({ onComplete: playLoop });
      splits.forEach(({ chars }) => {
        tl.add(chars, {
          y: { from: '100%', to: '0%' },
          duration: 750,
          ease: 'out(3)',
          delay: stagger(50),
        }).add(chars, {
          y: '-100%',
          duration: 750,
          ease: 'in(3)',
          delay: stagger(50),
        }, '+=900');
      });
    }

    playLoop();

    return () => {
      tl.pause();
      splits.forEach((s) => s.revert());
    };
  }, []);

  return (
    <div className="absolute left-1/2 -translate-x-1/2 overflow-hidden flex items-center h-6">
      <p ref={p1Ref} className="absolute text-sm font-semibold text-slate-700 whitespace-nowrap">Hello World</p>
      <p ref={p2Ref} className="absolute text-sm font-semibold text-slate-700 whitespace-nowrap">Lorem Ipsum</p>
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
