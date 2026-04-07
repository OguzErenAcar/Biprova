'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { search, SearchResult } from '@/features/search/actions';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length === 0) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const data = await search(query);
        setResults(data);
        setOpen(true);
      });
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect() {
    setQuery('');
    setResults([]);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative flex-1 min-w-0 max-w-[200px]">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[0.9rem] pointer-events-none">
        🔍
      </span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Proje veya kişi ara..."
        className="w-full bg-white border-[1.5px] border-slate-200 rounded-[10px] pl-9 pr-4 py-[0.6rem] font-jakarta text-[0.88rem] text-slate-900 outline-none focus:border-blue-600 placeholder:text-slate-400 transition-colors duration-200"
      />

      {open && (
        <div className="absolute left-0 top-full z-50 pt-2 w-full">
          <div className="bg-white border-[1.5px] border-edge rounded-2xl shadow-xl overflow-hidden">
            {isPending ? (
              <div className="px-4 py-3 text-[0.82rem] text-slate-400">Aranıyor…</div>
            ) : results.length === 0 ? (
              <div className="px-4 py-3 text-[0.82rem] text-slate-400">Sonuç bulunamadı.</div>
            ) : (
              results.map((r) => (
                <Link
                  key={`${r.type}-${r.id}`}
                  href={r.href}
                  onClick={handleSelect}
                  className="flex items-center gap-3 px-4 py-[0.65rem] hover:bg-slate-50 transition-colors no-underline border-b border-edge last:border-b-0"
                >
                  <span className="text-[1rem] shrink-0">
                    {r.type === 'project' ? '📁' : '👤'}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[0.84rem] font-semibold text-slate-900 truncate">
                      {r.label}
                    </div>
                    {r.sub && (
                      <div className="text-[0.72rem] text-slate-400 truncate">{r.sub}</div>
                    )}
                  </div>
                  <span className="ml-auto text-[0.68rem] font-bold text-slate-300 shrink-0">
                    {r.type === 'project' ? 'Proje' : 'Kişi'}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
