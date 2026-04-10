import { ProjectCard } from "./project-card";

const MOCK_PROJECTS = [
  {
    city: "📍 İzmir",
    status: "almost" as const,
    title: "Sokak Hayvanlarına Yardım Organizasyonu",
    roles: [
      { name: "Veteriner", filled: true },
      { name: "Veteriner", filled: true },
      { name: "Haberci", filled: false },
      { name: "Fotoğrafçı", filled: false },
    ],
  },
  {
    city: "📍 İstanbul",
    status: "open" as const,
    title: "Bağımsız Kısa Film Projesi",
    roles: [
      { name: "Yönetmen", filled: true },
      { name: "Kameraman", filled: false },
      { name: "Ses Tasarımcı", filled: false },
      { name: "Oyuncu", filled: false },
    ],
  },
  {
    city: "🌐 Remote",
    status: "almost" as const,
    title: "Girişimcilik Podcast'i",
    roles: [
      { name: "İçerik Üretici", filled: true },
      { name: "Ses Editör", filled: true },
      { name: "Grafiker", filled: true },
      { name: "Pazarlama", filled: false },
    ],
  },
  {
    city: "📍 Ankara",
    status: "open" as const,
    title: "Mahalle Bostanı Kurma Girişimi",
    roles: [
      { name: "Ziraat Müh.", filled: false },
      { name: "Sosyal Hizmet", filled: false },
      { name: "Grafiker", filled: false },
    ],
  },
];

export function ProjectsSection() {
  return (
    <section className="pt-0 pb-16 sm:pb-20 px-0 sm:px-8 max-w-[1080px] mx-auto">
      <p className="text-[0.75rem] font-bold tracking-[3px] uppercase text-blue-600 mb-2">
        Örnek Projeler
      </p>
      <h2 className="font-nunito font-black text-[clamp(1.8rem,4vw,2.8rem)] tracking-[-1px] leading-[1.15] mb-12">
        Her alandan, her şehirden  
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-0 sm:gap-5 sm:px-0 px-0 divide-y sm:divide-y-0">
        {MOCK_PROJECTS.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </section>
  );
}
