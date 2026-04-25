'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { getNotifications, markAllAsRead, NotificationItem } from '@/features/notifications/actions'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNotifications(50).then((items) => {
      setNotifications(items)
      setLoading(false)
      if (items.some((n) => n.unread)) {
        markAllAsRead()
        setNotifications(items.map((n) => ({ ...n, unread: false })))
      }
    })
  }, [])

  // Realtime
  useEffect(() => {
    const supabase = createClient()
    let mounted = true
    let channel: ReturnType<typeof supabase.channel> | null = null

    supabase.auth.getUser().then(({ data }) => {
      const userId = data.user?.id
      if (!userId || !mounted) return

      channel = supabase
        .channel('notifications-page')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          () => {
            getNotifications(50).then((items) => {
              if (!mounted) return
              setNotifications(items.map((n) => ({ ...n, unread: false })))
              markAllAsRead()
            })
          }
        )
        .subscribe()
    })

    return () => {
      mounted = false
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 max-w-full pb-10 md:pe-8">
      <h1 className="font-nunito font-black text-h2 text-ink">Bildirimler</h1>

      <div className="bg-white border-[1.5px] border-slate-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-ink-subtle text-lead">Yükleniyor...</div>
        ) : notifications.length === 0 ? (
          <div className="p-10 text-center">
            <Bell size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-lead text-ink-subtle">Henüz bildirim yok</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            {notifications.map((n) => (
              <div key={n.id} className="flex gap-3 px-5 py-4 items-start">
                <Avatar className="w-[36px] h-[36px] rounded-[10px] flex-shrink-0">
                  <AvatarFallback className={`rounded-[10px] text-base ${n.iconBg}`}>
                    {n.icon}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-body font-semibold text-ink">{n.title}</p>
                  <p className="text-caption text-ink-muted mt-0.5">{n.body}</p>
                  <p className="text-label text-slate-400 mt-1">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
