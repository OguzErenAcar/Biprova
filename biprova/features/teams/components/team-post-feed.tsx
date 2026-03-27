import { TeamPostCard } from "./team-post-card";
import { getTeamPostFeed } from "@/features/teams/actions";

const FILTER_TABS = ["Tümü", "Takip", "Güncellemeler", "Duyurular"];

const AVATAR_BG_COLORS = [
  "#ede9fe", "#dbeafe", "#dcfce7", "#fef3c7",
  "#fee2e2", "#cffafe", "#fce7f3", "#ffedd5",
];

const MEMBER_COLORS = [
  "#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b",
  "#ef4444", "#06b6d4", "#ec4899", "#f97316",
];

const CATEGORY_EMOJIS: Record<string, string> = {
  Sosyal:     "🤝",
  Medya:      "🎙️",
  Çevre:      "🌱",
  Sanat:      "🎬",
  Teknoloji:  "💻",
  Eğitim:     "📚",
  Sağlık:     "🏥",
  Spor:       "⚽",
  Müzik:      "🎵",
};

function hashIndex(str: string, len: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % len;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

function parseContent(content: string): { title: string; body: string } {
  const newlineIdx = content.indexOf("\n");
  if (newlineIdx > 0 && newlineIdx <= 120) {
    return {
      title: content.slice(0, newlineIdx).trim(),
      body: content.slice(newlineIdx + 1).trim(),
    };
  }
  if (content.length <= 120) {
    return { title: content, body: "" };
  }
  return { title: content.slice(0, 90).trimEnd() + "…", body: content };
}

function formatPostedAt(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün önce`;
  return `${Math.floor(days / 7)} hafta önce`;
}

export async function TeamPostFeed() {
  const posts = await getTeamPostFeed();

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
      {posts.length === 0 ? (
        <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl p-10 text-center text-slate-400 text-[0.9rem]">
          Henüz ekip gönderisi yok.
        </div>
      ) : (
        <div>
          {posts.map((post) => {
            const { title, body } = parseContent(post.content);
            const category = post.team.category;
            const teamEmoji = CATEGORY_EMOJIS[category ?? ""] ?? "🚀";
            const teamAvatarBg = AVATAR_BG_COLORS[hashIndex(post.team.id, AVATAR_BG_COLORS.length)];
            const location = post.team.isRemote
              ? "🌐 Remote"
              : post.team.city
              ? `📍 ${post.team.city}`
              : "📍 Belirtilmemiş";

            const tags = [
              ...(category ? [{ type: "category" as const, label: category }] : []),
              ...(post.team.isRemote
                ? [{ type: "city" as const, label: "🌐 Remote" }]
                : post.team.city
                ? [{ type: "city" as const, label: `📍 ${post.team.city}` }]
                : []),
            ];

            const members = post.team.members.map((m) => ({
              initials: getInitials(m.name),
              name: m.name,
              color: MEMBER_COLORS[hashIndex(m.id, MEMBER_COLORS.length)],
            }));

            return (
              <TeamPostCard
                key={post.id}
                teamEmoji={teamEmoji}
                teamAvatarBg={teamAvatarBg}
                teamName={post.team.projectTitle}
                location={location}
                memberCount={post.team.members.length}
                postedAt={formatPostedAt(post.createdAt)}
                tags={tags}
                title={title}
                body={body}
                members={members}
                likes={post.likeCount}
                comments={0}
                liked={post.isLiked}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
