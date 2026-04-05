import { Suspense } from 'react';
import { getCurrentUserProfile, getUserProjects, getUserApplications, getUserStats, getUserTeams } from '@/features/users/actions';
import { ProfileHero } from './_components/profile-hero';
import { ProfileStats } from './_components/profile-stats';
import { ProfileSections } from './_components/profile-sections';

async function ProfileContent() {
  const user = await getCurrentUserProfile();
  const [projects, applications, stats, teams] = await Promise.all([
    getUserProjects(user.id),
    getUserApplications(user.id),
    getUserStats(user.id),
    getUserTeams(user.id),
  ]);

  return (
    <div className="">
      <ProfileHero user={user} isOwner />
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
  );
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileContent />
    </Suspense>
  );
}
