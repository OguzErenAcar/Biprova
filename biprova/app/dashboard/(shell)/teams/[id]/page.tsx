import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTeamDetail } from "@/features/teams/actions";
import { TeamHero } from "./_components/team-hero";
import { TeamMembersCard } from "./_components/team-members-card";
import { TeamProjectsCard } from "./_components/team-projects-card";

interface TeamDetailPageProps {
  params: Promise<{ id: string }>;
}

async function TeamDetailContent({ id }: { id: string }) {
  const team = await getTeamDetail(id);
  if (!team) notFound();

  return (
    <div className="md:me-8">
      <TeamHero team={team} />
      <TeamMembersCard members={team.members} />
      <TeamProjectsCard projects={team.projects} />
    </div>
  );
}

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
  const { id } = await params;

  return (
    <Suspense>
      <TeamDetailContent id={id} />
    </Suspense>
  );
}
