export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUserProfile, getUserProjects, getUserApplications, getUserStats, getUserTeams } from '@/features/users/actions';
import { ProfileHero } from './_components/profile-hero';
import { ProfileStats } from './_components/profile-stats';
import { ProfileSections } from './_components/profile-sections';

async function MyProfileContent() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  const user = await getCurrentUserProfile();

  const [projects, applications, stats, teams] = await Promise.all([
    getUserProjects(user.id),
    getUserApplications(user.id),
    getUserStats(user.id),
    getUserTeams(user.id),
  ]);

  return (
    <div className=''>
    <div className='md:me-8'>
      <ProfileHero user={user} isOwner={authUser?.id === user.id} />
      <ProfileStats stats={stats} />
      <ProfileSections
        projects={projects}
        applications={applications}
        teams={teams}
        projectsPublic={user.projects_public}
        teamsPublic={user.teams_public}
        applicationsPublic={user.applications_public}
        isOwner
      />
    </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense>
      <MyProfileContent />
    </Suspense>
  );
}
