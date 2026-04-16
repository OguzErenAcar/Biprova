"use client";

import { useState } from "react";
import { TeamPostCard } from "./team-post-card";
import type { TeamPostFeedItem } from "@/features/teams/actions";
import { ContentHeader } from "@/components/shared/content-header";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
 

const MEMBER_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#f97316",
];

 
type SortKey = "date" | "popular";

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
  const [sortKey, setSortKey] = useState<SortKey>("date");

  const sorted = [...posts].sort((a, b) => {
    if (sortKey === "popular") return b.likeCount - a.likeCount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const sortLabel = sortKey === "date" ? "Tarih" : "Popülerlik";

  return (
    <div id="team-post-feed">

      <ContentHeader title="Ekip Gönderileri">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 text-ink rounded-[9px]">
              {sortLabel}
              <ChevronDown className="w-3.5 h-3.5" />
             </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[160px]">
            {[
              { key: "date" as SortKey, label: "Tarihe göre sırala" },
              { key: "popular" as SortKey, label: "Popülerlik" },
            ].map(({ key, label }) => (
              <DropdownMenuItem
                key={key}
                onClick={() => setSortKey(key)}
                className={`text-caption font-semibold cursor-pointer ${
                  sortKey === key ? "text-brand " : ""
                }`}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </ContentHeader>

      {sorted.length === 0 ? (
        <div className="bg-canvas border-[1.5px] border-edge rounded-2xl p-10 text-center text-ink-subtle text-lead">
          Henüz ekip gönderisi yok.
        </div>
      ) : (
        <div className="shell_content">
          {sorted.map((post) => {
            const { title, body } = parseContent(post.content);
            const category = post.team.category;
            // const teamEmoji = CATEGORY_EMOJIS[category ?? ""] ?? "🚀";
            // const teamAvatarBg =
            //   AVATAR_BG_COLORS[
            //     hashIndex(post.team.id, AVATAR_BG_COLORS.length)
            //   ];
            const location = post.team.isRemote
              ? "Remote"
              : post.team.city
                ? post.team.city
                : "Belirtilmemiş";

            const tags = [
              ...(category
                ? [{ type: "category" as const, label: category }]
                : []),
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
                teamName={post.team.projectTitle}
                location={location}
                memberCount={post.team.members.length}
                postedAt={formatPostedAt(post.createdAt)}
                tags={tags}
                title={title}
                body={body}
                members={members}
                imageUrls={
                  post.imageUrls.length > 0 ? post.imageUrls : undefined
                }
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
