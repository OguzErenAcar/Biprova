import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/shared/sidebar";
import { parseLocationCookie } from "@/features/projects/location-actions";

export async function SidebarLoader() {
  const cookieStore = await cookies();
  const locationCookie = cookieStore.get("location-filter")?.value;
  const locationOn = parseLocationCookie(locationCookie) !== null;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let projects: { id: string; title: string; status: "open" | "full" | "active" | "completed" | "cancelled" }[] = [];

  if (user) {
    const projectsResult = await supabase
      .from("project_members")
      .select("projects!inner(id, title, status, created_at)")
      .eq("user_id", user.id)
      .in("projects.status", ["open", "full", "active", "completed"])
      .limit(10);

    if (projectsResult.data) {
      type ProjectRow = { id: string; title: string; status: "open" | "full" | "active" | "completed" | "cancelled" };
      projects = (projectsResult.data as unknown as { projects: ProjectRow }[])
        .map((row) => row.projects)
        .filter((p): p is ProjectRow => !!p);
    }
  }

  return <Sidebar projects={projects} locationOn={locationOn} />;
}
