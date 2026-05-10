import { Suspense } from "react";
import { ProjectFeed } from "@/features/projects/components/project-feed";
import { LastActiveUsers } from "@/components/shared/last-active-users";

export default function DashboardHomePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  return (
    <Suspense fallback={<div className="animate-pulse space-y-3 p-4">{Array.from({ length: 4 }).map((_, i) => (<div key={i} className="h-32 bg-gray-100 rounded-xl" />))}</div>}>
      <ProjectFeed searchParams={searchParams} />
    </Suspense>
  );
}
