'use server';

import { createClient } from '@/lib/supabase/server';

export interface ApplyResult {
  error?: string;
  success?: boolean;
}

export async function applyToProject(projectId: string, roleId: string): Promise<ApplyResult> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: 'Oturum açmanız gerekiyor.' };

  // Kendi projesine başvuru engeli
  const { data: project } = await supabase
    .from('projects')
    .select('creator_id')
    .eq('id', projectId)
    .single();

  if (project?.creator_id === user.id) {
    return { error: 'Kendi projenize başvuramazsınız.' };
  }

  // Bu role daha önce başvurmuş mu?
  const { data: existing } = await supabase
    .from('applications')
    .select('id')
    .eq('user_id', user.id)
    .eq('role_id', roleId)
    .limit(1)
    .maybeSingle();

  if (existing) return { error: 'Bu role zaten başvurdunuz.' };

  const { error } = await supabase
    .from('applications')
    .insert({ project_id: projectId, user_id: user.id, role_id: roleId, status: 'pending' });

  if (error) return { error: 'Başvuru gönderilemedi.' };

  return { success: true };
}
