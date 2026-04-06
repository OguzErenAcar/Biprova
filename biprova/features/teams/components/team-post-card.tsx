"use client";

import { useTransition, useState } from "react";
import { toggleTeamPostLike } from "@/features/teams/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BODY_TRUNCATE_THRESHOLD = 180;

type TagType = "update" | "milestone" | "announcement" | "city" | "category";

interface Tag {
  type: TagType;
  label: string;
}

interface Member {
  initials: string;
  name: string;
  color: string;
}

interface TeamPostCardProps {
  postId: string;
  teamEmoji: string;
  teamAvatarBg: string;
  teamName: string;
  location: string;
  memberCount: number;
  postedAt: string;
  tags: Tag[];
  title: string;
  body: string;
  hasImage?: boolean;
  imageUrls?: string[];
  members: Member[];
  likes: number;
  comments: number;
  liked?: boolean;
  isOwnTeam?: boolean;
}

export function TeamPostCard({
  postId,
  teamEmoji,
  teamAvatarBg,
  teamName,
  location,
  memberCount,
  postedAt,
  title,
  body,
  hasImage,
  imageUrls,
  likes: initialLikes,
  comments,
  liked: initialLiked = false,
  isOwnTeam,
}: TeamPostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();

  const isLong = body.length > BODY_TRUNCATE_THRESHOLD;
  const displayBody = isLong && !expanded ? body.slice(0, BODY_TRUNCATE_THRESHOLD).trimEnd() + "…" : body;

  function handleLike() {
    if (isPending) return;
    const optimisticLiked = !isLiked;
    setIsLiked(optimisticLiked);
    setLikeCount((c) => optimisticLiked ? c + 1 : Math.max(c - 1, 0));
    startTransition(async () => {
      try {
        const { isLiked: confirmed } = await toggleTeamPostLike(postId);
        setIsLiked(confirmed);
        setLikeCount((c) => {
          if (confirmed !== optimisticLiked) {
            return confirmed ? c + 1 : Math.max(c - 1, 0);
          }
          return c;
        });
      } catch {
        setIsLiked(initialLiked);
        setLikeCount(initialLikes);
      }
    });
  }

  return (
    <div
      id={`team-post-card-${postId}`}
      className={`border-[1.5px] rounded-2xl p-[1.4rem] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] transition-all duration-150 cursor-pointer mb-4 ${
        isOwnTeam ? "bg-[#f8faff] border-blue-200" : "bg-white border-slate-200"
      }`}
    >
      {/* Ekip kimlik satırı */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-[13px] flex items-center justify-center text-[1.3rem] flex-shrink-0"
          style={{ background: teamAvatarBg }}
        >
          {teamEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-nunito font-black text-[0.95rem] text-slate-900 flex items-center gap-1 flex-wrap">
            {teamName}
            {isOwnTeam && (
              <span className="text-blue-600 font-bold text-[0.75rem]">· Senin ekibin</span>
            )}
          </div>
          <div className="text-[0.75rem] text-slate-400 flex items-center gap-[0.4rem] mt-[0.1rem]">
            <span>{location}</span>
            <span className="opacity-40">·</span>
            <span>{memberCount} üye</span>
          </div>
        </div>
        <span className="text-[0.75rem] text-slate-400 whitespace-nowrap flex-shrink-0">
          {postedAt}
        </span>
      </div>

      {/* Başlık */}
      <div className="font-nunito font-black text-[1.05rem] leading-[1.35] text-slate-900 mb-[0.45rem]">
        {title}
      </div>

      {/* Açıklama */}
      {body && (
        <div className="text-[0.86rem] text-slate-500 leading-[1.6] mb-4">
          {displayBody}
          {isLong && (
            <>
              {" "}
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
                className="text-blue-600 font-semibold cursor-pointer bg-transparent border-none p-0"
              >
                {expanded ? "Daha az" : "Devamını oku"}
              </button>
            </>
          )}
        </div>
      )}

      {/* Görseller */}
      {imageUrls && imageUrls.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {imageUrls.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="w-1/3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-auto rounded-[8px]" />
            </a>
          ))}
        </div>
      )}
      {!imageUrls && hasImage && (
        <div className="w-full h-[180px] rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-[2.5rem] mb-4">
          📸
        </div>
      )}

      {/* Aksiyon butonları */}
      <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
        {/* Beğeni */}
        <button
          onClick={(e) => { e.stopPropagation(); handleLike(); }}
          disabled={isPending}
          className={`flex items-center gap-[0.35rem] border-[1.5px] rounded-lg font-jakarta text-[0.8rem] font-semibold px-[0.85rem] py-[0.4rem] transition-all duration-150 ${
            isPending ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          } ${
            isLiked
              ? "border-red-300 text-red-500 bg-red-50"
              : "border-slate-200 text-slate-500 bg-transparent hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50"
          }`}
        >
          👍 {likeCount}
        </button>

        {/* Yorum — devre dışı */}
        <button
          disabled
          className="flex items-center gap-[0.35rem] border-[1.5px] border-slate-100 rounded-lg font-jakarta text-[0.8rem] font-semibold text-slate-300 px-[0.85rem] py-[0.4rem] cursor-not-allowed"
        >
          💬 {comments}
        </button>

        {/* Paylaş + Kaydet — devre dışı */}
        <div className="ml-auto flex items-center gap-2">
          <button
            disabled
            className="flex items-center gap-[0.35rem] border-[1.5px] border-slate-100 rounded-lg font-jakarta text-[0.8rem] font-semibold text-slate-300 px-[0.85rem] py-[0.4rem] cursor-not-allowed"
          >
            ↗ Paylaş
          </button>
          <button
            disabled
            className="flex items-center gap-[0.35rem] border-[1.5px] border-slate-100 rounded-lg font-jakarta text-[0.8rem] font-semibold text-slate-300 px-[0.85rem] py-[0.4rem] cursor-not-allowed"
          >
            🔖 Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
