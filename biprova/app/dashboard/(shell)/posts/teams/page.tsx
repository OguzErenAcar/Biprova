import { Suspense } from "react";
import { TeamPostFeed } from "@/features/teams/components/team-post-feed";

export default function TeamsPage() {
  return (
    <Suspense>
      <TeamPostFeed />
    </Suspense>
  );
}
