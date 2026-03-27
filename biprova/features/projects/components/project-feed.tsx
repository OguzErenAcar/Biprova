import { ProjectCard } from "@/features/projects/components/project-card";

const FILTER_TABS = ["Tümü", "Şehrim", "Remote", "Takip"];

const MOCK_PROJECTS = [
  {
    city: "İzmir",
    isRemote: false,
    status: "almost" as const,
    category: "Sosyal",
    postedAt: "2 saat önce",
    title: "Sokak Hayvanlarına Yardım Organizasyonu",
    description:
      "İzmir'de sokak hayvanlarına mama ve sağlık desteği sağlamak için küçük ama güçlü bir ekip arıyoruz.",
    poster: { name: "Zeynep K.", initials: "ZK", color: "#22c55e" },
    roles: [
      { name: "Veteriner", filled: true },
      { name: "Veteriner", filled: true },
      { name: "Haberci", filled: false },
      { name: "Fotoğrafçı", filled: false },
    ],
  },
  {
    city: "Remote",
    isRemote: true,
    status: "open" as const,
    category: "Medya",
    postedAt: "5 saat önce",
    title: "Girişimcilik & Teknoloji Podcast'i",
    description:
      "Her hafta bir girişimciyle röportaj yapacağımız, tamamen remote çalışan bir podcast ekibi kuruyoruz.",
    poster: { name: "Mert O.", initials: "MO", color: "#8b5cf6" },
    roles: [
      { name: "İçerik Üretici", filled: true },
      { name: "Ses Editör", filled: true },
      { name: "Grafiker", filled: false },
      { name: "Pazarlama", filled: false },
    ],
  },
  {
    city: "Ankara",
    isRemote: false,
    status: "open" as const,
    category: "Çevre",
    postedAt: "1 gün önce",
    title: "Mahalle Bostanı Kurma Girişimi",
    description:
      "Ankara Çankaya'da boş bir alanı topluluk bostanına dönüştürmek istiyoruz. Elini taşın altına koymak isteyenler burada!",
    poster: { name: "Elif A.", initials: "EA", color: "#f59e0b" },
    roles: [
      { name: "Ziraat Müh.", filled: false },
      { name: "Sosyal Hizmet", filled: false },
      { name: "Grafiker", filled: false },
    ],
  },
];

export function ProjectFeed() {
  return (
    <div>
      {/* Başlık + filtreler */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-nunito font-black text-[1.1rem] text-slate-900">
          📋 Timeline
        </h2>
        <div className="hidden sm:flex gap-[0.4rem] bg-white border-[1.5px] border-slate-200 rounded-[10px] p-[0.3rem]">
          {FILTER_TABS.map((tab, i) => (
            <button
              key={tab}
              className={`text-[0.78rem] font-bold font-jakarta px-[0.8rem] py-[0.35rem] rounded-[7px] cursor-pointer transition-all duration-150 border-none ${
                i === 0
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Proje kartları */}
      <div className="space-y-4">
        {MOCK_PROJECTS.map((project, i) => (
          <ProjectCard key={i} {...project} />
        ))}
      </div>
    </div>
  );
}
