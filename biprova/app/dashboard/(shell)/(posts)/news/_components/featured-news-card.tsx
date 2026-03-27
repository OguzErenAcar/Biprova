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

interface FeaturedNewsCardProps {
  title: string;
  excerpt: string;
  tags: NewsTag[];
  date: string;
}

export function FeaturedNewsCard({ title, excerpt, tags, date }: FeaturedNewsCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-[18px] overflow-hidden mb-5 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)] transition-all duration-150">
      <div className="h-[200px] bg-gradient-to-br from-blue-800 via-indigo-500 to-violet-500 flex items-center justify-center text-[4rem] relative">
        🚀
        <span className="absolute top-4 left-4 bg-white/20 border border-white/30 backdrop-blur-sm text-white text-[0.72rem] font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
          📌 Öne Çıkan
        </span>
      </div>

      <div className="p-[1.4rem]">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {tags.map((tag) => (
            <span key={tag} className={`text-[0.7rem] font-bold px-2.5 py-1 rounded-full ${TAG_STYLES[tag]}`}>
              {TAG_LABELS[tag]}
            </span>
          ))}
          <span className="text-[0.72rem] text-slate-400 ml-auto">{date}</span>
        </div>

        <div className="font-nunito font-black text-[1.2rem] leading-[1.35] text-slate-900 mb-2">
          {title}
        </div>

        <p className="text-[0.86rem] text-slate-500 leading-[1.6] mb-4">
          {excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[0.76rem] text-slate-500 font-semibold">
            biprova Ekibi
            <span className="bg-blue-50 text-blue-600 text-[0.65rem] font-extrabold px-1.5 py-0.5 rounded-[5px]">
              Admin
            </span>
          </div>
          <span className="text-[0.8rem] font-bold text-blue-600 cursor-pointer hover:underline">
            Devamını Oku →
          </span>
        </div>
      </div>
    </div>
  );
}
