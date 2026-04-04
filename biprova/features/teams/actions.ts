'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// ─── Team Detail Types ─────────────────────────────────────────────────────

export interface TeamMemberDetail {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string | null;
  role_name: string | null;
  is_leader: boolean;
  has_biprova: boolean;
  joined_at: string;
}

export interface TeamProjectItem {
  id: string;
  title: string;
  city: string | null;
  is_remote: boolean;
  status: string;
  created_at: string;
  leader_id: string;
  leader_name: string;
}

export interface TeamDetail {
  id: string;
  name: string;
  status: string;
  formed_at: string;
  leader_id: string;
  members: TeamMemberDetail[];
  projects: TeamProjectItem[];
  viewer: {
    id: string;
    is_leader: boolean;
    has_biprova: boolean;
    is_member: boolean;
    project_ids: string[];
  };
}

type RawTeamMemberDetail = {
  id: string;
  user_id: string;
  has_biprova: boolean;
  joined_at: string;
  users: { name: string; avatar_url: string | null };
  project_roles: { role_name: string } | null;
};

type RawTeamProjectItem = {
  id: string;
  title: string;
  city: string | null;
  is_remote: boolean;
  status: string;
  created_at: string;
  leader_id: string;
  users: { name: string } | null;
};

export async function getTeamDetail(id: string): Promise<TeamDetail | null> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('id, name, status, formed_at, leader_id')
    .eq('id', id)
    .single();

  if (teamError || !team) return null;

  const [{ data: rawMembers }, { data: rawProjects }, { data: viewerRow }, { data: viewerMemberships }] =
    await Promise.all([
      supabase
        .from('team_members')
        .select('id, user_id, has_biprova, joined_at, users!inner(name, avatar_url), project_roles!role_id(role_name)')
        .eq('team_id', id)
        .limit(20),
      supabase
        .from('projects')
        .select('id, title, city, is_remote, status, created_at, leader_id, users!leader_id(name)')
        .eq('team_id', id)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('team_members')
        .select('has_biprova')
        .eq('team_id', id)
        .eq('user_id', user.id)
        .maybeSingle(),
      supabase
        .from('project_members')
        .select('project_id')
        .eq('user_id', user.id)
        .limit(20),
    ]);

  const members: TeamMemberDetail[] = (rawMembers as unknown as RawTeamMemberDetail[] ?? []).map((m) => ({
    id: m.id,
    user_id: m.user_id,
    name: m.users.name,
    avatar_url: m.users.avatar_url,
    role_name: m.project_roles?.role_name ?? null,
    is_leader: m.user_id === team.leader_id,
    has_biprova: m.has_biprova,
    joined_at: m.joined_at,
  }));

  const projects: TeamProjectItem[] = (rawProjects as unknown as RawTeamProjectItem[] ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    city: p.city,
    is_remote: p.is_remote,
    status: p.status,
    created_at: p.created_at,
    leader_id: p.leader_id,
    leader_name: p.users?.name ?? '',
  }));

  return {
    id: team.id,
    name: team.name ?? 'İsimsiz Ekip',
    status: team.status,
    formed_at: team.formed_at,
    leader_id: team.leader_id,
    founding_project_id: team.project_id ?? null,
    members,
    projects,
    viewer: {
      id: user.id,
      is_leader: team.leader_id === user.id,
      has_biprova: viewerRow?.has_biprova ?? false,
      is_member: viewerRow !== null,
      in_founding_project: viewerInProject !== null,
    },
  };
}

// ─── Mutation Actions ──────────────────────────────────────────────────────

export async function leaveTeam(teamId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturum açmanız gerekiyor.' };

  const { error } = await supabase.rpc('fn_leave_team', { p_team_id: teamId });
  if (error) return { error: error.message };

  redirect('/dashboard');
}

export async function disbandTeam(teamId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturum açmanız gerekiyor.' };

  const { error } = await supabase.rpc('fn_dissolve_team', { p_team_id: teamId });
  if (error) return { error: error.message };

  redirect('/dashboard');
}

export async function transferLeadership(teamId: string, newLeaderId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturum açmanız gerekiyor.' };

  const { error } = await supabase.rpc('fn_transfer_team_leader', {
    p_team_id: teamId,
    p_new_leader_id: newLeaderId,
  });
  if (error) return { error: error.message };
  return {};
}

export async function renameTeam(teamId: string, name: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturum açmanız gerekiyor.' };

  const trimmed = name.trim();
  if (!trimmed) return { error: 'Ekip adı boş olamaz.' };

  const { error } = await supabase
    .from('teams')
    .update({ name: trimmed })
    .eq('id', teamId)
    .eq('leader_id', user.id);

  if (error) return { error: 'Ekip adı güncellenemedi.' };
  return {};
}

export async function kickMember(teamId: string, userId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from('team_members').delete().eq('team_id', teamId).eq('user_id', userId);
  if (error) return { error: 'Üye çıkarılamadı.' };
  return {};
}

export async function grantBiprova(teamId: string, userId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturum açmanız gerekiyor.' };

  const { data: team } = await supabase.from('teams').select('leader_id').eq('id', teamId).single();
  if (team?.leader_id !== user.id) return { error: 'Sadece lider yetki verebilir.' };

  const { error } = await supabase.from('team_members').update({ has_biprova: true }).eq('team_id', teamId).eq('user_id', userId);
  if (error) return { error: 'Yetki verilemedi.' };
  return {};
}

export async function revokeBiprova(teamId: string, userId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturum açmanız gerekiyor.' };

  const { data: team } = await supabase.from('teams').select('leader_id').eq('id', teamId).single();
  if (team?.leader_id !== user.id) return { error: 'Sadece lider yetki kaldırabilir.' };

  const { error } = await supabase.from('team_members').update({ has_biprova: false }).eq('team_id', teamId).eq('user_id', userId);
  if (error) return { error: 'Yetki kaldırılamadı.' };
  return {};
}

export async function inviteMemberByEmail(teamId: string, email: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturum açmanız gerekiyor.' };

  const { data: team } = await supabase.from('teams').select('leader_id').eq('id', teamId).single();
  if (team?.leader_id !== user.id) return { error: 'Sadece lider davet gönderebilir.' };

  const { data: targetUser } = await supabase
    .from('users')
    .select('id, name')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();

  if (!targetUser) return { error: 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.' };

  const { data: existing } = await supabase
    .from('team_members')
    .select('user_id')
    .eq('team_id', teamId)
    .eq('user_id', targetUser.id)
    .maybeSingle();

  if (existing) return { error: 'Bu kullanıcı zaten ekip üyesi.' };

  const { error } = await supabase.from('team_members').insert({
    team_id: teamId,
    user_id: targetUser.id,
    has_biprova: false,
  });

  if (error) return { error: 'Davet gönderilemedi.' };
  return {};
}

export interface TeamPostMember {
  id: string;
  name: string;
}

export interface TeamPostFeedItem {
  id: string;
  content: string;
  likeCount: number;
  createdAt: string;
  isLiked: boolean;
  team: {
    id: string;
    projectTitle: string;
    city: string | null;
    isRemote: boolean | null;
    category: string | null;
    members: TeamPostMember[];
  };
}

type RawPost = {
  id: string;
  content: string;
  like_count: number;
  created_at: string;
  teams: {
    id: string;
    projects: {
      title: string;
      city: string | null;
      is_remote: boolean | null;
      category: string | null;
    } | null;
    team_members: {
      user_id: string;
      users: { id: string; name: string } | null;
    }[];
  } | null;
  team_post_likes: { user_id: string }[];
};

export interface ActiveTeamMember {
  id: string
  name: string
  initials: string
  role: string
  isSelf: boolean
  isLeader: boolean
}

export interface ActiveTeam {
  id: string
  projectTitle: string
  members: ActiveTeamMember[]
}

type RawTeamMember = {
  user_id: string
  users: { id: string; name: string } | null
  project_roles: { role_name: string } | null
}

type RawActiveTeam = {
  id: string
  leader_id: string
  projects: { title: string } | null
  team_members: RawTeamMember[]
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export async function getActiveTeam(): Promise<ActiveTeam | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const { data: memberships } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .limit(10);

  if (!memberships?.length) return null;

  const teamIds = memberships.map((m) => m.team_id);

  const { data: team, error } = await supabase
    .from('teams')
    .select(`
      id, leader_id,
      projects!project_id(title),
      team_members(user_id, users(id, name), project_roles!role_id(role_name))
    `)
    .in('id', teamIds)
    .eq('status', 'active')
    .limit(1)
    .single();

  if (error || !team) return null;

  const raw = team as unknown as RawActiveTeam;

  const members: ActiveTeamMember[] = raw.team_members
    .filter((m) => m.users !== null)
    .map((m) => ({
      id: m.users!.id,
      name: m.users!.name,
      initials: getInitials(m.users!.name),
      role: m.project_roles?.role_name ?? '',
      isSelf: m.user_id === user.id,
      isLeader: m.user_id === raw.leader_id,
    }));

  return {
    id: raw.id,
    projectTitle: raw.projects?.title ?? '',
    members,
  };
}

export async function getTeamPostFeed(): Promise<TeamPostFeedItem[]> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return [];

  const { data, error } = await supabase
    .from('team_posts')
    .select(`
      id, content, like_count, created_at,
      teams!team_id(
        id,
        projects!project_id(title, city, is_remote, category),
        team_members(user_id, users(id, name))
      ),
      team_post_likes(user_id)
    `)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data) return [];

  return (data as unknown as RawPost[])
    .filter((p) => p.teams?.projects !== null)
    .map((p) => {
      const members = (p.teams?.team_members ?? [])
        .filter((m) => m.users !== null)
        .map((m) => ({ id: m.users!.id, name: m.users!.name }));

      return {
        id: p.id,
        content: p.content,
        likeCount: p.like_count,
        createdAt: p.created_at,
        isLiked: p.team_post_likes.some((l) => l.user_id === user.id),
        team: {
          id: p.teams!.id,
          projectTitle: p.teams!.projects!.title,
          city: p.teams!.projects!.city,
          isRemote: p.teams!.projects!.is_remote,
          category: p.teams!.projects!.category,
          members,
        },
      };
    });
}
