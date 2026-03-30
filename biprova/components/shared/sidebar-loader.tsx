import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/shared/sidebar";

export async function SidebarLoader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let teams: { id: string; name: string }[] = [];
  let projects: { id: string; title: string; status: "open" | "full" | "active" | "completed" | "cancelled" }[] = [];

  if (user) {
    const [teamsResult, projectsResult] = await Promise.all([
      supabase
        .from("team_members")
        .select("teams(id, name)")
        .eq("user_id", user.id)
        .in("teams.status", ["pending", "active", "no_project"])
        .limit(10),
      supabase
        .from("project_members")
        .select("projects!inner(id, title, status, created_at)")
        .eq("user_id", user.id)
        .in("projects.status", ["open", "full", "active", "completed"])
        .order("projects(created_at)", { ascending: false })
        .limit(10),
    ]);

    if (teamsResult.data) {
      teams = teamsResult.data
        .map((row) => {
          const t = row.teams as unknown as { id: string; name: string } | null;
          return t;
        })
        .filter((t): t is { id: string; name: string } => t !== null && !!t?.name);
    }

    if (projectsResult.data) {
      projects = projectsResult.data as typeof projects;
    }
  }

  return <Sidebar teams={teams} projects={projects} />;
}
