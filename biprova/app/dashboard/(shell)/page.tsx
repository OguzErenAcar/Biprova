import { Suspense } from "react";
import { ProjectFeed } from "@/features/projects/components/project-feed";

export default function DashboardHomePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  return (
    <Suspense>
      <ProjectFeed searchParams={searchParams} />
    </Suspense>
  );
}
