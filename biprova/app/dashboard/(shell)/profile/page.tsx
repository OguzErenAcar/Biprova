import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/features/users/actions';

export default async function ProfilePage() {
  const user = await getCurrentUserProfile();
  redirect(`/dashboard/profile/${user.id}`);
}
