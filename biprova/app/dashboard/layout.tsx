import { Sidebar } from "@/components/shared/sidebar";
import { TabBar } from "@/components/shared/tab-bar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
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
        .in("teams.status", ["active", "no_project"])
        .limit(10),
      supabase
        .from("projects")
        .select("id, title, status")
        .eq("creator_id", user.id)
        .in("status", ["open", "full", "active", "completed"])
        .order("created_at", { ascending: false })
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

  return (
    <div id="dashboard-root" className="flex min-h-screen bg-slate-100">
      <Sidebar teams={teams} projects={projects} />
      <div id="dashboard-content" className="lg:ml-60 flex-1 flex flex-col min-h-screen">
        {children}
      </div>
      <TabBar />
    </div>
  );
}
