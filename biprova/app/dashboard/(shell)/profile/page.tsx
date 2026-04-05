import { Suspense } from 'react';
import { getCurrentUserProfile, getUserProjects, getUserApplications, getUserStats } from '@/features/users/actions';
import { ProfileHero } from './_components/profile-hero';
import { ProfileStats } from './_components/profile-stats';
import { ProfileSections } from './_components/profile-sections';

async function ProfileContent() {
  const user = await getCurrentUserProfile();
  const [projects, applications, stats] = await Promise.all([
    getUserProjects(user.id),
    getUserApplications(user.id),
    getUserStats(user.id),
  ]);

  return (
    <div className="">
      <ProfileHero user={user} isOwner />
      <ProfileStats stats={stats} />
      <ProfileSections projects={projects} applications={applications} isOwner />
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
