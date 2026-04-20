'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { resolveBadgeUrls } from '@/lib/badge';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  city: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  linkedin_url: string | null;
  badge: string | null;
  badge_url: string | null;
  cv_url: string | null;
  cv_public: boolean;
  projects_public: boolean;
  teams_public: boolean;
  applications_public: boolean;
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
  status: ProjectStatus;
  isLeader: boolean;
  userRole: string | null;
}

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface UserApplicationEntry {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
  projectId: string | null;
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
    status: string;
    leader_id: string;
  } | null;
};

export async function getUserProfileById(id: string): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data: { user: currentUser } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, bio, city, avatar_url, cover_url, linkedin_url, badge, cv_url, cv_public, projects_public, teams_public, applications_public, created_at')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  const [{ data: skillsData }, badgeMap] = await Promise.all([
    supabase.from('user_skills').select('skills(id, name)').eq('user_id', id).limit(50),
    resolveBadgeUrls(supabase, [data.badge]),
  ]);

  const skills = ((skillsData ?? []) as unknown as SkillRow[])
    .filter((s): s is { skills: { id: string; name: string } } => s.skills !== null)
    .map((s) => s.skills);

  // E-posta sadece hesap sahibine gösterilir
  const email = currentUser?.id === id ? data.email : '';

  return { ...data, email, skills, badge_url: badgeMap.get(data.badge ?? '') ?? null };
}

export async function getCurrentUserProfile(): Promise<UserProfile> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/');

  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, bio, city, avatar_url, cover_url, linkedin_url, badge, cv_url, cv_public, projects_public, teams_public, applications_public, created_at')
    .eq('id', user.id)
    .single();

  if (error || !data) {
    throw new Error(`Profil yüklenemedi: ${error?.message ?? 'kullanıcı bulunamadı'}`);
  }

  const [{ data: skillsData }, badgeMap] = await Promise.all([
    supabase.from('user_skills').select('skills(id, name)').eq('user_id', user.id).limit(50),
    resolveBadgeUrls(supabase, [data.badge]),
  ]);

  const skills = ((skillsData ?? []) as unknown as SkillRow[])
    .filter((s): s is { skills: { id: string; name: string } } => s.skills !== null)
    .map((s) => s.skills);

  return { ...data, skills, badge_url: badgeMap.get(data.badge ?? '') ?? null };
}

const updateProfileSchema = z.object({
  name: z.string().min(1, 'İsim zorunludur').max(100),
  linkedin_url: z.string().max(300).nullable(),
  city: z.string().max(100).nullable(),
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
      bio: parsed.data.bio,
    })
    .eq('id', user.id);

  if (error) return { success: false, error: `Profil güncellenemedi: ${error.message}` };

  revalidatePath('/dashboard/profile');
  return { success: true };
}

const ALLOWED_IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

function isValidStorageImageUrl(url: string): boolean {
  if (!url.startsWith(`${SUPABASE_URL}/storage/`)) return false;
  const ext = url.split('.').pop()?.toLowerCase().split('?')[0] ?? '';
  return ALLOWED_IMAGE_EXTS.has(ext);
}

function isValidStoragePdfUrl(url: string): boolean {
  if (!url.startsWith(`${SUPABASE_URL}/storage/`)) return false;
  const ext = url.split('.').pop()?.toLowerCase().split('?')[0] ?? '';
  return ext === 'pdf';
}

export async function saveAvatarUrl(
  avatarUrl: string,
): Promise<{ success: boolean; error?: string }> {
  if (!isValidStorageImageUrl(avatarUrl)) return { success: false, error: 'Geçersiz fotoğraf URL.' };

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: 'Oturum açmanız gerekiyor' };

  const { error } = await supabase
    .from('users')
    .update({ avatar_url: avatarUrl })
    .eq('id', user.id);

  if (error) return { success: false, error: `Fotoğraf kaydedilemedi: ${error.message}` };

  revalidatePath('/dashboard/profile');
  return { success: true };
}

export async function saveCoverUrl(
  coverUrl: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: 'Oturum açmanız gerekiyor' };

  const { error } = await supabase
    .from('users')
    .update({ cover_url: coverUrl })
    .eq('id', user.id);

  if (error) return { success: false, error: `Kapak fotoğrafı kaydedilemedi: ${error.message}` };

  revalidatePath('/dashboard/profile');
  return { success: true };
}

export async function removeAvatarUrl(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: 'Oturum açmanız gerekiyor' };

  await supabase.storage.from('avatars').remove([`${user.id}/avatar.jpg`]);

  const { error } = await supabase
    .from('users')
    .update({ avatar_url: null })
    .eq('id', user.id);

  if (error) return { success: false, error: `Profil fotoğrafı kaldırılamadı: ${error.message}` };

  revalidatePath('/dashboard/profile');
  return { success: true };
}

export async function removeCoverUrl(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: 'Oturum açmanız gerekiyor' };

  await supabase.storage.from('covers').remove([`${user.id}/cover.jpg`]);

  const { error } = await supabase
    .from('users')
    .update({ cover_url: null })
    .eq('id', user.id);

  if (error) return { success: false, error: `Kapak fotoğrafı kaldırılamadı: ${error.message}` };

  revalidatePath('/dashboard/profile');
  return { success: true };
}

export async function removeCv(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: 'Oturum açmanız gerekiyor' };

  await supabase.storage.from('cvs').remove([`${user.id}/cv.pdf`]);

  const { error } = await supabase
    .from('users')
    .update({ cv_url: null })
    .eq('id', user.id);

  if (error) return { success: false, error: `CV kaldırılamadı: ${error.message}` };

  revalidatePath('/dashboard/profile');
  return { success: true };
}

export async function saveCvUrl(
  cvUrl: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: 'Oturum açmanız gerekiyor' };

  const { error } = await supabase
    .from('users')
    .update({ cv_url: cvUrl })
    .eq('id', user.id);

  if (error) return { success: false, error: `CV kaydedilemedi: ${error.message}` };

  revalidatePath('/dashboard/profile');
  return { success: true };
}

export async function saveCvPublic(
  cvPublic: boolean,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: 'Oturum açmanız gerekiyor' };

  const { error } = await supabase
    .from('users')
    .update({ cv_public: cvPublic })
    .eq('id', user.id);

  if (error) return { success: false, error: `Ayar kaydedilemedi: ${error.message}` };

  revalidatePath('/dashboard/profile');
  return { success: true };
}

export type VisibilitySection = 'projects' | 'teams' | 'applications';

export async function saveProfileVisibility(
  section: VisibilitySection,
  isPublic: boolean,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: 'Oturum açmanız gerekiyor' };

  const update =
    section === 'projects'     ? { projects_public: isPublic } :
    section === 'teams'        ? { teams_public: isPublic } :
                                 { applications_public: isPublic };

  const { error } = await supabase
    .from('users')
    .update(update)
    .eq('id', user.id);

  if (error) return { success: false, error: `Ayar kaydedilemedi: ${error.message}` };

  revalidatePath('/dashboard/profile', 'layout');
  revalidatePath(`/dashboard/profile/${user.id}`);
  return { success: true };
}

export async function getUserProjects(userId: string): Promise<UserProjectEntry[]> {
  const supabase = await createClient();

  // Kullanıcının oluşturduğu projeler (lider)
  const { data: ownedRaw } = await supabase
    .from('projects')
    .select('id, title, city, is_remote, status')
    .eq('leader_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  const owned: UserProjectEntry[] = (ownedRaw ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    city: p.city,
    is_remote: p.is_remote,
    status: (p.status as ProjectStatus) ?? 'active',
    isLeader: true,
    userRole: null,
  }));

  // Ekip üyesi olduğu projeler (ekip kurulmuş, lider değil)
  const { data: membershipRaw } = await supabase
    .from('team_members')
    .select('role_id, project_roles(role_name), teams(projects(id, title, city, is_remote, status, leader_id))')
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
        status: (project.status as ProjectStatus) ?? 'active',
        isLeader: false,
        userRole: row.project_roles?.role_name ?? null,
      };
    });

  // Rolü doldurulmuş ama ekip henüz kurulmamış projeler (başvurusu kabul edilmiş)
  const { data: filledRaw } = await supabase
    .from('project_roles')
    .select('role_name, projects!inner(id, title, city, is_remote, status, leader_id)')
    .eq('filled_by', userId)
    .limit(10);

  const seenIds = new Set([...owned.map((p) => p.id), ...member.map((p) => p.id)]);

  const accepted: UserProjectEntry[] = ((filledRaw ?? []) as unknown as FilledRoleRow[])
    .filter((row) => {
      const p = row.projects;
      return p && p.leader_id !== userId && !seenIds.has(p.id);
    })
    .map((row) => {
      const p = row.projects!;
      return {
        id: p.id,
        title: p.title,
        city: p.city,
        is_remote: p.is_remote,
        status: (p.status as ProjectStatus) ?? 'active',
        isLeader: false,
        userRole: row.role_name,
      };
    });

  return [...owned, ...member, ...accepted];
}

export type TeamStatus = 'pending' | 'active' | 'no_project';

export interface UserTeamEntry {
  id: string;
  name: string | null;
  projectTitle: string | null;
  status: TeamStatus;
  isLeader: boolean;
}

type TeamMemberRow = {
  teams: {
    id: string;
    name: string | null;
    status: string;
    leader_id: string | null;
    projects: { title: string } | null;
  } | null;
};

export async function getUserTeams(userId: string): Promise<UserTeamEntry[]> {
  const supabase = await createClient();

  const { data: ledRaw } = await supabase
    .from('teams')
    .select('id, name, status, projects!fk_teams_project(title)')
    .eq('leader_id', userId)
    .limit(10);

  const led: UserTeamEntry[] = (ledRaw ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    projectTitle: (t.projects as unknown as { title: string } | null)?.title ?? null,
    status: (t.status as TeamStatus) ?? 'pending',
    isLeader: true,
  }));

  const { data: memberRaw } = await supabase
    .from('team_members')
    .select('teams(id, name, status, leader_id, projects!fk_teams_project(title))')
    .eq('user_id', userId)
    .limit(10);

  const seenIds = new Set(led.map((t) => t.id));

  const member: UserTeamEntry[] = ((memberRaw ?? []) as unknown as TeamMemberRow[])
    .filter((row) => row.teams && row.teams.leader_id !== userId && !seenIds.has(row.teams.id))
    .map((row) => ({
      id: row.teams!.id,
      name: row.teams!.name,
      projectTitle: row.teams!.projects?.title ?? null,
      status: (row.teams!.status as TeamStatus) ?? 'pending',
      isLeader: false,
    }));

  return [...led, ...member];
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
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('leader_id', userId),
    supabase.from('teams').select('id', { count: 'exact', head: true }).eq('leader_id', userId),
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('leader_id', userId).eq('status', 'done'),
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
    .select('id, status, created_at, project_id, projects(title), project_roles(role_name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  type AppRow = {
    id: string;
    status: string;
    created_at: string;
    project_id: string | null;
    projects: { title: string } | null;
    project_roles: { role_name: string } | null;
  };

  return ((data ?? []) as unknown as AppRow[]).map((row) => ({
    id: row.id,
    status: (row.status as ApplicationStatus) ?? 'pending',
    createdAt: row.created_at,
    projectId: row.project_id ?? null,
    projectTitle: row.projects?.title ?? 'Bilinmeyen Proje',
    roleName: row.project_roles?.role_name ?? null,
  }));
}

export async function withdrawApplication(
  applicationId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: 'Oturum açmanız gerekiyor' };

  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', applicationId)
    .eq('user_id', user.id)
    .eq('status', 'pending');

  if (error) return { success: false, error: `Başvuru geri alınamadı: ${error.message}` };

  revalidatePath('/dashboard/profile');
  return { success: true };
}
