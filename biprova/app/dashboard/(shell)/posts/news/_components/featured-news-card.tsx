"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NewsTag } from "./news-data";

const TAG_STYLES: Record<NewsTag, string> = {
  platform: "bg-brand-surface text-brand border-brand-surface",
  girişim:  "bg-success-surface text-success border-success-surface",
  etkinlik: "bg-warning-surface text-warning border-warning-surface",
  duyuru:   "bg-purple-50 text-purple-600 border-purple-100",
  başarı:   "bg-danger-surface text-danger border-danger-surface",
};

const TAG_LABELS: Record<NewsTag, string> = {
  platform: "Platform",
  girişim:  "Girişim",
  etkinlik: "Etkinlik",
  duyuru:   "Duyuru",
  başarı:   "Başarı Hikayesi",
};

interface FeaturedNewsCardProps {
  id: string;
  title: string;
  excerpt: string;
  tags: readonly NewsTag[];
  date: string;
}

export function FeaturedNewsCard({ id, title, excerpt, tags, date }: FeaturedNewsCardProps) {
  const router = useRouter();

  return (
    <Card
      id="featured-news-card"
      className="mb-3.5 cursor-pointer hover:-translate-y-0.5 hover:shadow-feature transition-all duration-150 overflow-hidden"
      onClick={() => router.push(`/dashboard/posts/news/${id}`)}
    >
      <div className="h-[200px] bg-gradient-to-br from-brand-hover via-indigo-500 to-violet-500 flex items-center justify-center text-[4rem] relative">
        🚀
        <span className="absolute top-4 left-4 bg-canvas/20 border border-white/30 backdrop-blur-sm text-white text-meta font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
          📌 Öne Çıkan
        </span>
      </div>

      <CardContent className="p-[1.4rem]">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className={`text-label font-bold ${TAG_STYLES[tag]}`}>
              {TAG_LABELS[tag]}
            </Badge>
          ))}
          <span className="text-meta text-ink-subtle ml-auto">{date}</span>
        </div>

        <div className="font-nunito font-black text-title leading-[1.35] text-ink mb-2">
          {title}
        </div>

        <p className="text-body text-ink-muted leading-[1.6] mb-4">
          {excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-meta text-ink-muted font-semibold">
            biprova Ekibi
            <Badge variant="outline" className="bg-brand-surface border-brand-surface text-black font-extrabold">
              Admin
            </Badge>
          </div>
          <button className="text-ink font-bold p-0 h-auto">
            Devamı →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
