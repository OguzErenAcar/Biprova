import { TeamPostCard } from "./team-post-card";

const FILTER_TABS = ["Tümü", "Takip", "Güncellemeler", "Duyurular"];

const MOCK_POSTS = [
  {
    teamEmoji: "🐾",
    teamAvatarBg: "#ede9fe",
    teamName: "Sokak Hayvanları Yardım Ekibi",
    location: "📍 İzmir",
    memberCount: 4,
    postedAt: "2 saat önce",
    tags: [
      { type: "update" as const, label: "🟢 Güncelleme" },
      { type: "city" as const, label: "📍 İzmir" },
      { type: "category" as const, label: "Sosyal" },
    ],
    title: "İlk mama dağıtımını tamamladık! 🎉",
    body: "Bu hafta İzmir Konak'ta 3 farklı noktada 120 sokak hayvanına mama dağıttık. Veteriner arkadaşımız Zeynep de aşı takibini başlattı. Desteğiniz için teşekkürler!",
    hasImage: true,
    members: [
      { initials: "ZK", name: "Zeynep K.", color: "#22c55e" },
      { initials: "AT", name: "Ali T.", color: "#3b82f6" },
      { initials: "MB", name: "Merve B.", color: "#8b5cf6" },
      { initials: "CS", name: "Cem S.", color: "#f59e0b" },
    ],
    likes: 48,
    comments: 12,
    liked: true,
  },
  {
    teamEmoji: "🎙️",
    teamAvatarBg: "#fef3c7",
    teamName: "Girişimcilik Podcast Ekibi",
    location: "🌐 Remote",
    memberCount: 4,
    postedAt: "5 saat önce",
    tags: [
      { type: "milestone" as const, label: "🏆 Kilometre Taşı" },
      { type: "category" as const, label: "Medya" },
    ],
    title: "1000 dinleyiciye ulaştık! 🎧",
    body: "3. bölümümüzü yayınladık ve toplam dinleyici sayımız 1000'i geçti. Bu hafta Ankara'daki genç girişimci Selin Yıldız ile konuştuk; iş modelinden erken kullanıcı kazanmaya kadar pek çok konuyu ele aldık.",
    members: [
      { initials: "MO", name: "Mert O.", color: "#8b5cf6" },
      { initials: "EA", name: "Elif A.", color: "#22c55e" },
      { initials: "BK", name: "Burak K.", color: "#f59e0b" },
      { initials: "SY", name: "Selin Y.", color: "#ef4444" },
    ],
    likes: 31,
    comments: 7,
  },
  {
    teamEmoji: "🌱",
    teamAvatarBg: "#dcfce7",
    teamName: "Mahalle Bostanı Ekibi",
    location: "📍 Ankara",
    memberCount: 3,
    postedAt: "1 gün önce",
    tags: [
      { type: "announcement" as const, label: "📢 Duyuru" },
      { type: "city" as const, label: "📍 Ankara" },
      { type: "category" as const, label: "Çevre" },
    ],
    title: "İkinci alana başladık — sosyal medya gönüllüsü arıyoruz",
    body: "Çankaya'daki ilk bostanımız hasat vermeye başladı! Şimdi Keçiören'de ikinci alanı hazırlıyoruz. Süreci belgeleyecek, sosyal medyayı yönetecek bir gönüllü ekip üyesine ihtiyacımız var.",
    members: [
      { initials: "EA", name: "Elif A.", color: "#22c55e" },
      { initials: "KD", name: "Kemal D.", color: "#3b82f6" },
      { initials: "NB", name: "Naz B.", color: "#f59e0b" },
    ],
    likes: 19,
    comments: 4,
  },
  {
    teamEmoji: "🎬",
    teamAvatarBg: "#dbeafe",
    teamName: "Kısa Film Projesi",
    location: "📍 İstanbul",
    memberCount: 4,
    postedAt: "3 gün önce",
    tags: [
      { type: "update" as const, label: "🟢 Güncelleme" },
      { type: "city" as const, label: "📍 İstanbul" },
      { type: "category" as const, label: "Sanat" },
    ],
    title: "Senaryo kilidi kırıldı, çekimlere hazırız!",
    body: "3 haftalık yoğun çalışmanın ardından senaryomuzu tamamladık. Beykoz'da iki lokasyon netleşti, kostüm ve ekipman listesi hazır. Önümüzdeki Cumartesi ilk sahne çekimini yapıyoruz!",
    members: [
      { initials: "AK", name: "Ahmet K. (Sen)", color: "#3b82f6" },
      { initials: "ME", name: "Mert E.", color: "#8b5cf6" },
      { initials: "SY", name: "Selin Y.", color: "#22c55e" },
      { initials: "BT", name: "Berk T.", color: "#f59e0b" },
    ],
    likes: 62,
    comments: 18,
    liked: true,
    isOwnTeam: true,
  },
];

export function TeamPostFeed() {
  return (
    <div>
      {/* Başlık + filtreler */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-nunito font-black text-[1.1rem] text-slate-900">
          👥 Ekip Gönderileri
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

      {/* Gönderi kartları */}
      <div>
        {MOCK_POSTS.map((post, i) => (
          <TeamPostCard key={i} {...post} />
        ))}
      </div>
    </div>
  );
}
