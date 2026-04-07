import { getNotifications, NotificationItem } from '@/features/notifications/actions'

export async function NotificationsWidget() {
  const notifications = await getNotifications()

  return (
    <div id="notifications-widget" className="bg-white border-[1.5px] border-slate-200 rounded-2xl p-[1.3rem]">
      <div className="font-nunito font-black text-lead text-slate-900 mb-4 flex items-center justify-between">
        🔔 Bildirimler
        <span className="text-meta text-blue-600 font-bold font-jakarta cursor-pointer">
          Tümünü Gör
        </span>
      </div>

      <div className="flex flex-col">
        {notifications.length === 0 ? (
          <p className="text-caption text-slate-400 text-center py-4">Bildirim yok</p>
        ) : (
          notifications.map((n: NotificationItem) => (
            <div
              key={n.id}
              className="flex gap-3 py-[0.7rem] border-b border-slate-100 last:border-b-0 last:pb-0 first:pt-0 items-start"
            >
              <div
                className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-base flex-shrink-0 ${n.iconBg}`}
              >
                {n.icon}
              </div>
              <div className="flex-1">
                <p className="text-caption leading-[1.45] text-slate-900">
                  {n.bold && <strong>{n.bold} </strong>}
                  {n.text}
                </p>
                <div className="text-meta text-slate-400 mt-[0.2rem]">{n.time}</div>
              </div>
              {n.unread && (
                <div className="w-[7px] h-[7px] bg-blue-600 rounded-full flex-shrink-0 mt-[5px]" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
