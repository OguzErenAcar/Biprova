'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { createClient } from '@/lib/supabase/client'
import { getNotifications, markAllAsRead, NotificationItem } from '@/features/notifications/actions'
import { getMutedTeams, MUTE_EVENT } from '@/lib/mute-prefs'

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [open, setOpen] = useState(false)
  const [mutedTeams, setMutedTeams] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getNotifications().then(setNotifications)
    setMutedTeams(getMutedTeams())
    const sync = () => setMutedTeams(getMutedTeams())
    window.addEventListener(MUTE_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(MUTE_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  // Realtime: yeni bildirim gelince listeyi güncelle
  useEffect(() => {
    const supabase = createClient()
    let mounted = true
    let channel: ReturnType<typeof supabase.channel> | null = null

    supabase.auth.getUser().then(({ data }) => {
      const userId = data.user?.id
      if (!userId || !mounted) return

      channel = supabase
        .channel('user-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          () => {
            getNotifications().then((items) => {
              if (mounted) setNotifications(items)
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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleOpen() {
    setOpen(true)
    if (notifications.some((n) => n.unread)) {
      markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
    }
  }

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <div
      id="notification-bell"
      ref={containerRef}
      className="relative"
      onMouseEnter={handleOpen}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="relative rounded-[10px] border-[1.5px] border-slate-200 h-8 w-8 flex items-center justify-center text-slate-600">
        <Bell size={16} strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute top-[6px] right-[6px] w-[7px] h-[7px] bg-red-500 rounded-full border-[1.5px] border-slate-100" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full w-[320px] z-[60] pt-2">
          <div className="bg-surface border-[1.5px] border-slate-200 rounded-2xl shadow-xl p-[1.1rem]">
            <div className="font-display font-black text-body text-slate-900 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Bell size={15} strokeWidth={2.5} /> Bildirimler
              </span>
              <Link
                href="/dashboard/notifications"
                className="text-label text-blue-600 font-bold font-body cursor-pointer hover:underline"
                onClick={() => setOpen(false)}
              >
                Tümünü Gör
              </Link>
            </div>

            <Separator className="mb-3" />

            <div className="flex flex-col">
              {notifications.length === 0 ? (
                <p className="text-caption text-slate-400 text-center py-3">Bildirim yok</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex gap-3 py-[0.6rem] border-b border-slate-100 last:border-b-0 last:pb-0 first:pt-0 items-start"
                  >
                    <Avatar className="w-[32px] h-[32px] rounded-[9px] flex-shrink-0">
                      <AvatarFallback className={`rounded-[9px] text-body ${n.iconBg}`}>
                        {n.icon}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-caption font-semibold leading-[1.45] text-slate-900 truncate">
                        {n.title}
                      </p>
                      <p className="text-label leading-[1.45] text-slate-600 mt-[0.1rem]">
                        {n.body}
                      </p>
                      <div className="text-label text-slate-400 mt-[0.15rem]">{n.time}</div>
                    </div>
                    {n.unread && (
                      <Badge className="w-[6px] h-[6px] p-0 rounded-full bg-blue-600 flex-shrink-0 mt-[6px]" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
