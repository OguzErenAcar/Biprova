"use client";

import { useEffect, useRef } from 'react';
import Link from "next/link";
import { animate, createTimeline, splitText, stagger } from 'animejs';
import { NotificationBell } from "@/components/shared/notification-bell";
import { SearchBar } from "@/components/shared/search-bar";

// ─── Buraya yaz ───────────────────────────────────────────────
const TICKER_TEXT = "Takım kur. Proje bul. Hayalini gerçeğe dönüştür. Biprova ile başla.";
const CHARS_PER_CHUNK = 30; // her seferinde kaç karakter gösterilsin (boşlukta bölmez)
// ─────────────────────────────────────────────────────────────

function chunkText(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const chunks: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      chunks.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

const CHUNKS = chunkText(TICKER_TEXT, CHARS_PER_CHUNK);

function TickerAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ps = Array.from(containerRef.current.querySelectorAll('p')) as HTMLElement[];

    const splits = ps.map((el) => splitText(el, { chars: { wrap: 'clip' } }));

    // tüm char'ları başlangıçta aşağıya göm
    splits.forEach(({ chars }) => animate(chars, { y: '100%', duration: 0 }));

    let tl = createTimeline({});

    function playLoop() {
      tl = createTimeline({ onComplete: playLoop });
      splits.forEach(({ chars }) => {
        tl.add(chars, {
          y: { from: '100%', to: '0%' },
          duration: 1500,
          ease: 'out(3)',
          delay: stagger(50),
        }).add(chars, {
          y: '-100%',
          duration: 1500,
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
    <div
      ref={containerRef}
      className="absolute left-1/2 -translate-x-1/2 h-8 overflow-hidden flex items-center min-w-[350px]"
    >
      {CHUNKS.map((chunk) => (
        <p
          key={chunk}
          style={{ color: "rgba(55,100,236)", transform: "translateY(100%)" }}
          className="absolute left-1/2 -translate-x-1/2 text-2xl font-semibold whitespace-nowrap"
        >
          {chunk}
        </p>
      ))}
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

      <TickerAnimation />

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
