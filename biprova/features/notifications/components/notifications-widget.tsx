import { getNotifications, NotificationItem } from '@/features/notifications/actions'

export async function NotificationsWidget() {
  const notifications = await getNotifications()

  return (
    <div id="notifications-widget" className="bg-canvas border-[1.5px] border-edge rounded-2xl p-[1.3rem]">
      <div className="font-nunito font-black text-lead text-ink mb-4 flex items-center justify-between">
        🔔 Bildirimler
        <span className="text-meta text-brand font-bold font-jakarta cursor-pointer">
          Tümünü Gör
        </span>
      </div>

      <div className="flex flex-col">
        {notifications.length === 0 ? (
          <p className="text-caption text-ink-subtle text-center py-4">Bildirim yok</p>
        ) : (
          notifications.map((n: NotificationItem) => (
            <div
              key={n.id}
              className="flex gap-3 py-[0.7rem] border-b border-edge last:border-b-0 last:pb-0 first:pt-0 items-start"
            >
              <div
                className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-base flex-shrink-0 ${n.iconBg}`}
              >
                {n.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-caption font-semibold leading-[1.45] text-ink truncate">
                  {n.title}
                </p>
                <p className="text-meta leading-[1.45] text-ink-muted mt-[0.1rem]">
                  {n.body}
                </p>
                <div className="text-meta text-ink-subtle mt-[0.2rem]">{n.time}</div>
              </div>
              {n.unread && (
                <div className="w-[7px] h-[7px] bg-brand rounded-full flex-shrink-0 mt-[5px]" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
