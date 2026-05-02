import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getProjectDetail } from '@/features/projects/actions';
import { ProjectTabView } from './_components/project-tab-view';

interface Props {
  params: Promise<{ id: string }>;
}

async function ProjectPageContent({ id }: { id: string }) {
  const project = await getProjectDetail(id);
  if (!project) notFound();
  if (!project.viewer.is_project_member) redirect(`/dashboard/posts/projects/${id}`);

  return <ProjectTabView project={project} />;
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="animate-pulse space-y-4 p-4"><div className="h-40 bg-gray-100 rounded-xl" /><div className="h-8 bg-gray-100 rounded w-1/2" /><div className="h-64 bg-gray-100 rounded-xl" /></div>}>
      <ProjectPageContent id={id} />
    </Suspense>
  );
}
