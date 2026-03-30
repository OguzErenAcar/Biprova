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
  has_biprova: boolean;
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
    .select('has_biprova, teams!inner(id, name, status, leader_id)')
    .eq('user_id', user.id)
    .limit(20);

  if (!data) return [];

  return (data as unknown as TeamMemberRow[])
    .filter((r) =>
      ['active', 'pending', 'no_project'].includes(r.teams.status) &&
      (r.teams.leader_id === user.id || r.has_biprova)
    )
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
    return { error: projectError?.message ?? 'Proje oluşturulamadı.' };
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

// ─── Project Detail ────────────────────────────────────────────────────────

export interface ProjectRoleDetail {
  id: string;
  role_name: string;
  is_filled: boolean;
  filled_by: string | null;
  filled_by_name: string | null;
  filled_by_avatar: string | null;
}

export interface ProjectMember {
  user_id: string;
  name: string;
  avatar_url: string | null;
  role_name: string | null;
  is_leader: boolean;
}

export interface ProjectMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string | null;
  content: string;
  created_at: string;
}

export interface ProjectPost {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  content: string;
  like_count: number;
  created_at: string;
}

export interface ProjectApplication {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  role_id: string;
  role_name: string;
  note: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface ProjectDetail {
  id: string;
  title: string;
  description: string | null;
  city: string | null;
  is_remote: boolean;
  category: string | null;
  status: string;
  created_at: string;
  creator_id: string;
  creator_name: string;
  creator_avatar: string | null;
  team_id: string | null;
  team_name: string | null;
  team_status: string | null;
  team_leader_id: string | null;
  roles: ProjectRoleDetail[];
  members: ProjectMember[];
  messages: ProjectMessage[];
  posts: ProjectPost[];
  viewer: {
    id: string;
    name: string;
    is_creator: boolean;
    is_team_leader: boolean;
    is_team_member: boolean;
  };
  applications: ProjectApplication[];
}

type RawProjectDetailRow = {
  id: string;
  title: string;
  description: string | null;
  city: string | null;
  is_remote: boolean | null;
  status: string;
  created_at: string;
  creator_id: string;
  team_id: string | null;
  project_categories: { name: string } | null;
  users: { name: string; avatar_url: string | null } | null;
};

type RawRoleDetailRow = {
  id: string;
  role_name: string;
  is_filled: boolean;
  filled_by: string | null;
  users: { name: string; avatar_url: string | null } | null;
};

type RawMemberRow = {
  user_id: string;
  users: { name: string; avatar_url: string | null };
  project_roles: { role_name: string } | null;
};

type RawMessageRow = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  users: { name: string; avatar_url: string | null } | null;
};

type RawPostRow = {
  id: string;
  author_id: string;
  content: string;
  like_count: number;
  created_at: string;
  users: { name: string; avatar_url: string | null } | null;
};

type RawTeamRow = {
  id: string;
  name: string | null;
  status: string;
  leader_id: string | null;
};

type RawApplicationRow = {
  id: string;
  user_id: string;
  role_id: string;
  note: string | null;
  status: string;
  created_at: string;
  users: { name: string; avatar_url: string | null } | null;
  project_roles: { role_name: string } | null;
};

export async function getProjectDetail(id: string): Promise<ProjectDetail | null> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const { data: rawProject, error: projectError } = await supabase
    .from('projects')
    .select('id, title, description, city, is_remote, status, created_at, creator_id, team_id, project_categories(name)')
    .eq('id', id)
    .single();

  if (projectError || !rawProject) return null;
  const project = rawProject as unknown as RawProjectDetailRow;

  const { data: rawRoles } = await supabase
    .from('project_roles')
    .select('id, role_name, is_filled, filled_by, users!filled_by(name, avatar_url)')
    .eq('project_id', id)
    .limit(20);

  const roles: ProjectRoleDetail[] = (rawRoles as unknown as RawRoleDetailRow[] ?? []).map((r) => ({
    id: r.id,
    role_name: r.role_name,
    is_filled: r.is_filled,
    filled_by: r.filled_by,
    filled_by_name: r.users?.name ?? null,
    filled_by_avatar: r.users?.avatar_url ?? null,
  }));

  let team: RawTeamRow | null = null;
  if (project.team_id) {
    const { data } = await supabase
      .from('teams')
      .select('id, name, status, leader_id')
      .eq('id', project.team_id)
      .single();
    team = data as RawTeamRow | null;
  }

  let members: ProjectMember[] = [];
  let messages: ProjectMessage[] = [];
  let posts: ProjectPost[] = [];

  if (project.team_id) {
    const [{ data: rawMembers }, { data: rawMessages }, { data: rawPosts }] = await Promise.all([
      supabase
        .from('team_members')
        .select('user_id, users!inner(name, avatar_url), project_roles!role_id(role_name)')
        .eq('team_id', project.team_id)
        .limit(20),
      supabase
        .from('messages')
        .select('id, sender_id, content, created_at, users!sender_id(name, avatar_url)')
        .eq('team_id', project.team_id)
        .order('created_at', { ascending: true })
        .limit(50),
      supabase
        .from('team_posts')
        .select('id, author_id, content, like_count, created_at, users!author_id(name, avatar_url)')
        .eq('team_id', project.team_id)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

    members = (rawMembers as unknown as RawMemberRow[] ?? []).map((m) => ({
      user_id: m.user_id,
      name: m.users.name,
      avatar_url: m.users.avatar_url,
      role_name: m.project_roles?.role_name ?? null,
      is_leader: m.user_id === team?.leader_id,
    }));

    messages = (rawMessages as unknown as RawMessageRow[] ?? []).map((m) => ({
      id: m.id,
      sender_id: m.sender_id,
      sender_name: m.users?.name ?? '?',
      sender_avatar: m.users?.avatar_url ?? null,
      content: m.content,
      created_at: m.created_at,
    }));

    posts = (rawPosts as unknown as RawPostRow[] ?? []).map((p) => ({
      id: p.id,
      author_id: p.author_id,
      author_name: p.users?.name ?? '?',
      author_avatar: p.users?.avatar_url ?? null,
      content: p.content,
      like_count: p.like_count ?? 0,
      created_at: p.created_at,
    }));
  }

  let applications: ProjectApplication[] = [];
  if (project.creator_id === user.id) {
    const { data: rawApps } = await supabase
      .from('applications')
      .select('id, user_id, role_id, note, status, created_at, users!user_id(name, avatar_url), project_roles!role_id(role_name)')
      .eq('project_id', id)
      .order('created_at', { ascending: false })
      .limit(50);

    applications = (rawApps as unknown as RawApplicationRow[] ?? []).map((a) => ({
      id: a.id,
      user_id: a.user_id,
      user_name: a.users?.name ?? 'Bilinmiyor',
      user_avatar: a.users?.avatar_url ?? null,
      role_id: a.role_id,
      role_name: a.project_roles?.role_name ?? '',
      note: a.note,
      status: a.status as 'pending' | 'accepted' | 'rejected',
      created_at: a.created_at,
    }));
  }

  let isTeamMember = false;
  if (project.team_id) {
    const { data: memberRow } = await supabase
      .from('team_members')
      .select('user_id')
      .eq('team_id', project.team_id)
      .eq('user_id', user.id)
      .maybeSingle();
    isTeamMember = memberRow !== null;
  }

  const { data: viewerUser } = await supabase
    .from('users')
    .select('name')
    .eq('id', user.id)
    .single();

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    city: project.city,
    is_remote: project.is_remote ?? false,
    category: project.project_categories?.name ?? null,
    status: project.status,
    created_at: project.created_at,
    creator_id: project.creator_id,
    team_id: project.team_id,
    team_name: team?.name ?? null,
    team_status: team?.status ?? null,
    team_leader_id: team?.leader_id ?? null,
    roles,
    members,
    messages,
    posts,
    applications,
    viewer: {
      id: user.id,
      name: (viewerUser as { name: string } | null)?.name ?? 'Sen',
      is_creator: project.creator_id === user.id,
      is_team_leader: team?.leader_id === user.id,
      is_team_member: isTeamMember,
    },
  };
}

export async function deleteProject(projectId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: 'Oturum açmanız gerekiyor.' };

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('creator_id', user.id);

  if (error) return { error: error.message };
  return {};
}

export async function sendProjectMessage(teamId: string, content: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const trimmed = content.trim();
  if (!trimmed) return;
  await supabase.from('messages').insert({
    team_id: teamId,
    sender_id: user.id,
    content: trimmed,
  });
}

export async function createProjectPost(teamId: string, content: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const trimmed = content.trim();
  if (!trimmed) return;
  await supabase.from('team_posts').insert({
    team_id: teamId,
    author_id: user.id,
    content: trimmed,
  });
}
