import { ProjectCard } from "@/features/projects/components/project-card";
import { FeedFilterDropdown } from "@/features/projects/components/feed-filter-dropdown";
import { getProjectFeed, getNearbyProjects, type FeedFilter } from "@/features/projects/actions";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { ContentHeader } from "@/components/shared/content-header";

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
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

function getVisualStatus(roles: { is_filled: boolean }[]): "open" | "almost" | "full" {
  if (roles.length === 0) return "open";
  const filled = roles.filter((r) => r.is_filled).length;
  if (filled === roles.length) return "full";
  if (filled / roles.length >= 0.5) return "almost";
  return "open";
}

function formatPostedAt(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün önce`;
  const weeks = Math.floor(days / 7);
  return `${weeks} hafta önce`;
}

interface ProjectFeedProps {
  searchParams: Promise<{ filter?: string; lat?: string; lng?: string }>;
}

export async function ProjectFeed({ searchParams }: ProjectFeedProps) {
  const { filter, lat, lng } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserId = user?.id ?? null;

  const activeFilter: FeedFilter =
    filter === "sehrim" || filter === "remote" || filter === "nearby"
      ? filter
      : "all";

  const isNearby = activeFilter === "nearby" && lat && lng;

  type ProjectWithDistance = Awaited<ReturnType<typeof getProjectFeed>>[number] & { distance_km?: number };

  let projects: ProjectWithDistance[] = [];

  if (isNearby) {
    projects = await getNearbyProjects(parseFloat(lat!), parseFloat(lng!));
  } else {
    let userCity: string | undefined;
    if (activeFilter === "sehrim" && user) {
      const { data } = await supabase
        .from("users")
        .select("city")
        .eq("id", user.id)
        .single();
      userCity = data?.city ?? undefined;
    }
    projects = await getProjectFeed(activeFilter, userCity);
  }

  return (
    <div id="project-feed">
      <ContentHeader title="Güncel biprovalara başvur.">
        <FeedFilterDropdown activeFilter={activeFilter} />
      </ContentHeader>

      {projects.length === 0 ? (
        <Card >
          <CardContent className="p-10  text-center text-ink-subtle text-lead">
            {isNearby ? "Yakınında aktif proje bulunamadı." : "Henüz aktif proje yok."}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              projectId={project.id}
              isOwnProject={currentUserId === project.leader.id}
              city={project.city ?? "Belirtilmemiş"}
              isRemote={project.is_remote ?? false}
              status={getVisualStatus(project.roles)}
              category={project.category ?? "Genel"}
              postedAt={formatPostedAt(project.created_at)}
              title={project.title}
              description={project.description}
              distanceKm={project.distance_km}
              poster={{
                id: project.leader.id,
                name: project.leader.name,
                initials: getInitials(project.leader.name),
                color: getPosterColor(project.leader.id),
              }}
              roles={project.roles.map((r) => ({
                id: r.id,
                name: r.role_name,
                filled: r.is_filled,
                skills: r.skills,
              }))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
