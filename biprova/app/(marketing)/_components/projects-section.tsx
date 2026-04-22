import { ProjectCard } from "./project-card";

const MOCK_PROJECTS = [
  {
    city: "İzmir",
    isRemote: false,
    status: "almost" as const,
    title: "Sokak Hayvanlarına Yardım Organizasyonu",
    description:
      "Sokak hayvanlarının kısırlaştırma, aşılama ve sahiplendirme süreçlerini yürütecek gönüllü bir ekip kuruyoruz. Belediye ile ortak çalışma imkânımız var.",
    poster: { name: "Ayşe Kaya", initials: "AK", color: "#7c3aed", badge: null },
    roles: [
      { name: "Veteriner", filled: true },
      { name: "Veteriner", filled: true },
      { name: "Haberci", filled: false },
      { name: "Fotoğrafçı", filled: false },
    ],
  },
  {
    city: "İstanbul",
    isRemote: false,
    status: "open" as const,
    title: "Bağımsız Kısa Film Projesi",
    description:
      "İstanbul'un gece yarısı sokaklarında geçen 20 dakikalık bir kısa film çekiyoruz. Senaryo hazır, lokasyon seçildi; şimdi ekip arıyoruz.",
    poster: { name: "Mert Demir", initials: "MD", color: "#0ea5e9", badge: "pro" },
    roles: [
      { name: "Yönetmen", filled: true },
      { name: "Kameraman", filled: false },
      { name: "Ses Tasarımcı", filled: false },
      { name: "Oyuncu", filled: false },
    ],
  },
  {
    city: "Ankara",
    isRemote: true,
    status: "almost" as const,
    title: "Girişimcilik Podcast'i",
    description:
      "Türkiye'deki erken aşama kurucularla haftalık röportajlar yapacağız. İlk 10 bölüm için sponsor görüşmelerimiz sürüyor.",
    poster: { name: "Selin Arslan", initials: "SA", color: "#f59e0b", badge: null },
    roles: [
      { name: "İçerik Üretici", filled: true },
      { name: "Ses Editör", filled: true },
      { name: "Grafiker", filled: true },
      { name: "Pazarlama", filled: false },
    ],
  },
  {
    city: "Ankara",
    isRemote: false,
    status: "open" as const,
    title: "Mahalle Bostanı Kurma Girişimi",
    description:
      "Çankaya'da boş bir arazi tahsis edildi. Organik sebze yetiştirip mahalleye dağıtacak bir ekip oluşturuyoruz. Belediye desteği var.",
    poster: { name: "Can Öztürk", initials: "CÖ", color: "#10b981", badge: null },
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-5">
        {MOCK_PROJECTS.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </section>
  );
}
