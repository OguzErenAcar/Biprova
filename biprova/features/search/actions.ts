'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export interface SearchResult {
  id: string;
  label: string;
  sub: string | null;
  type: 'project' | 'user';
  href: string;
}

const searchQuerySchema = z.string().trim().min(1).max(100);

function escapeLike(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}

export async function search(query: string): Promise<SearchResult[]> {
  const parsed = searchQuerySchema.safeParse(query);
  if (!parsed.success) return [];

  const q = parsed.data;

  const escaped = escapeLike(q);

  const supabase = await createClient();

  const [{ data: projects }, { data: users }] = await Promise.all([
    supabase
      .from('projects')
      .select('id, title, city')
      .eq('status', 'open')
      .ilike('title', `%${escaped}%`)
      .limit(5),
    supabase
      .from('users')
      .select('id, name, badge')
      .ilike('name', `%${escaped}%`)
      .limit(5),
  ]);

  const projectResults: SearchResult[] = (projects ?? []).map((p) => ({
    id: p.id,
    label: p.title,
    sub: p.city ?? null,
    type: 'project',
    href: `/dashboard/projects/${p.id}`,
  }));

  const userResults: SearchResult[] = (users ?? []).map((u) => ({
    id: u.id,
    label: u.name,
    sub: u.badge ?? null,
    type: 'user',
    href: `/dashboard/profile/${u.id}`,
  }));

  return [...projectResults, ...userResults].slice(0, 5);
}
