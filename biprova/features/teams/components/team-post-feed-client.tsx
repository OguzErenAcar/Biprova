"use client";

import { useEffect, useRef, useState } from 'react';
import { TeamPostCard } from './team-post-card';
import type { TeamPostFeedItem } from '@/features/teams/actions';

const AVATAR_BG_COLORS = [
  "#ede9fe", "#dbeafe", "#dcfce7", "#fef3c7",
  "#fee2e2", "#cffafe", "#fce7f3", "#ffedd5",
];

const MEMBER_COLORS = [
  "#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b",
  "#ef4444", "#06b6d4", "#ec4899", "#f97316",
];

const CATEGORY_EMOJIS: Record<string, string> = {
  Sosyal:     "🤝",
  Medya:      "🎙️",
  Çevre:      "🌱",
  Sanat:      "🎬",
  Teknoloji:  "💻",
  Eğitim:     "📚",
  Sağlık:     "🏥",
  Spor:       "⚽",
  Müzik:      "🎵",
};

type SortKey = 'date' | 'popular';

function hashIndex(str: string, len: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % len;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

function parseContent(content: string): { title: string; body: string } {
  const newlineIdx = content.indexOf("\n");
  if (newlineIdx > 0 && newlineIdx <= 120) {
    return {
      title: content.slice(0, newlineIdx).trim(),
      body: content.slice(newlineIdx + 1).trim(),
    };
  }
  if (content.length <= 120) {
    return { title: content, body: "" };
  }
  return { title: content.slice(0, 90).trimEnd() + "…", body: content };
}

function formatPostedAt(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün önce`;
  return `${Math.floor(days / 7)} hafta önce`;
}

interface Props {
  posts: TeamPostFeedItem[];
}

export function TeamPostFeedClient({ posts }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const sorted = [...posts].sort((a, b) => {
    if (sortKey === 'popular') return b.likeCount - a.likeCount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const sortLabel = sortKey === 'date' ? 'Tarihe göre' : 'Popülerlik';

  return (
    <div id="team-post-feed">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-nunito font-black text-[1.1rem] text-slate-900">
          👥 Ekip Gönderileri
        </h2>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 text-[0.8rem] font-semibold text-slate-600 bg-white border-[1.5px] border-slate-200 rounded-[9px] px-3 py-[0.35rem] hover:border-slate-300 transition-colors cursor-pointer"
          >
            {sortLabel}
            <span className="text-[0.7rem] text-slate-400">{open ? '▲' : '▼'}</span>
          </button>
          {open && (
            <div className="absolute right-0 top-[calc(100%+4px)] bg-white border-[1.5px] border-slate-200 rounded-[10px] shadow-lg z-50 min-w-[160px] overflow-hidden">
              {([
                { key: 'date' as SortKey, label: 'Tarihe göre sırala' },
                { key: 'popular' as SortKey, label: 'Popülerlik' },
              ]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => { setSortKey(key); setOpen(false); }}
                  className={`w-full text-left px-4 py-[0.55rem] text-[0.82rem] font-semibold transition-colors bg-transparent border-none cursor-pointer ${
                    sortKey === key
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl p-10 text-center text-slate-400 text-[0.9rem]">
          Henüz ekip gönderisi yok.
        </div>
      ) : (
        <div>
          {sorted.map((post) => {
            const { title, body } = parseContent(post.content);
            const category = post.team.category;
            const teamEmoji = CATEGORY_EMOJIS[category ?? ""] ?? "🚀";
            const teamAvatarBg = AVATAR_BG_COLORS[hashIndex(post.team.id, AVATAR_BG_COLORS.length)];
            const location = post.team.isRemote
              ? "🌐 Remote"
              : post.team.city
              ? `📍 ${post.team.city}`
              : "📍 Belirtilmemiş";

            const tags = [
              ...(category ? [{ type: "category" as const, label: category }] : []),
              ...(post.team.isRemote
                ? [{ type: "city" as const, label: "🌐 Remote" }]
                : post.team.city
                ? [{ type: "city" as const, label: `📍 ${post.team.city}` }]
                : []),
            ];

            const members = post.team.members.map((m) => ({
              initials: getInitials(m.name),
              name: m.name,
              color: MEMBER_COLORS[hashIndex(m.id, MEMBER_COLORS.length)],
            }));

            return (
              <TeamPostCard
                key={post.id}
                postId={post.id}
                teamEmoji={teamEmoji}
                teamAvatarBg={teamAvatarBg}
                teamName={post.team.projectTitle}
                location={location}
                memberCount={post.team.members.length}
                postedAt={formatPostedAt(post.createdAt)}
                tags={tags}
                title={title}
                body={body}
                members={members}
                likes={post.likeCount}
                comments={0}
                liked={post.isLiked}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
