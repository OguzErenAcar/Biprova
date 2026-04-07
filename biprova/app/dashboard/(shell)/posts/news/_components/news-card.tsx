import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type NewsTag = "platform" | "girişim" | "etkinlik" | "duyuru" | "başarı";

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

export interface NewsCardProps {
  title: string;
  excerpt: string;
  tag: NewsTag;
  date: string;
  readTime: string;
  emoji: string;
  thumbBg: string;
}

export function NewsCard({ title, excerpt, tag, date, readTime, emoji, thumbBg }: NewsCardProps) {
  return (
    <Card className="mb-3.5 cursor-pointer hover:-translate-y-0.5 hover:shadow-card transition-all duration-150">
      <CardContent className="p-[1.3rem] flex gap-4 items-start">
        <div
          className="w-20 h-20 rounded-[12px] flex-shrink-0 flex items-center justify-center text-hero"
          style={{ background: thumbBg }}
        >
          {emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <Badge variant="outline" className={`text-label font-bold ${TAG_STYLES[tag]}`}>
              {TAG_LABELS[tag]}
            </Badge>
            <span className="text-meta text-ink-subtle">{date}</span>
          </div>

          <div className="font-nunito font-black text-lead leading-[1.35] text-ink mb-1.5">
            {title}
          </div>

          <p className="text-caption text-ink-muted leading-[1.5] mb-2.5 line-clamp-2">
            {excerpt}
          </p>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-meta text-ink-muted font-semibold">
              biprova Ekibi
              <Badge variant="outline" className="bg-brand-surface text-brand border-brand-surface text-label font-extrabold">
                Admin
              </Badge>
            </div>
            <span className="text-meta text-ink-subtle">{readTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
