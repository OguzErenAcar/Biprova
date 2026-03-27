'use server';

import { createClient } from '@/lib/supabase/server';

export interface ProjectFeedItem {
  id: string;
  title: string;
  description: string;
  city: string | null;
  is_remote: boolean | null;
  category: string | null;
  created_at: string;
  creator: { id: string; name: string };
  roles: { id: string; role_name: string; is_filled: boolean }[];
}

type RawProject = {
  id: string;
  title: string;
  description: string;
  city: string | null;
  is_remote: boolean | null;
  category: string | null;
  created_at: string;
  users: { id: string; name: string } | null;
  project_roles: { id: string; role_name: string; is_filled: boolean }[] | null;
};

export async function getProjectFeed(): Promise<ProjectFeedItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('id, title, description, city, is_remote, category, created_at, users(id, name), project_roles(id, role_name, is_filled)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data) return [];

  return (data as unknown as RawProject[])
    .filter((p) => p.users !== null)
    .map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      city: p.city,
      is_remote: p.is_remote,
      category: p.category,
      created_at: p.created_at,
      creator: p.users!,
      roles: p.project_roles ?? [],
    }));
}
