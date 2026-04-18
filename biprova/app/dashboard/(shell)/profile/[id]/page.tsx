export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getUserProfileById, getUserProjects, getUserApplications, getUserStats, getUserTeams } from '@/features/users/actions';
import { ProfileHero } from '../_components/profile-hero';
import { ProfileStats } from '../_components/profile-stats';
import { ProfileSections } from '../_components/profile-sections';

async function ProfileContent({ id }: { id: string }) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  const user = await getUserProfileById(id);
  if (!user) notFound();

  const isOwner = authUser?.id === user.id;

  const [projects, applications, stats, teams] = await Promise.all([
    getUserProjects(user.id),
    getUserApplications(user.id),
    getUserStats(user.id),
    getUserTeams(user.id),
  ]);

  return (
    <div className="">
      <ProfileHero user={user} isOwner={isOwner} />
      <ProfileStats stats={stats} />
      <ProfileSections
        projects={projects}
        applications={applications}
        teams={teams}
        projectsPublic={user.projects_public}
        teamsPublic={user.teams_public}
        applicationsPublic={user.applications_public}
        isOwner={isOwner}
      />
    </div>
  );
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense>
      <ProfileContent id={id} />
    </Suspense>
  );
}
