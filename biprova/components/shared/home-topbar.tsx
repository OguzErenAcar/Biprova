"use client";

import { useEffect, useRef, useState } from 'react';
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
          style={{ color: "rgba(55,100,236)" }}
          className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold whitespace-nowrap"
        >
          {chunk}
        </p>
      ))}
    </div>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`fixed right-0 top-0 h-full w-72 bg-white z-50 lg:hidden shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
          <span className="font-black text-xl text-blue-600">
            Bi<span className="text-slate-900">prova</span>
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Kapat"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* İçerik */}
        <div className="flex flex-col gap-3 px-5 py-5">
          <SearchBar />
          <div className="flex items-center gap-3">
            <NotificationBell />
            <Link
              href="/dashboard/settings"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-[10px] border-[1.5px] border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors no-underline"
            >
              ⚙️
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export function HomeTopbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setDrawerOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <div id="dashboard-topbar" className="relative my-5 g-topbar shadow-lg shadow-black/10 rounded-md mx-auto w-[90%] border border-black px-4 sm:px-6 lg:px-8 py-[0.9rem] flex items-center gap-4">
        <Link
          href="/dashboard"
          className="font-display font-black text-h2 text-blue-600 px-2 no-underline"
        >
          Bi<span className="text-slate-900">prova</span>
        </Link>

        <TickerAnimation />

        <div className="ml-auto flex items-center gap-[0.6rem]">
          <SearchBar />
          <button className="rounded-[10px] border-[1.5px] h-8 w-8 hidden lg:flex items-center justify-center">
            <Link href="/dashboard/settings">⚙️</Link>
          </button>

          <NotificationBell />

          {/* Mobil menü butonu — sadece lg altında görünür */}
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-[10px] border-[1.5px] border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setDrawerOpen(true)}
            aria-label="Menüyü aç"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
