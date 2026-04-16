import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/shared/back-button";
import { NEWS_ITEMS, type NewsTag } from "../_components/news-data";

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

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const item = NEWS_ITEMS.find((n) => n.id === id);
  if (!item) notFound();

  const allTags: NewsTag[] = item.featured
    ? [...(item.tags ?? [])]
    : [item.tag!];

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4">
      <BackButton />
      <Card className="overflow-hidden">
        {item.featured && (
          <div className="h-[200px] bg-gradient-to-br from-brand-hover via-indigo-500 to-violet-500 flex items-center justify-center text-[4rem] relative">
            🚀
            <span className="absolute top-4 left-4 bg-canvas/20 border border-white/30 backdrop-blur-sm text-white text-meta font-extrabold px-3 py-1 rounded-full">
              📌 Öne Çıkan
            </span>
          </div>
        )}
        <CardContent className="p-[1.4rem]">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {allTags.map((tag) => (
              <Badge key={tag} variant="outline" className={`text-label font-bold ${TAG_STYLES[tag]}`}>
                {TAG_LABELS[tag]}
              </Badge>
            ))}
            <span className="text-meta text-ink-subtle ml-auto">{item.date}</span>
          </div>

          <div className="font-nunito font-black text-title leading-[1.35] text-ink mb-4">
            {item.title}
          </div>

          <p className="text-body text-ink-muted leading-[1.7] mb-6">
            {item.excerpt}
          </p>

          <div className="flex items-center gap-1.5 text-meta text-ink-muted font-semibold">
            biprova Ekibi
            <Badge variant="outline" className="bg-brand-surface border-brand-surface text-black font-extrabold">
              Admin
            </Badge>
            {item.readTime && (
              <span className="ml-2 text-ink-subtle">{item.readTime}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
