'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export interface ApplyResult {
  error?: string;
  success?: boolean;
}

const uuidSchema = z.string().uuid('Geçersiz kaynak kimliği.');

const applySchema = z.object({
  projectId: uuidSchema,
  roleId: uuidSchema,
});

const reviewSchema = z.object({
  applicationId: uuidSchema,
  decision: z.enum(['accepted', 'rejected']),
});

export async function applyToProject(projectId: string, roleId: string): Promise<ApplyResult> {
  const parsed = applySchema.safeParse({ projectId, roleId });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Geçersiz veri.' };

  const { projectId: pid, roleId: rid } = parsed.data;
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: 'Oturum açmanız gerekiyor.' };

  // Kendi projesine başvuru engeli
  const { data: project } = await supabase
    .from('projects')
    .select('leader_id')
    .eq('id', pid)
    .single();

  if (project?.leader_id === user.id) {
    return { error: 'Kendi projenize başvuramazsınız.' };
  }

  // Bu role daha önce başvurmuş mu?
  const { data: existing } = await supabase
    .from('applications')
    .select('id')
    .eq('user_id', user.id)
    .eq('role_id', rid)
    .limit(1)
    .maybeSingle();

  if (existing) return { error: 'Bu role zaten başvurdunuz.' };

  const { error } = await supabase
    .from('applications')
    .insert({ project_id: pid, user_id: user.id, role_id: rid, status: 'pending' });

  if (error) return { error: 'Başvuru gönderilemedi.' };

  return { success: true };
}

export async function reviewApplication(
  applicationId: string,
  decision: 'accepted' | 'rejected',
): Promise<ApplyResult> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: 'Oturum açmanız gerekiyor.' };

  const { data: app } = await supabase
    .from('applications')
    .select('id, user_id, role_id, project_id, status')
    .eq('id', applicationId)
    .single();

  if (!app) return { error: 'Başvuru bulunamadı.' };

  const { data: project } = await supabase
    .from('projects')
    .select('leader_id')
    .eq('id', app.project_id)
    .single();

  if (project?.leader_id !== user.id) return { error: 'Sadece proje lideri başvuruları değerlendirebilir.' };

  const { error: updateError } = await supabase
    .from('applications')
    .update({ status: decision })
    .eq('id', applicationId);

  if (updateError) return { error: updateError.message };

  if (decision === 'accepted') {
    // project_roles.is_filled = true → trg_check_project_full tetiklenir
    // tüm roller dolduysa projects.status = 'full' → trg_create_team_on_project_full ekibi kurar
    const { error: roleError } = await supabase
      .from('project_roles')
      .update({ is_filled: true, filled_by: app.user_id })
      .eq('id', app.role_id);

    if (roleError) return { error: roleError.message };

    const { data: leaderUser } = await supabase
      .from('users')
      .select('name')
      .eq('id', user.id)
      .single();

    await supabase.from('notifications').insert({
      user_id: app.user_id,
      type: 'application_accepted',
      payload: { actor_name: leaderUser?.name ?? 'Lider' },
      is_read: false,
    });

    revalidatePath('/dashboard/projects');
    revalidatePath(`/dashboard/projects/${app.project_id}`);
    revalidatePath(`/dashboard/posts/projects/${app.project_id}`);
  }

  return { success: true };
}
