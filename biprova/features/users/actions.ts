'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  city: string | null;
  is_remote: boolean | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  badge: string | null;
  created_at: string;
  skills: { id: string; name: string }[];
}

type SkillRow = { skills: { id: string; name: string } | null };

export type ProjectStatus = 'active' | 'done' | 'dissolved';

export interface UserProjectEntry {
  id: string;
  title: string;
  city: string | null;
  is_remote: boolean | null;
  category: string | null;
  status: ProjectStatus;
  isLeader: boolean;
  userRole: string | null;
}

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface UserApplicationEntry {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
  projectTitle: string;
  roleName: string | null;
}

type MembershipRow = {
  role_id: string | null;
  project_roles: { role_name: string } | null;
  teams: {
    projects: {
      id: string;
      title: string;
      city: string | null;
      is_remote: boolean | null;
      category: string | null;
      status: string;
      leader_id: string;
    } | null;
  } | null;
};

type FilledRoleRow = {
  role_name: string;
  projects: {
    id: string;
    title: string;
    city: string | null;
    is_remote: boolean | null;
    category: string | null;
    status: string;
    leader_id: string;
  } | null;
};

export async function getCurrentUserProfile(): Promise<UserProfile> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/');

  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, bio, city, is_remote, avatar_url, linkedin_url, badge, created_at')
    .eq('id', user.id)
    .single();

  if (error || !data) {
    throw new Error(`Profil yüklenemedi: ${error?.message ?? 'kullanıcı bulunamadı'}`);
  }

  const { data: skillsData } = await supabase
    .from('user_skills')
    .select('skills(id, name)')
    .eq('user_id', user.id)
    .limit(50);

  const skills = ((skillsData ?? []) as unknown as SkillRow[])
    .filter((s): s is { skills: { id: string; name: string } } => s.skills !== null)
    .map((s) => s.skills);

  return { ...data, skills };
}

const updateProfileSchema = z.object({
  name: z.string().min(1, 'İsim zorunludur').max(100),
  linkedin_url: z.string().max(300).nullable(),
  city: z.string().max(100).nullable(),
  is_remote: z.boolean(),
  bio: z.string().max(500).nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export async function updateProfile(
  input: UpdateProfileInput,
): Promise<{ success: boolean; error?: string }> {
  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Geçersiz veri' };
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: 'Oturum açmanız gerekiyor' };

  const { error } = await supabase
    .from('users')
    .update({
      name: parsed.data.name,
      linkedin_url: parsed.data.linkedin_url,
      city: parsed.data.city,
      is_remote: parsed.data.is_remote,
      bio: parsed.data.bio,
    })
    .eq('id', user.id);

  if (error) return { success: false, error: `Profil güncellenemedi: ${error.message}` };

  revalidatePath('/dashboard/profile');
  return { success: true };
}

export async function getUserProjects(userId: string): Promise<UserProjectEntry[]> {
  const supabase = await createClient();

  // Kullanıcının oluşturduğu projeler (lider)
  const { data: ownedRaw } = await supabase
    .from('projects')
    .select('id, title, city, is_remote, category, status')
    .eq('leader_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  const owned: UserProjectEntry[] = (ownedRaw ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    city: p.city,
    is_remote: p.is_remote,
    category: p.category,
    status: (p.status as ProjectStatus) ?? 'active',
    isLeader: true,
    userRole: null,
  }));

  // Ekip üyesi olduğu projeler (ekip kurulmuş, lider değil)
  const { data: membershipRaw } = await supabase
    .from('team_members')
    .select('role_id, project_roles(role_name), teams(projects(id, title, city, is_remote, category, status, leader_id))')
    .eq('user_id', userId)
    .limit(10);

  const member: UserProjectEntry[] = ((membershipRaw ?? []) as unknown as MembershipRow[])
    .filter((row) => {
      const project = row.teams?.projects;
      return project && project.leader_id !== userId;
    })
    .map((row) => {
      const project = row.teams!.projects!;
      return {
        id: project.id,
        title: project.title,
        city: project.city,
        is_remote: project.is_remote,
        category: project.category,
        status: (project.status as ProjectStatus) ?? 'active',
        isLeader: false,
        userRole: row.project_roles?.role_name ?? null,
      };
    });

  // Rolü doldurulmuş ama ekip henüz kurulmamış projeler (başvurusu kabul edilmiş)
  const { data: filledRaw } = await supabase
    .from('project_roles')
    .select('role_name, projects!inner(id, title, city, is_remote, category, status, leader_id)')
    .eq('filled_by', userId)
    .limit(10);

  const seenIds = new Set([...owned.map((p) => p.id), ...member.map((p) => p.id)]);

  const accepted: UserProjectEntry[] = ((filledRaw ?? []) as unknown as FilledRoleRow[])
    .filter((row) => {
      const p = row.projects;
      return p && p.creator_id !== userId && !seenIds.has(p.id);
    })
    .map((row) => {
      const p = row.projects!;
      return {
        id: p.id,
        title: p.title,
        city: p.city,
        is_remote: p.is_remote,
        category: p.category,
        status: (p.status as ProjectStatus) ?? 'active',
        isLeader: false,
        userRole: row.role_name,
      };
    });

  return [...owned, ...member, ...accepted];
}

export interface UserStats {
  projectCount: number;
  teamCount: number;
  completedCount: number;
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const supabase = await createClient();

  const [
    { count: projectCount },
    { count: teamCount },
    { count: completedCount },
  ] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('creator_id', userId),
    supabase.from('teams').select('id', { count: 'exact', head: true }).eq('leader_id', userId),
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('creator_id', userId).eq('status', 'done'),
  ]);

  return {
    projectCount: projectCount ?? 0,
    teamCount: teamCount ?? 0,
    completedCount: completedCount ?? 0,
  };
}

export async function getUserApplications(userId: string): Promise<UserApplicationEntry[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('applications')
    .select('id, status, created_at, projects(title), project_roles(role_name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  type AppRow = {
    id: string;
    status: string;
    created_at: string;
    projects: { title: string } | null;
    project_roles: { role_name: string } | null;
  };

  return ((data ?? []) as unknown as AppRow[]).map((row) => ({
    id: row.id,
    status: (row.status as ApplicationStatus) ?? 'pending',
    createdAt: row.created_at,
    projectTitle: row.projects?.title ?? 'Bilinmeyen Proje',
    roleName: row.project_roles?.role_name ?? null,
  }));
}
