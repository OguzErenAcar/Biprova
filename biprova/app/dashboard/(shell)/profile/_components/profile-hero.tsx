"use client";

import { UserProfile } from "@/features/users/actions";
import { ProfileEditModal } from "./profile-edit-modal";
import { CvViewDialog } from "./cv-view-dialog";
import { ImageUploadButton } from "./image-upload-button";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LottieIcon } from "@/components/shared/lottie-icon";
import cityIcon from "@/app/icons/wired-outline-1918-city-hall-hover-pinch.json";
import clockIcon from "@/app/icons/wired-outline-236-alarm-clock-hover-pinch.json";

interface ProfileHeroProps {
  user: UserProfile;
  isOwner?: boolean;
}

function formatMemberSince(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    month: "long",
    year: "numeric",
  });
}

export function ProfileHero({ user, isOwner = false }: ProfileHeroProps) {
  return (
    <Card id="profile-hero" className="mb-5 overflow-hidden">
      {/* Cover */}
      <div className="relative h-[150px]">
        {user.cover_url ? (
          <img src={user.cover_url} alt="Kapak fotoğrafı" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-hover via-indigo-500 to-violet-500" />
        )}
        {isOwner && (
          <ImageUploadButton type="cover" userId={user.id} currentUrl={user.cover_url}>
            <></>
          </ImageUploadButton>
        )}
      </div>

      <div className="px-[25px] sm:px-6 pb-3 sm:pb-6  sm:py-0 relative">
        {/* Avatar — mobil: ortada (transform yok → fixed modal çalışsın), desktop: sol absolute */}
        <div className="absolute -top-[60px] left-[calc(50%-50px)] sm:-top-[60px] sm:left-6 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px]">
          <div className="relative w-full h-full rounded-full border-4 border-white shadow-brand overflow-hidden bg-white">
            <UserAvatar
              avatarUrl={user.avatar_url}
              alt={user.name}
              className="w-full h-full"
            />
            {isOwner && (
              <ImageUploadButton type="avatar" userId={user.id} currentUrl={user.avatar_url}>
                <></>
              </ImageUploadButton>
            )}
          </div>
          {user.badge_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.badge_url} alt="badge" className="absolute bottom-0 right-0 w-[34%] h-[34%] object-contain pointer-events-none z-10" />
          )}
        </div>

        {/* Aksiyon butonları — mobil: avatar altında ortalı, desktop: sağ absolute */}
        <div className="flex justify-center sm:justify-start sm:absolute sm:right-5 sm:top-0 sm:my-8 pt-[58px] sm:pt-0 mb-3 sm:mb-0 gap-2">
          {user.linkedin_url && (
            <Button asChild size="sm" className="bg-[#0a66c2] hover:bg-[#004182] text-white gap-1.5 font-bold">
              <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </Button>
          )}
          {(isOwner || user.cv_public) && <CvViewDialog cvUrl={user.cv_url} />}
          {isOwner && <ProfileEditModal user={user} />}
        </div>

        {/* İsim + rozet */}
        <div className="flex items-center justify-between sm:pt-20 mb-2 flex-col sm:flex-row gap-1 sm:gap-0 text-center sm:text-left">
          <div className="mt-4 sm:mt-4 font-black text-h2 text-ink">{user.name}</div>
          {user.badge && (
            <Badge variant="outline" className="bg-warning-surface text-warning border-warning-surface font-bold gap-1.5">
              🏅 {user.badge}
            </Badge>
          )}
        </div>

        {user.bio && (
          <p className="text-body text-ink-muted leading-relaxed mb-6 mt-6 text-center sm:text-left">{user.bio}</p>
        )}

        <div className="flex flex-wrap gap-4 text-caption text-ink-muted justify-center sm:justify-start">
          {user.city && <span className="flex items-center gap-1"><LottieIcon animationData={cityIcon} size={20} /> {user.city}</span>}
          <span className="flex items-center gap-1"><LottieIcon animationData={clockIcon} size={20} /> {formatMemberSince(user.created_at)}&apos;den beri üye</span>
        </div>
      </div>
    </Card>
  );
}
