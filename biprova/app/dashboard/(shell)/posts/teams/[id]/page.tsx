import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BackButton } from "@/components/shared/back-button";
import { TeamPostCard } from "@/features/teams/components/team-post-card";

const MEMBER_COLORS = [
  "#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b",
  "#ef4444", "#06b6d4", "#ec4899", "#f97316",
];

function hashIndex(str: string, len: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % len;
}

function getInitials(name: string): string {
  return name.split(" ").slice(0, 2).map((n) => n[0]?.toUpperCase() ?? "").join("");
}

function parseContent(content: string): { title: string; body: string } {
  const newlineIdx = content.indexOf("\n");
  if (newlineIdx > 0 && newlineIdx <= 120) {
    return { title: content.slice(0, newlineIdx).trim(), body: content.slice(newlineIdx + 1).trim() };
  }
  if (content.length <= 120) return { title: content, body: "" };
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

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TeamPostDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("team_posts")
    .select(`
      id, content, image_urls, like_count, created_at,
      teams!team_id(
        id,
        projects!project_id(title, city, is_remote, project_categories(name)),
        team_members(user_id, users(id, name))
      ),
      team_post_likes(user_id)
    `)
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const raw = data as unknown as {
    id: string;
    content: string;
    image_urls: string[];
    like_count: number;
    created_at: string;
    teams: {
      id: string;
      projects: {
        title: string;
        city: string | null;
        is_remote: boolean | null;
        project_categories: { name: string } | null;
      } | null;
      team_members: { user_id: string; users: { id: string; name: string } | null }[];
    } | null;
    team_post_likes: { user_id: string }[];
  };

  if (!raw.teams?.projects) notFound();

  const members = raw.teams.team_members
    .filter((m) => m.users !== null)
    .map((m) => ({ id: m.users!.id, name: m.users!.name }));

  const { title, body } = parseContent(raw.content);
  const category = raw.teams.projects.project_categories?.name ?? null;
  const location = raw.teams.projects.is_remote
    ? "Remote"
    : raw.teams.projects.city ?? "Belirtilmemiş";

  const tags = [
    ...(category ? [{ type: "category" as const, label: category }] : []),
    ...(raw.teams.projects.is_remote
      ? [{ type: "city" as const, label: "🌐 Remote" }]
      : raw.teams.projects.city
        ? [{ type: "city" as const, label: `📍 ${raw.teams.projects.city}` }]
        : []),
  ];

  return (
    <div className=" mx-auto pt-4 md:me-8">
      <BackButton />
      <TeamPostCard
        postId={raw.id}
        teamId={raw.teams.id}
        teamName={raw.teams.projects.title}
        location={location}
        memberCount={members.length}
        postedAt={formatPostedAt(raw.created_at)}
        tags={tags}
        title={title}
        body={body}
        imageUrls={raw.image_urls.length > 0 ? raw.image_urls : undefined}
        members={members.map((m) => ({
          initials: getInitials(m.name),
          name: m.name,
          color: MEMBER_COLORS[hashIndex(m.id, MEMBER_COLORS.length)],
        }))}
        likes={raw.like_count}
        comments={0}
        liked={raw.team_post_likes.some((l) => l.user_id === user?.id)}
        disableNavigation
      />
    </div>
  );
}
