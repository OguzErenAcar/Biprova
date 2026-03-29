import { Suspense } from "react";
import { ProjectFeed } from "@/features/projects/components/project-feed";

export default async function DashboardHomePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  return (
    <Suspense>
      <ProjectFeed filter={filter} />
    </Suspense>
  );
}
