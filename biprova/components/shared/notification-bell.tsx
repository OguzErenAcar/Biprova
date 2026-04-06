'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { getNotifications, NotificationItem } from '@/features/notifications/actions'

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getNotifications().then(setNotifications)
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

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <div
      id="notification-bell"
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="relative w-[38px] h-[38px] rounded-[10px] bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[1rem] cursor-pointer hover:border-blue-600 transition-colors duration-150">
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-[6px] right-[6px] w-[7px] h-[7px] bg-red-500 rounded-full border-[1.5px] border-slate-100" />
        )}
      </div>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-[320px] bg-white border-[1.5px] border-slate-200 rounded-2xl shadow-xl z-50 p-[1.1rem]">
          <div className="font-nunito font-black text-[0.9rem] text-slate-900 mb-3 flex items-center justify-between">
            🔔 Bildirimler
            <Link
              href="/dashboard/notifications"
              className="text-[0.72rem] text-blue-600 font-bold font-jakarta cursor-pointer hover:underline"
              onClick={() => setOpen(false)}
            >
              Tümünü Gör
            </Link>
          </div>

          <div className="flex flex-col">
            {notifications.length === 0 ? (
              <p className="text-[0.82rem] text-slate-400 text-center py-3">Bildirim yok</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex gap-3 py-[0.6rem] border-b border-slate-100 last:border-b-0 last:pb-0 first:pt-0 items-start"
                >
                  <div
                    className={`w-[32px] h-[32px] rounded-[9px] flex items-center justify-center text-[0.9rem] flex-shrink-0 ${n.iconBg}`}
                  >
                    {n.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-[0.8rem] leading-[1.45] text-slate-900">
                      {n.bold && <strong>{n.bold} </strong>}
                      {n.text}
                    </p>
                    <div className="text-[0.7rem] text-slate-400 mt-[0.15rem]">{n.time}</div>
                  </div>
                  {n.unread && (
                    <div className="w-[6px] h-[6px] bg-blue-600 rounded-full flex-shrink-0 mt-[6px]" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
