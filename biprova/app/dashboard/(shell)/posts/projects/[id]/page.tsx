import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectCard } from "@/features/projects/components/project-card";
import { resolveBadgeUrls } from "@/lib/badge";
import { BackButton } from "@/components/shared/back-button";

const POSTER_COLORS = [
  "#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b",
  "#e7d6d6", "#06b6d4", "#ec4899", "#dbb193",
];

function getPosterColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return POSTER_COLORS[Math.abs(hash) % POSTER_COLORS.length];
}

function getInitials(name: string): string {
  return name.split(" ").slice(0, 2).map((n) => n[0]?.toUpperCase() ?? "").join("");
}

function getVisualStatus(roles: { is_filled: boolean }[]): "open" | "almost" | "full" {
  if (roles.length === 0) return "open";
  const filled = roles.filter((r) => r.is_filled).length;
  if (filled === roles.length) return "full";
  if (filled / roles.length >= 0.5) return "almost";
  return "open";
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const currentUserId = user?.id ?? null;

  const { data, error } = await supabase
    .from("projects")
    .select(`
      id, title, description, city, is_remote, created_at,
      project_categories(name),
      users!leader_id(id, name, badge),
      project_roles(id, role_name, is_filled, project_role_skills(skills(name)))
    `)
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const raw = data as unknown as {
    id: string;
    title: string;
    description: string;
    city: string | null;
    is_remote: boolean | null;
    created_at: string;
    project_categories: { name: string } | null;
    users: { id: string; name: string; badge: string | null } | null;
    project_roles: {
      id: string;
      role_name: string;
      is_filled: boolean;
      project_role_skills: { skills: { name: string } | null }[];
    }[];
  };

  if (!raw.users) notFound();

  const badgeMap = await resolveBadgeUrls(supabase, [raw.users.badge]);

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4">
      <BackButton />
      <ProjectCard
        defaultOpen
        disableNavigation
        projectId={raw.id}
        isOwnProject={currentUserId === raw.users.id}
        city={raw.city ?? "Belirtilmemiş"}
        isRemote={raw.is_remote ?? false}
        status={getVisualStatus(raw.project_roles)}
        category={raw.project_categories?.name ?? "Genel"}
        postedAt=""
        title={raw.title}
        description={raw.description}
        poster={{
          id: raw.users.id,
          name: raw.users.name,
          initials: getInitials(raw.users.name),
          color: getPosterColor(raw.users.id),
          badge: badgeMap.get(raw.users.badge ?? "") ?? null,
        }}
        roles={raw.project_roles.map((r) => ({
          id: r.id,
          name: r.role_name,
          filled: r.is_filled,
          skills: r.project_role_skills
            .map((rs) => rs.skills?.name)
            .filter((n): n is string => !!n),
        }))}
      />
    </div>
  );
}
