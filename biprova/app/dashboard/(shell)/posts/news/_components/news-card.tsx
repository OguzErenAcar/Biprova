type NewsTag = "platform" | "girişim" | "etkinlik" | "duyuru" | "başarı";

const TAG_STYLES: Record<NewsTag, string> = {
  platform: "bg-blue-50 text-blue-600",
  girişim:  "bg-green-50 text-green-700",
  etkinlik: "bg-amber-50 text-amber-800",
  duyuru:   "bg-purple-50 text-purple-600",
  başarı:   "bg-red-50 text-red-700",
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
    <div className="bg-white border border-slate-200 rounded-[16px] p-[1.3rem] mb-3.5 cursor-pointer flex gap-4 items-start hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.07)] transition-all duration-150">
      <div
        className="w-20 h-20 rounded-[12px] flex-shrink-0 flex items-center justify-center text-[1.9rem]"
        style={{ background: thumbBg }}
      >
        {emoji}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <span className={`text-[0.7rem] font-bold px-2.5 py-1 rounded-full ${TAG_STYLES[tag]}`}>
            {TAG_LABELS[tag]}
          </span>
          <span className="text-[0.72rem] text-slate-400">{date}</span>
        </div>

        <div className="font-nunito font-black text-[0.95rem] leading-[1.35] text-slate-900 mb-1.5">
          {title}
        </div>

        <p className="text-[0.8rem] text-slate-500 leading-[1.5] mb-2.5 line-clamp-2">
          {excerpt}
        </p>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-[0.76rem] text-slate-500 font-semibold">
            biprova Ekibi
            <span className="bg-blue-50 text-blue-600 text-[0.65rem] font-extrabold px-1.5 py-0.5 rounded-[5px]">
              Admin
            </span>
          </div>
          <span className="text-[0.72rem] text-slate-400">{readTime}</span>
        </div>
      </div>
    </div>
  );
}
