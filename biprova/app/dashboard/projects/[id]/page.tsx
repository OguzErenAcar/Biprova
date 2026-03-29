import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProjectDetail } from '@/features/projects/actions';
import { ProjectTabView } from './_components/project-tab-view';

interface Props {
  params: Promise<{ id: string }>;
}

async function ProjectPageContent({ id }: { id: string }) {
  const project = await getProjectDetail(id);
  if (!project) notFound();

  return <ProjectTabView project={project} />;
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;

  return (
    <Suspense>
      <ProjectPageContent id={id} />
    </Suspense>
  );
}
