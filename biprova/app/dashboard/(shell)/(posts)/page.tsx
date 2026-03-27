import { Suspense } from "react";
import { ProjectFeed } from "@/features/projects/components/project-feed";

export default function DashboardHomePage() {
  return (
    <Suspense>
      <ProjectFeed />
    </Suspense>
  );
}
