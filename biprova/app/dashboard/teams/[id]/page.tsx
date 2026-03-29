import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getTeamDetail } from '@/features/teams/actions';
import { TeamTabView } from './_components/team-tab-view';

interface Props {
  params: Promise<{ id: string }>;
}

async function TeamPageContent({ id }: { id: string }) {
  const team = await getTeamDetail(id);
  if (!team) notFound();

  return <TeamTabView team={team} />;
}

export default async function TeamPage({ params }: Props) {
  const { id } = await params;

  return (
    <Suspense>
      <TeamPageContent id={id} />
    </Suspense>
  );
}
