'use server'

import { createClient } from '@/lib/supabase/server'

export interface NotificationItem {
  id: string
  icon: string
  iconBg: string
  title: string
  body: string
  time: string
  unread: boolean
  teamId?: string
}

const ICON_MAP: Record<string, { icon: string; iconBg: string }> = {
  welcome:              { icon: '👋', iconBg: 'bg-brand-surface' },
  new_application:      { icon: '📋', iconBg: 'bg-blue-100' },
  application_accepted: { icon: '✅', iconBg: 'bg-green-100' },
  application_rejected: { icon: '❌', iconBg: 'bg-red-100' },
  team_formed:          { icon: '🚀', iconBg: 'bg-violet-100' },
  new_message:          { icon: '💬', iconBg: 'bg-blue-50' },
  removed_from_team:    { icon: '👋', iconBg: 'bg-orange-100' },
  new_leader:           { icon: '👑', iconBg: 'bg-yellow-100' },
  project_deleted:      { icon: '🗑️', iconBg: 'bg-red-50' },
  project_full:         { icon: '🎯', iconBg: 'bg-green-50' },
  new_news:             { icon: '📰', iconBg: 'bg-slate-100' },
  post_published:       { icon: '🎊', iconBg: 'bg-purple-100' },
  team_post:            { icon: '📣', iconBg: 'bg-indigo-100' },
}

const DEFAULT_ICON = { icon: '🔔', iconBg: 'bg-slate-100' }

function toRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 2) return 'Az önce'
  if (mins < 60) return `${mins} dakika önce`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} saat önce`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Dün'
  return `${days} gün önce`
}

export async function getNotifications(limit = 10): Promise<NotificationItem[]> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return []

  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, payload, is_read, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []

  return data.map((n) => {
    const { icon, iconBg } = ICON_MAP[n.type as string] ?? DEFAULT_ICON
    const payload = n.payload as { title?: string; body?: string; team_id?: string } | null
    return {
      id: n.id as string,
      icon,
      iconBg,
      title: payload?.title ?? '',
      body:  payload?.body  ?? '',
      time:  toRelativeTime(n.created_at as string),
      unread: !(n.is_read as boolean),
      teamId: payload?.team_id,
    }
  })
}

export async function markAllAsRead(): Promise<void> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)
}

export async function markAsRead(id: string): Promise<void> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .eq('user_id', user.id)
}
