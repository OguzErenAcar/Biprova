'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { geocodeCity, toGeoPoint } from '@/lib/geocoding';
import { resolveBadgeUrls } from '@/lib/badge';

export interface ProjectFeedItem {
  id: string;
  title: string;
  description: string;
  city: string | null;
  is_remote: boolean | null;
  category: string | null;
  created_at: string;
  leader: { id: string; name: string; badge: string | null; badge_url: string | null };
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
  users: { id: string; name: string; badge: string | null } | null;
  project_roles: RawRole[] | null;
};

export type FeedFilter = 'all' | 'sehrim' | 'remote' | 'nearby';

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
      users!leader_id(id, name, badge),
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

  const rawProjects = (data as unknown as RawProject[]).filter((p) => p.users !== null);
  const badgeMap = await resolveBadgeUrls(supabase, rawProjects.map((p) => p.users?.badge));

  return rawProjects.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    city: p.city,
    is_remote: p.is_remote,
    category: p.project_categories?.name ?? null,
    created_at: p.created_at,
    leader: {
      ...p.users!,
      badge_url: badgeMap.get(p.users?.badge ?? '') ?? null,
    },
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
    name: z.string().min(1).max(100),
    count: z.number().int().min(1).max(20),
    skillIds: z.array(z.string().uuid()).default([]),
  })
).min(1, 'En az 1 rol eklemelisin').max(6, 'En fazla 6 rol ekleyebilirsin');

const createProjectSchema = z.object({
  title:       z.string().min(3, 'Başlık en az 3 karakter olmalı').max(80).trim(),
  description: z.string().min(10, 'İhtiyaç açıklaması en az 10 karakter olmalı').max(500).trim(),
  city:        z.string().min(1, 'Şehir zorunludur').max(100).trim(),
  is_remote:   z.string().optional(),
  category_id: z.string().uuid('Geçersiz kategori.').optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  roles:       z.string().optional(),
  team_id:     z.string().uuid('Geçersiz ekip.').optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
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

  const geoPoint = await geocodeCity(parsed.data.city);

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      leader_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      city: parsed.data.city,
      is_remote: parsed.data.is_remote === 'on',
      category_id: categoryId,
      status: teamId ? 'full' : 'open',
      ...(teamId && { team_id: teamId }),
      ...(geoPoint && { location: toGeoPoint(geoPoint) }),
    })
    .select('id')
    .single();

  if (projectError || !project) {
    return { error: projectError?.message ?? 'Proje oluşturulamadı.' };
  }

  if (teamId) {
    await supabase.from('teams').update({ project_id: project.id }).eq('id', teamId);
    await supabase.from('team_members').upsert(
      { team_id: teamId, user_id: user.id, role_id: null },
      { onConflict: 'team_id,user_id' }
    );
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

export interface NearbyProjectItem extends ProjectFeedItem {
  distance_km: number;
}

type RawNearbyRow = {
  id: string;
  title: string;
  city: string | null;
  is_remote: boolean | null;
  category_id: string | null;
  status: string;
  leader_id: string;
  created_at: string;
  distance_km: number;
};

export async function getNearbyProjects(
  lat: number,
  lng: number,
  radiusKm: number = 50,
): Promise<NearbyProjectItem[]> {
  const supabase = await createClient();

  const { data: nearbyRows, error } = await supabase.rpc('nearby_projects', {
    lat,
    lng,
    radius_km: radiusKm,
  });

  if (error || !nearbyRows || nearbyRows.length === 0) return [];

  const ids = (nearbyRows as RawNearbyRow[]).map((r) => r.id);

  const { data: fullData } = await supabase
    .from('projects')
    .select(`
      id, title, description, city, is_remote, created_at,
      project_categories(name),
      users!leader_id(id, name, badge),
      project_roles(id, role_name, is_filled, project_role_skills(skills(name)))
    `)
    .in('id', ids)
    .limit(50);

  if (!fullData) return [];

  const distanceMap = new Map<string, number>(
    (nearbyRows as RawNearbyRow[]).map((r) => [r.id, r.distance_km])
  );

  const rawNearby = (fullData as unknown as RawProject[]).filter((p) => p.users !== null);
  const nearbyBadgeMap = await resolveBadgeUrls(supabase, rawNearby.map((p) => p.users?.badge));

  return rawNearby
    .map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      city: p.city,
      is_remote: p.is_remote,
      category: p.project_categories?.name ?? null,
      created_at: p.created_at,
      leader: {
        ...p.users!,
        badge_url: nearbyBadgeMap.get(p.users?.badge ?? '') ?? null,
      },
      roles: (p.project_roles ?? []).map((r) => ({
        id: r.id,
        role_name: r.role_name,
        is_filled: r.is_filled,
        skills: (r.project_role_skills ?? [])
          .map((rs) => rs.skills?.name)
          .filter((n): n is string => !!n),
      })),
      distance_km: distanceMap.get(p.id) ?? 0,
    }))
    .sort((a, b) => a.distance_km - b.distance_km);
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
  badge: string | null;
  badge_url: string | null;
  role_name: string | null;
  is_leader: boolean;
  is_project_leader: boolean;
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
  image_urls: string[];
  like_count: number;
  is_liked: boolean;
  created_at: string;
}

export interface ProjectFile {
  id: string;
  uploader_id: string;
  uploader_name: string;
  name: string;
  type: 'file' | 'link';
  url: string;
  size: number | null;
  mime_type: string | null;
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
  leader_id: string;
  leader_name: string;
  leader_avatar: string | null;
  team_id: string | null;
  team_name: string | null;
  team_status: string | null;
  team_leader_id: string | null;
  roles: ProjectRoleDetail[];
  members: ProjectMember[];
  messages: ProjectMessage[];
  posts: ProjectPost[];
  files: ProjectFile[];
  viewer: {
    id: string;
    name: string;
    is_project_leader: boolean;
    is_project_member: boolean;
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
  leader_id: string;
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
  users: { name: string; avatar_url: string | null; badge: string | null };
  project_roles: { role_name: string } | null;
};

type RawProjectMemberRow = {
  user_id: string;
  role: string;
  users: { name: string; avatar_url: string | null; badge: string | null };
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
  image_urls: string[];
  like_count: number;
  created_at: string;
  users: { name: string; avatar_url: string | null } | null;
  team_post_likes: { user_id: string }[];
};

type RawTeamRow = {
  id: string;
  name: string | null;
  status: string;
  leader_id: string | null;
};

type RawFileRow = {
  id: string;
  uploader_id: string;
  name: string;
  type: string;
  url: string;
  size: number | null;
  mime_type: string | null;
  created_at: string;
  users: { name: string } | null;
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
    .select('id, title, description, city, is_remote, status, created_at, leader_id, team_id, project_categories(name), users!leader_id(name, avatar_url)')
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
  let files: ProjectFile[] = [];

  if (project.team_id) {
    const [{ data: rawMembers }, { data: rawProjectMembers }, { data: rawMessages }, { data: rawPosts }, { data: rawFiles }] = await Promise.all([
      supabase
        .from('team_members')
        .select('user_id, users!inner(name, avatar_url, badge), project_roles!role_id(role_name)')
        .eq('team_id', project.team_id)
        .limit(20),
      supabase
        .from('project_members')
        .select('user_id')
        .eq('project_id', id)
        .limit(20),
      supabase
        .from('messages')
        .select('id, sender_id, content, created_at, users!sender_id(name, avatar_url)')
        .eq('team_id', project.team_id)
        .order('created_at', { ascending: true })
        .limit(50),
      supabase
        .from('team_posts')
        .select('id, author_id, content, image_urls, like_count, created_at, users!author_id(name, avatar_url), team_post_likes(user_id)')
        .eq('team_id', project.team_id)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('team_files')
        .select('id, uploader_id, name, type, url, size, mime_type, created_at, users!uploader_id(name)')
        .eq('team_id', project.team_id)
        .order('created_at', { ascending: false })
        .limit(50),
    ]);

    const activeProjectMemberIds = new Set((rawProjectMembers ?? []).map((m) => m.user_id));
    const filteredMembers = (rawMembers as unknown as RawMemberRow[] ?? [])
      .filter((m) => activeProjectMemberIds.has(m.user_id));

    const memberBadgeMap = await resolveBadgeUrls(supabase, filteredMembers.map((m) => m.users.badge));

    members = filteredMembers.map((m) => ({
      user_id: m.user_id,
      name: m.users.name,
      avatar_url: m.users.avatar_url,
      badge: m.users.badge,
      badge_url: memberBadgeMap.get(m.users.badge ?? '') ?? null,
      role_name: m.project_roles?.role_name ?? null,
      is_leader: m.user_id === project.leader_id,
      is_project_leader: m.user_id === project.leader_id,
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
      image_urls: p.image_urls ?? [],
      like_count: p.like_count ?? 0,
      is_liked: (p.team_post_likes ?? []).some((l) => l.user_id === user.id),
      created_at: p.created_at,
    }));

    files = (rawFiles as unknown as RawFileRow[] ?? []).map((f) => ({
      id: f.id,
      uploader_id: f.uploader_id,
      uploader_name: f.users?.name ?? 'Bilinmiyor',
      name: f.name,
      type: f.type as 'file' | 'link',
      url: f.url,
      size: f.size,
      mime_type: f.mime_type,
      created_at: f.created_at,
    }));
  } else {
    // Ekip kurulmadan önce project_members tablosundan üyeleri çek
    const { data: rawProjMembers } = await supabase
      .from('project_members')
      .select('user_id, role, users!inner(name, avatar_url, badge)')
      .eq('project_id', id)
      .limit(20);

    const seenIds = new Set<string>([project.leader_id]);
    const otherProjMembers = (rawProjMembers as unknown as RawProjectMemberRow[] ?? [])
      .filter((m) => {
        if (seenIds.has(m.user_id)) return false;
        seenIds.add(m.user_id);
        return true;
      });

    const projBadgeMap = await resolveBadgeUrls(supabase, otherProjMembers.map((m) => m.users.badge));

    // Lider project_members'a eklenmese bile her zaman listele
    const leaderMember: ProjectMember = {
      user_id: project.leader_id,
      name: project.users?.name ?? '',
      avatar_url: project.users?.avatar_url ?? null,
      badge: null,
      badge_url: null,
      role_name: 'Lider',
      is_leader: true,
      is_project_leader: true,
    };

    const otherMembers = otherProjMembers.map((m) => ({
      user_id: m.user_id,
      name: m.users.name,
      avatar_url: m.users.avatar_url,
      badge: m.users.badge,
      badge_url: projBadgeMap.get(m.users.badge ?? '') ?? null,
      role_name: m.role === 'leader' ? 'Lider' : 'Üye',
      is_leader: false,
      is_project_leader: false,
    }));

    members = [leaderMember, ...otherMembers];
  }

  let applications: ProjectApplication[] = [];
  if (project.leader_id === user.id) {
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

  const isProjectLeader = project.leader_id === user.id;
  let isProjectMember = isProjectLeader;
  if (!isProjectMember) {
    const { data: pmRow } = await supabase
      .from('project_members')
      .select('user_id')
      .eq('project_id', id)
      .eq('user_id', user.id)
      .maybeSingle();
    isProjectMember = pmRow !== null;
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
    leader_id: project.leader_id,
    leader_name: project.users?.name ?? '',
    leader_avatar: project.users?.avatar_url ?? null,
    team_id: project.team_id,
    team_name: team?.name ?? null,
    team_status: team?.status ?? null,
    team_leader_id: team?.leader_id ?? null,
    roles,
    members,
    messages,
    posts,
    files,
    applications,
    viewer: {
      id: user.id,
      name: (viewerUser as { name: string } | null)?.name ?? 'Sen',
      is_project_leader: isProjectLeader,
      is_project_member: isProjectMember,
      is_team_leader: team?.leader_id === user.id,
      is_team_member: isTeamMember,
    },
  };
}

const inviteToProjectSchema = z.object({
  projectId: z.string().uuid(),
  email:     z.string().email(),
  skillName: z.string().min(1).max(100).trim(),
});

export async function inviteToProject(
  projectId: string,
  email: string,
  skillName: string,
): Promise<{ error?: string }> {
  const parsed = inviteToProjectSchema.safeParse({ projectId, email, skillName });
  if (!parsed.success) return { error: 'Geçersiz davet verisi.' };

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: 'Oturum açmanız gerekiyor.' };

  const { data: project } = await supabase
    .from('projects')
    .select('leader_id')
    .eq('id', parsed.data.projectId)
    .single();

  if (project?.leader_id !== user.id) return { error: 'Sadece proje lideri davet edebilir.' };

  const { data: role } = await supabase
    .from('project_roles')
    .select('id, role_name')
    .eq('project_id', parsed.data.projectId)
    .eq('role_name', parsed.data.skillName)
    .maybeSingle();

  if (!role) return { error: 'Bu projede böyle bir rol bulunmuyor.' };

  const { data: targetUser } = await supabase
    .from('users')
    .select('id, name')
    .eq('email', parsed.data.email.trim().toLowerCase())
    .maybeSingle();

  if (!targetUser) return { error: 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.' };
  if (targetUser.id === user.id) return { error: 'Kendinizi davet edemezsiniz.' };

  const { data: existing } = await supabase
    .from('project_members')
    .select('user_id')
    .eq('project_id', parsed.data.projectId)
    .eq('user_id', targetUser.id)
    .maybeSingle();

  if (existing) return { error: 'Bu kullanıcı zaten projede.' };

  const { error: memberError } = await supabase.from('project_members').insert({
    project_id: parsed.data.projectId,
    user_id:    targetUser.id,
    role:       role.role_name,
  });
  if (memberError) return { error: 'Davet gönderilemedi.' };

  return {};
}

export async function removeFromProject(projectId: string, userId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: 'Oturum açmanız gerekiyor.' };

  const { data: project } = await supabase
    .from('projects')
    .select('leader_id')
    .eq('id', projectId)
    .single();

  if (project?.leader_id !== user.id) return { error: 'Sadece proje lideri üye çıkarabilir.' };
  if (userId === user.id) return { error: 'Kendinizi çıkaramazsınız.' };

  const { createAdminClient } = await import('@/lib/supabase/admin');
  const admin = createAdminClient();
  const { error } = await admin.from('project_members')
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', userId);

  if (error) return { error: 'Üye çıkarılamadı.' };
  return {};
}

export async function leaveProject(projectId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: 'Oturum açmanız gerekiyor.' };

  const { data: project } = await supabase
    .from('projects')
    .select('leader_id, team_id')
    .eq('id', projectId)
    .single();

  if (!project) return { error: 'Proje bulunamadı.' };
  if (project.leader_id === user.id) return { error: 'Proje lideri projeden ayrılamaz.' };

  // Remove from project_members only.
  // For team projects: role slot stays filled (project doesn't re-open), team membership untouched.
  // For non-team projects: removes from project_members.
  const { error } = await supabase
    .from('project_members')
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', user.id);
  if (error) return { error: 'Projeden ayrılınamadı.' };

  redirect('/dashboard');
}

export async function transferProjectLeader(
  projectId: string,
  newLeaderId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: 'Oturum açmanız gerekiyor.' };

  const { data: project } = await supabase
    .from('projects')
    .select('leader_id')
    .eq('id', projectId)
    .single();

  if (project?.leader_id !== user.id) return { error: 'Sadece proje lideri liderliği devredebilir.' };

  const { error } = await supabase.rpc('fn_transfer_project_leader', {
    p_project_id: projectId,
    p_new_leader_id: newLeaderId,
  });
  if (error) return { error: error.message };
  return {};
}

export async function deleteProject(projectId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: 'Oturum açmanız gerekiyor.' };

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('leader_id', user.id);

  if (error) return { error: error.message };
  return {};
}

export async function sendProjectMessage(
  teamId: string,
  content: string,
  senderName: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturum açmanız gerekiyor.' };

  const { messageLimiter } = await import('@/lib/rate-limit');
  const { success: withinLimit } = await messageLimiter.limit(user.id);
  if (!withinLimit) return { error: 'Çok hızlı mesaj gönderiyorsunuz. Lütfen bekleyin.' };

  const trimmed = content.trim();
  if (!trimmed) return { error: 'Mesaj boş olamaz.' };

  const { data: membership } = await supabase
    .from('team_members')
    .select('user_id')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!membership) return { error: 'Bu ekibin üyesi değilsiniz.' };

  const { data: inserted, error: insertError } = await supabase
    .from('messages')
    .insert({ team_id: teamId, sender_id: user.id, content: trimmed })
    .select('id, created_at')
    .single();

  if (insertError || !inserted) return { error: 'Mesaj gönderilemedi.' };

  const { createAdminClient } = await import('@/lib/supabase/admin');
  const admin = createAdminClient();
  await admin.channel(`team-chat-${teamId}`).send({
    type: 'broadcast',
    event: 'new_message',
    payload: {
      id: inserted.id,
      team_id: teamId,
      sender_id: user.id,
      sender_name: senderName,
      content: trimmed,
      created_at: inserted.created_at,
    },
  });

  return {};
}

const ALLOWED_IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);

export async function createProjectPost(teamId: string, content: string, imageUrls: string[] = []): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturum açmanız gerekiyor.' };

  const { postLimiter } = await import('@/lib/rate-limit');
  const { success: withinLimit } = await postLimiter.limit(user.id);
  if (!withinLimit) return { error: 'Çok hızlı gönderi oluşturuyorsunuz. Lütfen bekleyin.' };

  const trimmed = content.trim();
  if (!trimmed && imageUrls.length === 0) return { error: 'Gönderi boş olamaz.' };

  // Yalnızca Supabase Storage'dan gelen ve geçerli uzantılı URL'lere izin ver
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const safeUrls = imageUrls
    .filter((url) => url.startsWith(`${supabaseUrl}/storage/`))
    .filter((url) => {
      const ext = url.split('.').pop()?.toLowerCase().split('?')[0] ?? '';
      return ALLOWED_IMAGE_EXTENSIONS.has(ext);
    })
    .slice(0, 5);

  const { error } = await supabase.from('team_posts').insert({
    team_id: teamId,
    author_id: user.id,
    content: trimmed,
    image_urls: safeUrls,
  });

  if (error) return { error: 'Gönderi oluşturulamadı.' };
  return {};
}

export async function deleteProjectPost(postId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturum açmanız gerekiyor.' };

  const { data: post } = await supabase
    .from('team_posts')
    .select('author_id, team_id')
    .eq('id', postId)
    .single();

  if (!post) return { error: 'Gönderi bulunamadı.' };

  const isAuthor = post.author_id === user.id;
  let isLeader = false;
  if (!isAuthor) {
    const { data: team } = await supabase
      .from('teams')
      .select('leader_id')
      .eq('id', post.team_id)
      .single();
    isLeader = team?.leader_id === user.id;
  }

  if (!isAuthor && !isLeader) return { error: 'Bu gönderiyi silme yetkiniz yok.' };

  const { error } = await supabase.from('team_posts').delete().eq('id', postId);
  if (error) return { error: 'Gönderi silinemedi.' };
  return {};
}

const recordTeamFileSchema = z.object({
  teamId:   z.string().uuid(),
  name:     z.string().min(1).max(200).trim(),
  url:      z.string().url().max(2000),
  size:     z.number().int().positive().max(20 * 1024 * 1024).optional(),
  mimeType: z.string().max(100).optional(),
});

export async function recordTeamFile(
  teamId: string,
  name: string,
  url: string,
  size?: number,
  mimeType?: string,
): Promise<{ error?: string; file?: ProjectFile }> {
  const parsed = recordTeamFileSchema.safeParse({ teamId, name, url, size, mimeType });
  if (!parsed.success) return { error: 'Geçersiz dosya verisi.' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturum açmanız gerekiyor.' };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  if (!parsed.data.url.startsWith(`${supabaseUrl}/storage/`)) {
    return { error: 'Geçersiz dosya URL.' };
  }

  const fileId = crypto.randomUUID();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from('team_files')
    .insert({
      id:          fileId,
      team_id:     parsed.data.teamId,
      uploader_id: user.id,
      name:        parsed.data.name,
      type:        'file',
      url:         parsed.data.url,
      size:        parsed.data.size ?? null,
      mime_type:   parsed.data.mimeType ?? null,
    });

  if (error) return { error: error.message };

  const { data: viewerUser } = await supabase.from('users').select('name').eq('id', user.id).single();

  return {
    file: {
      id:            fileId,
      uploader_id:   user.id,
      uploader_name: (viewerUser as { name: string } | null)?.name ?? 'Sen',
      name:          parsed.data.name,
      type:          'file',
      url:           parsed.data.url,
      size:          parsed.data.size ?? null,
      mime_type:     parsed.data.mimeType ?? null,
      created_at:    now,
    },
  };
}

const addTeamLinkSchema = z.object({
  teamId: z.string().uuid(),
  name:   z.string().min(1).max(200).trim(),
  url:    z.string().url('Geçerli bir URL giriniz').max(2000).trim(),
});

export async function addTeamLink(
  teamId: string,
  name: string,
  url: string,
): Promise<{ error?: string; file?: ProjectFile }> {
  const parsed = addTeamLinkSchema.safeParse({ teamId, name, url });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Geçersiz link verisi.' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturum açmanız gerekiyor.' };

  const fileId = crypto.randomUUID();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from('team_files')
    .insert({
      id:          fileId,
      team_id:     parsed.data.teamId,
      uploader_id: user.id,
      name:        parsed.data.name,
      type:        'link',
      url:         parsed.data.url,
    });

  if (error) return { error: error.message };

  const { data: viewerUser } = await supabase.from('users').select('name').eq('id', user.id).single();

  return {
    file: {
      id:            fileId,
      uploader_id:   user.id,
      uploader_name: (viewerUser as { name: string } | null)?.name ?? 'Sen',
      name:          parsed.data.name,
      type:          'link',
      url:           parsed.data.url,
      size:          null,
      mime_type:     null,
      created_at:    now,
    },
  };
}

export async function deleteTeamFile(fileId: string): Promise<{ error?: string }> {
  if (!z.string().uuid().safeParse(fileId).success) return { error: 'Geçersiz dosya ID.' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturum açmanız gerekiyor.' };

  const { error } = await supabase.from('team_files').delete().eq('id', fileId);
  if (error) return { error: 'Dosya silinemedi.' };
  return {};
}
