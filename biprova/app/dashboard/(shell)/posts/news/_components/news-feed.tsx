import { Separator } from "@/components/ui/separator";
import { FeaturedNewsCard } from "./featured-news-card";
import { NewsCard, type NewsCardProps } from "./news-card";

const FEATURED_POST = {
  title: "biprova resmen yayında! Türkiye'nin ekip bulma platformu açıldı",
  excerpt:
    "Uzun beta sürecinin ardından biprova tüm kullanıcılara açıldı. LinkedIn ile saniyeler içinde giriş yap, projenin için doğru ekip arkadaşlarını bul. İlk 100 üyeye özel Kurucu Rozeti kazanma fırsatını kaçırma.",
  tags: ["platform", "duyuru"] as const,
  date: "24 Mart 2026",
};

const LATEST_POSTS: NewsCardProps[] = [
  {
    title: "Sokak Hayvanları Yardım ekibi 3 ayda 500 hayvana ulaştı",
    excerpt:
      "biprova üzerinden kurulan ilk ekiplerden biri olan Sokak Hayvanları Yardım Grubu, İzmir genelinde büyük bir etki yarattı. Ekip lideri Zeynep K. ile konuştuk.",
    tag: "başarı",
    date: "22 Mart 2026",
    readTime: "4 dk okuma",
    emoji: "🏆",
    thumbBg: "#dcfce7",
  },
  {
    title: "İstanbul Buluşması — 5 Nisan'da bir aradayız",
    excerpt:
      "biprova kullanıcılarını bir araya getireceğimiz ilk yüz yüze etkinlik İstanbul Kadıköy'de gerçekleşecek. Katılım ücretsiz, kontenjan sınırlı.",
    tag: "etkinlik",
    date: "20 Mart 2026",
    readTime: "2 dk okuma",
    emoji: "🎤",
    thumbBg: "#fef3c7",
  },
  {
    title: "Yeni özellik: Ekip gönderileri artık ana akışta görünüyor",
    excerpt:
      "Kurulan ekipler artık yaptıkları çalışmaları platforma paylaşabiliyor. Sadece ekip üyeleri gönderi oluşturabilir — bireysel paylaşım yok.",
    tag: "platform",
    date: "18 Mart 2026",
    readTime: "2 dk okuma",
    emoji: "✨",
    thumbBg: "#ede9fe",
  },
];

const STARTUP_POSTS: NewsCardProps[] = [
  {
    title: "Türkiye'de yan proje kültürü büyüyor: rakamlar ne diyor?",
    excerpt:
      "Son araştırmalara göre Türkiye'deki çalışanların %38'i aktif olarak yan proje geliştiriyor. Bu oran 2023'e göre iki katına çıktı.",
    tag: "girişim",
    date: "15 Mart 2026",
    readTime: "5 dk okuma",
    emoji: "💡",
    thumbBg: "#fce7f3",
  },
  {
    title: "Sosyal girişimcilik: Kar gütmeden büyük etki yaratmanın 5 yolu",
    excerpt:
      "Biprova'da en çok proje açılan alan olan sosyal girişimcilik üzerine derlediğimiz ipuçları ve başarılı ekiplerden öğrendiklerimiz.",
    tag: "girişim",
    date: "12 Mart 2026",
    readTime: "6 dk okuma",
    emoji: "🌱",
    thumbBg: "#ecfdf5",
  },
  {
    title: 'Ankara\'da "Projen Var mı?" buluşması — 12 Nisan',
    excerpt:
      "Ankara'daki biprova kullanıcıları için ikinci şehir buluşmasını duyuruyoruz. Kendi projenle gel, ekip arkadaşı bul veya var olan bir projeye katıl.",
    tag: "etkinlik",
    date: "8 Mart 2026",
    readTime: "3 dk okuma",
    emoji: "🎬",
    thumbBg: "#fef9c3",
  },
];

export function NewsFeed() {
  return (
    <div id="news-feed">
      <FeaturedNewsCard {...FEATURED_POST} />

      {LATEST_POSTS.map((post) => (
        <NewsCard key={post.title} {...post} />
      ))}

      <div className="flex items-center gap-3 my-6">
        <span className="font-nunito font-black text-lead text-ink whitespace-nowrap">
          Girişim Haberleri
        </span>
        <Separator className="flex-1" />
      </div>

      {STARTUP_POSTS.map((post) => (
        <NewsCard key={post.title} {...post} />
      ))}
    </div>
  );
}
