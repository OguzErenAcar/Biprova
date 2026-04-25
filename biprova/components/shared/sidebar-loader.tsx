import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/shared/sidebar";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export async function SidebarLoader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let projects: { id: string; title: string; status: "open" | "full" | "active" | "completed" | "cancelled" }[] = [];
  let showInfoDialog = false;

  if (user) {
    const [projectsResult, userResult] = await Promise.all([
      supabase
        .from("project_members")
        .select("projects!inner(id, title, status, created_at)")
        .eq("user_id", user.id)
        .in("projects.status", ["open", "full", "active", "completed"])
        .limit(10),
      supabase
        .from("users")
        .select("last_seen_at")
        .eq("id", user.id)
        .single(),
    ]);

    if (projectsResult.data) {
      type ProjectRow = { id: string; title: string; status: "open" | "full" | "active" | "completed" | "cancelled" };
      projects = (projectsResult.data as unknown as { projects: ProjectRow }[])
        .map((row) => row.projects)
        .filter((p): p is ProjectRow => !!p);
    }

    if (userResult.data) {
      const lastSeen = userResult.data.last_seen_at;
      const isFirstVisit = lastSeen === null;
      const isLongAbsence = lastSeen !== null && Date.now() - new Date(lastSeen).getTime() > THREE_DAYS_MS;
      showInfoDialog = isFirstVisit || isLongAbsence;
    }

    await supabase
      .from("users")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", user.id);
  }

  return <Sidebar projects={projects} showInfoDialog={showInfoDialog} />;
}
