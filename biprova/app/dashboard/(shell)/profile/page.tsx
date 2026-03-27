import { ProfileHero } from "./_components/profile-hero";
import { ProfileStats } from "./_components/profile-stats";
import { ProfileSections } from "./_components/profile-sections";

export default function ProfilePage() {
  return (
    <div className="">
      <ProfileHero />
      <ProfileStats />
      <ProfileSections />
    </div>
  );
}
