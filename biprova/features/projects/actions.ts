'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
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
  roles: { id: string; role_name: string; is_filled: boolean; skills: string[] }[];
}

type RawRole = {
  id: string;
  role_name: string;
  is_filled: boolean;
  project_role_skills: { skills: { name: string } | null }[] | null;
};

type RawProject = {
  id: string;
  title: string;
  description: string;
  city: string | null;
  is_remote: boolean | null;
  created_at: string;
  project_categories: { name: string } | null;
  users: { id: string; name: string } | null;
  project_roles: RawRole[] | null;
};

export type FeedFilter = 'all' | 'sehrim' | 'remote';

export async function getProjectFeed(
  filter: FeedFilter = 'all',
  userCity?: string,
): Promise<ProjectFeedItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from('projects')
    .select(`
      id, title, description, city, is_remote, created_at,
      project_categories(name),
      users!creator_id(id, name),
      project_roles(id, role_name, is_filled, project_role_skills(skills(name)))
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(20);

  if (filter === 'remote') {
    query = query.eq('is_remote', true);
  } else if (filter === 'sehrim' && userCity) {
    query = query.eq('city', userCity);
  }

  const { data, error } = await query;

  if (error || !data) return [];

  return (data as unknown as RawProject[])
    .filter((p) => p.users !== null)
    .map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      city: p.city,
      is_remote: p.is_remote,
      category: p.project_categories?.name ?? null,
      created_at: p.created_at,
      creator: p.users!,
      roles: (p.project_roles ?? []).map((r) => ({
        id: r.id,
        role_name: r.role_name,
        is_filled: r.is_filled,
        skills: (r.project_role_skills ?? [])
          .map((rs) => rs.skills?.name)
          .filter((n): n is string => !!n),
      })),
    }));
}

export interface UserTeamOption {
  id: string;
  name: string;
  status: string;
  is_leader: boolean;
}

type TeamMemberRow = {
  teams: {
    id: string;
    name: string | null;
    status: string;
    leader_id: string | null;
  };
};

export async function getUserTeams(): Promise<UserTeamOption[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('team_members')
    .select('teams!inner(id, name, status, leader_id)')
    .eq('user_id', user.id)
    .limit(20);

  if (!data) return [];

  return (data as unknown as TeamMemberRow[])
    .filter((r) => ['active', 'pending', 'no_project'].includes(r.teams.status))
    .map((r) => ({
      id: r.teams.id,
      name: r.teams.name ?? 'İsimsiz Ekip',
      status: r.teams.status,
      is_leader: r.teams.leader_id === user.id,
    }));
}

export interface CategoryOption {
  id: string;
  name: string;
}

export async function getCategories(): Promise<CategoryOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('project_categories')
    .select('id, name')
    .order('name')
    .limit(50);
  return data ?? [];
}

export interface CityOption {
  id: string;
  name: string;
}

export async function getCities(): Promise<CityOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('cities')
    .select('id, name')
    .order('name')
    .limit(100);
  return data ?? [];
}

export interface SkillOption {
  id: string;
  name: string;
}

export async function getSkills(): Promise<SkillOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('skills')
    .select('id, name')
    .order('name')
    .limit(200);
  return data ?? [];
}

const roleItemSchema = z.array(
  z.object({
    name: z.string().min(1),
    count: z.number().int().min(1),
    skillIds: z.array(z.string()).default([]),
  })
).min(1, 'En az 1 rol eklemelisin').max(6, 'En fazla 6 rol ekleyebilirsin');

const createProjectSchema = z.object({
  title: z.string().min(3, 'Başlık en az 3 karakter olmalı').max(80),
  description: z.string().min(10, 'İhtiyaç açıklaması en az 10 karakter olmalı').max(500),
  city: z.string().min(1, 'Şehir zorunludur'),
  is_remote: z.string().optional(),
  category_id: z.string().optional(),
  roles: z.string().optional(),
  team_id: z.string().optional(),
});

export interface CreateProjectState {
  error?: string;
}

export async function createProject(
  _prevState: CreateProjectState | null,
  formData: FormData
): Promise<CreateProjectState> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: 'Oturum açmanız gerekiyor.' };

  const parsed = createProjectSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    city: formData.get('city'),
    is_remote: formData.get('is_remote') ?? undefined,
    category_id: formData.get('category_id') ?? undefined,
    roles: formData.get('roles') ?? undefined,
    team_id: formData.get('team_id') ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Geçersiz form verisi' };
  }

  const teamId =
    parsed.data.team_id && parsed.data.team_id !== '' ? parsed.data.team_id : null;

  let roleItems: z.infer<typeof roleItemSchema> | null = null;

  if (!teamId) {
    if (!parsed.data.roles) {
      return { error: 'En az 1 rol eklemelisin' };
    }
    try {
      const raw: unknown = JSON.parse(parsed.data.roles);
      const rolesResult = roleItemSchema.safeParse(raw);
      if (!rolesResult.success) {
        return { error: rolesResult.error.issues[0]?.message ?? 'Geçersiz roller' };
      }
      roleItems = rolesResult.data;
    } catch {
      return { error: 'Roller geçersiz.' };
    }
  }

  const categoryId =
    parsed.data.category_id && parsed.data.category_id !== ''
      ? parsed.data.category_id
      : null;

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      creator_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      city: parsed.data.city,
      is_remote: parsed.data.is_remote === 'on',
      category_id: categoryId,
      status: teamId ? 'active' : 'open',
      ...(teamId && { team_id: teamId }),
    })
    .select('id')
    .single();

  if (projectError || !project) {
    return { error: 'Proje oluşturulamadı. Lütfen tekrar deneyin.' };
  }

  if (teamId) {
    await supabase.from('teams').update({ project_id: project.id }).eq('id', teamId);
  }

  if (roleItems) {
    for (const roleItem of roleItems) {
      const roleRows = Array.from({ length: roleItem.count }, () => ({
        project_id: project.id,
        role_name: roleItem.name,
        is_filled: false,
      }));

      const { data: insertedRoles, error: rolesError } = await supabase
        .from('project_roles')
        .insert(roleRows)
        .select('id');

      if (rolesError || !insertedRoles) {
        await supabase.from('projects').delete().eq('id', project.id);
        return { error: 'Roller kaydedilemedi. Lütfen tekrar deneyin.' };
      }

      if (roleItem.skillIds.length > 0) {
        const skillRows = insertedRoles.flatMap((role) =>
          roleItem.skillIds.map((skillId) => ({
            role_id: role.id,
            skill_id: skillId,
          }))
        );
        await supabase.from('project_role_skills').insert(skillRows);
      }
    }
  }

  redirect('/dashboard');
}
