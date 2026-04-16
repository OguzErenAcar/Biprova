"use client";

import { useTransition, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import Lottie from "lottie-react";
import type { LottieRefCurrentProps } from "lottie-react";
import heartIcon from "@/app/icons/wired-outline-20-love-heart-hover-heartbeat.json";
import lgZoom from "lightgallery/plugins/zoom";
import lgShare from "lightgallery/plugins/share";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-share.css";
import { toggleTeamPostLike } from "@/features/teams/actions";
import { Card, CardContent } from "@/components/ui/card";

const LightGallery = dynamic(() => import("lightgallery/react"), {
  ssr: false,
});

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
  disableNavigation?: boolean;
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
  disableNavigation = false,
}: TeamPostCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();
  const heartRef = useRef<LottieRefCurrentProps>(null);

  const isLong = body.length > BODY_TRUNCATE_THRESHOLD;
  const displayBody =
    isLong && !expanded
      ? body.slice(0, BODY_TRUNCATE_THRESHOLD).trimEnd() + "…"
      : body;

  function handleLike() {
    if (isPending) return;
    const optimisticLiked = !isLiked;
    setIsLiked(optimisticLiked);
    setLikeCount((c) => (optimisticLiked ? c + 1 : Math.max(c - 1, 0)));
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
      className={`mb-3.5 hover:-translate-y-0.5 hover:shadow-card transition-all duration-150 ${
        isOwnTeam ? "bg-[#f8faff] border-brand-surface" : ""
      }`}
    >
      <CardContent className="px-3 sm:p-[1.4rem]">
        {/* Ekip kimlik satırı */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-white flex-shrink-0 border border-gray-100 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/432-4329071_team-icon-png-transparent-png.png"
              alt="team"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm md:text-lg text-ink flex items-center gap-1 flex-wrap">
              {teamName}
              {isOwnTeam && (
                <span className="text-brand font-bold text-meta">
                  · Senin ekibin
                </span>
              )}
            </div>
            <div className="text-ink-subtle text-sm md:text-md  flex items-center gap-[0.4rem] mt-[0.1rem]">
              <span>{location}</span>
              <span className="opacity-40">·</span>
              <span>{memberCount} üye</span>
              <span className="opacity-40">·</span>
              <span >
                {postedAt}
              </span>
            </div>
          </div>
        </div>

        {/* Başlık */}
        <div className="py-1.5 sm:py-3 font-semibold text-ink-muted text-xl md:text-2xl text-justify mb-1 ">
          {title}
        </div>

        {/* Açıklama */}
        {body && (
          <div className="text-body text-md md:text-lg text-ink text-justify leading-[1.6] mb-2 sm:mb-3">
            {displayBody}
            {isLong && (
              <>
                {" "}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded((v) => !v);
                  }}
                  style={{color:"#3764ec"}}
                  className="font-semibold cursor-pointer bg-transparent border-none ms-2"
                >
                  {expanded ? "Daha az" : "Devamını oku"}
                </button>
              </>
            )}
          </div>
        )}
        {/* Detay butonu — sağ alt */}
        {!disableNavigation && (
          <div className="flex justify-end mb-3 sm:mb-4">
            <button
              onClick={() => router.push(`/dashboard/posts/teams/${postId}`)}
              className="flex items-center text-sm text-ink py-1 px-2 rounded-lg font-bold"
            >
              <span style={{ color: "#3764ec" }}>Detay</span>
              <ChevronRight style={{ color: "#3764ec" }} className="w-3.5 h-3.5 ms-1" />
            </button>
          </div>
        )}

        {/* Görseller */}
        {imageUrls && imageUrls.length > 0 && (
          <LightGallery
            elementClassNames={
              imageUrls.length === 1
                ? "mb-4"
                : imageUrls.length === 2
                  ? "grid grid-cols-2 gap-1 mb-4"
                  : imageUrls.length === 3
                    ? "grid grid-cols-3 gap-1 mb-4"
                    : "grid grid-cols-2 gap-1 mb-4"
            }
            plugins={[lgZoom, lgShare]}
            speed={300}
          >
            {imageUrls.slice(0, 4).map((url, i) => (
              <a
                key={i}
                data-src={url}
                className="block w-full cursor-zoom-in overflow-hidden rounded-[8px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className={`w-full object-cover rounded-[8px] ${
                    imageUrls.length === 1 ? "max-h-[420px]" : "h-[180px]"
                  }`}
                />
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
        <div className="flex items-center gap-2 pt-2.5 sm:pt-4 border-t">
          {/* Beğeni */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
              heartRef.current?.play();
            }}
            disabled={isPending}
            className={`flex items-center gap-[0.35rem] border rounded-md font-jakarta text-caption font-semibold h-auto px-[0.85rem] py-[0.4rem] transition-all duration-150 ${
              isLiked
                ? "border-danger-surface text-danger bg-danger-surface hover:bg-danger-surface hover:text-danger"
                : "text-white hover:border-brand hover:text-brand hover:bg-brand-surface"
            }`}
          >
            <Lottie
              lottieRef={heartRef}
              animationData={heartIcon}
              loop={false}
              autoplay={false}
              style={{ width: 18, height: 18 }}
            />
            {likeCount}
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
