'use server';

import { createClient } from '@/lib/supabase/server';

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
