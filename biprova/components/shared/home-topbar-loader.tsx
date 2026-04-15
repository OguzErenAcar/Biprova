import { createClient } from "@/lib/supabase/server";
import { HomeTopbar } from "@/components/shared/home-topbar";

export async function HomeTopbarLoader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let projects: { id: string; title: string; status: "open" | "full" | "active" | "completed" | "cancelled" }[] = [];

  if (user) {
    const result = await supabase
      .from("project_members")
      .select("projects!inner(id, title, status)")
      .eq("user_id", user.id)
      .in("projects.status", ["open", "full", "active", "completed"])
      .limit(10);

    if (result.data) {
      type ProjectRow = { id: string; title: string; status: "open" | "full" | "active" | "completed" | "cancelled" };
      projects = (result.data as unknown as { projects: ProjectRow }[])
        .map((row) => row.projects)
        .filter((p): p is ProjectRow => !!p);
    }
  }

  return <HomeTopbar projects={projects} />;
}
