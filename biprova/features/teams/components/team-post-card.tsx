"use client";

import { useTransition, useState } from "react";
import dynamic from "next/dynamic";
import lgZoom from "lightgallery/plugins/zoom";
import lgShare from "lightgallery/plugins/share";
import { toggleTeamPostLike } from "@/features/teams/actions";
import { Card, CardContent } from "@/components/ui/card";

const LightGallery = dynamic(() => import("lightgallery/react"), { ssr: false });
 
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
    <Card
      id={`team-post-card-${postId}`}
      className={`hover:-translate-y-0.5 hover:shadow-card transition-all duration-150 cursor-pointer mb-4 ${
        isOwnTeam ? "bg-[#f8faff] border-brand-surface" : ""
      }`}
    ><CardContent className="p-[1.4rem]">
      {/* Ekip kimlik satırı */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full flex items-center justify-center bg-white flex-shrink-0 border border-gray-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/432-4329071_team-icon-png-transparent-png.png" alt="team" className="w-8 h-8 object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <div style={{fontSize:24}} className=" font-black text-lead text-ink flex items-center gap-1 flex-wrap">
            {teamName}
            {isOwnTeam && (
              <span className="text-brand font-bold text-meta">· Senin ekibin</span>
            )}
          </div>
          <div className="text-meta text-ink flex items-center gap-[0.4rem] mt-[0.1rem]">
            <span>{location}</span>
            <span className="opacity-40">·</span>
            <span>{memberCount} üye</span>
          </div>
        </div>
        <span className="text-meta text-ink-subtle whitespace-nowrap flex-shrink-0">
          {postedAt}
        </span>
      </div>

      {/* Başlık */}
      <div className=" py-3 text-title leading-[1.35] text-ink mb-[0.45rem]">
        {title}
      </div>

      {/* Açıklama */}
      {body && (
        <div className="text-body text-ink-muted leading-[1.6] mb-4">
          
          {displayBody}
          {isLong && (
            <>
              {" "}
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
                className="text-brand font-semibold cursor-pointer bg-transparent border-none p-0"
              >
                {expanded ? "Daha az" : "Devamını oku"}
              </button>
            </>
          )}
        </div>
      )}

      {/* Görseller */}
      {imageUrls && imageUrls.length > 0 && (
        <LightGallery
          elementClassNames="flex flex-col gap-2 mb-4"
          plugins={[lgZoom, lgShare]}
          speed={300}
        >
          {imageUrls.map((url, i) => (
            <a key={i} data-src={url} className="block w-full cursor-zoom-in">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-auto max-h-[420px] object-cover rounded-[8px]" />
            </a>
          ))}
        </LightGallery>
      )}
      {!imageUrls && hasImage && (
        <div className="w-full h-[180px] rounded-xl bg-gradient-to-br from-brand-surface to-brand-surface flex items-center justify-center text-[2.5rem] mb-4">
          📸
        </div>
      )}

      {/* Aksiyon butonları */}
      <div className="flex items-center gap-2 pt-4 border-t ">
        {/* Beğeni */}
        <button 
          onClick={(e) => { e.stopPropagation(); handleLike(); }}
          disabled={isPending}
          className={`gap-[0.35rem] border rounded-md font-jakarta text-caption font-semibold h-auto px-[0.85rem] py-[0.4rem] transition-all duration-150 ${
            isLiked
              ? "border-danger-surface text-danger bg-danger-surface hover:bg-danger-surface hover:text-danger"
              : "text-white hover:border-brand hover:text-brand hover:bg-brand-surface"
          }`}
        >
          👍 {likeCount}
        </button>

        {/* Yorum — devre dışı */}
        <button          
          disabled
          className="hidden border rounded-md gap-[0.35rem] font-jakarta text-caption font-semibold text-ink-subtle h-auto px-[0.85rem] py-[0.4rem]"
        >
          💬 {comments}
        </button>

        {/* Paylaş + Kaydet — devre dışı */}
        <div className="ml-auto flex items-center gap-2">
          <button
            disabled
            className=" hidden border rounded-md gap-[0.35rem]  font-jakarta text-caption font-semibold text-ink-subtle h-auto px-[0.85rem] py-[0.4rem]"
          >
            ↗ Paylaş
          </button>
          <button
            disabled
            className="hidden gap-[0.35rem] border rounded-md font-jakarta text-caption font-semibold text-ink-subtle h-auto px-[0.85rem] py-[0.4rem]"
          >
            🔖 Kaydet
          </button>
        </div>
      </div>
      </CardContent>
    </Card>
  );
}
