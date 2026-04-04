import Link from "next/link";
import { ProjectCard } from "@/features/projects/components/project-card";
import { getProjectFeed, type FeedFilter } from "@/features/projects/actions";
import { createClient } from "@/lib/supabase/server";

const FILTER_TABS: { label: string; value: FeedFilter }[] = [
  { label: "Tümü", value: "all" },
  { label: "Şehrim", value: "sehrim" },
  { label: "Remote", value: "remote" },
];

const POSTER_COLORS = [
  "#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b",
  "#ef4444", "#06b6d4", "#ec4899", "#f97316",
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
  searchParams: Promise<{ filter?: string }>;
}

export async function ProjectFeed({ searchParams }: ProjectFeedProps) {
  const { filter } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserId = user?.id ?? null;

  const activeFilter: FeedFilter =
    filter === "sehrim" || filter === "remote" ? filter : "all";

  let userCity: string | undefined;
  if (activeFilter === "sehrim" && user) {
    const { data } = await supabase
      .from("users")
      .select("city")
      .eq("id", user.id)
      .single();
    userCity = data?.city ?? undefined;
  }

  const projects = await getProjectFeed(activeFilter, userCity);

  return (
    <div id="project-feed">
      {/* Başlık + filtreler */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-nunito font-black text-[1.1rem] text-slate-900">
          📋 Timeline
        </h2>
        <div className="hidden sm:flex gap-[0.4rem] bg-white border-[1.5px] border-slate-200 rounded-[10px] p-[0.3rem]">
          {FILTER_TABS.map((tab) => (
            <Link
              key={tab.value}
              href={tab.value === "all" ? "/dashboard" : `?filter=${tab.value}`}
              className={`text-[0.78rem] font-bold font-jakarta px-[0.8rem] py-[0.35rem] rounded-[7px] transition-all duration-150 ${
                activeFilter === tab.value
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Proje kartları */}
      {projects.length === 0 ? (
        <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl p-10 text-center text-slate-400 text-[0.9rem]">
          Henüz aktif proje yok.
        </div>
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
              poster={{
                name: project.creator.name,
                initials: getInitials(project.creator.name),
                color: getPosterColor(project.creator.id),
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
