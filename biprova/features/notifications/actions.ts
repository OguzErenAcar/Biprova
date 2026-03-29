'use server'

import { createClient } from '@/lib/supabase/server'

export interface NotificationItem {
  id: string
  icon: string
  iconBg: string
  text: string
  bold: string | null
  time: string
  unread: boolean
}

type NotificationPayload = {
  actor_name?: string
  resource_name?: string
  hours_remaining?: number
}

type RawNotification = {
  id: string
  type: string
  payload: NotificationPayload
  is_read: boolean
  created_at: string
}

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

const TYPE_MAP: Record<
  string,
  {
    icon: string
    iconBg: string
    getText: (p: NotificationPayload) => { text: string; bold: string | null }
  }
> = {
  application_accepted: {
    icon: '✅',
    iconBg: 'bg-green-100',
    getText: (p) => ({
      text: 'başvurunu kabul etti! Ekip grubuna eklendin.',
      bold: p.actor_name ?? null,
    }),
  },
  team_member_joined: {
    icon: '👋',
    iconBg: 'bg-violet-100',
    getText: (p) => ({
      text: 'ekibine 1 kişi daha katıldı.',
      bold: p.resource_name ?? null,
    }),
  },
  team_deadline_warning: {
    icon: '⏰',
    iconBg: 'bg-amber-100',
    getText: (p) => ({
      text: `Ekibinin toplantı başlatması için ${p.hours_remaining ?? '?'} saat kaldı!`,
      bold: null,
    }),
  },
  message: {
    icon: '💬',
    iconBg: 'bg-blue-50',
    getText: (p) => ({
      text: 'sana mesaj gönderdi.',
      bold: p.actor_name ?? null,
    }),
  },
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) return []

  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, payload, is_read, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error || !data) return []

  return (data as RawNotification[])
    .map((n) => {
      const mapping = TYPE_MAP[n.type]
      if (!mapping) return null
      const { text, bold } = mapping.getText(n.payload)
      return {
        id: n.id,
        icon: mapping.icon,
        iconBg: mapping.iconBg,
        text,
        bold,
        time: toRelativeTime(n.created_at),
        unread: !n.is_read,
      }
    })
    .filter((n): n is NotificationItem => n !== null)
}
