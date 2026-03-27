const NOTIFICATIONS = [
  {
    icon: "✅",
    iconBg: "bg-green-100",
    text: "başvurunu kabul etti! Ekip grubuna eklendin.",
    bold: "Zeynep K.",
    time: "Az önce",
    unread: true,
  },
  {
    icon: "👋",
    iconBg: "bg-violet-100",
    text: "ekibine 1 kişi daha katıldı.",
    bold: "Kısa Film Projesi",
    time: "1 saat önce",
    unread: true,
  },
  {
    icon: "⏰",
    iconBg: "bg-amber-100",
    text: "Ekibinin toplantı başlatması için 18 saat kaldı!",
    bold: null,
    time: "3 saat önce",
    unread: true,
  },
  {
    icon: "💬",
    iconBg: "bg-blue-50",
    text: "sana mesaj gönderdi.",
    bold: "Mert O.",
    time: "Dün",
    unread: false,
  },
];

export function NotificationsWidget() {
  return (
    <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl p-[1.3rem]">
      <div className="font-nunito font-black text-[0.95rem] text-slate-900 mb-4 flex items-center justify-between">
        🔔 Bildirimler
        <span className="text-[0.75rem] text-blue-600 font-bold font-jakarta cursor-pointer">
          Tümünü Gör
        </span>
      </div>

      <div className="flex flex-col">
        {NOTIFICATIONS.map((n, i) => (
          <div
            key={i}
            className="flex gap-3 py-[0.7rem] border-b border-slate-100 last:border-b-0 last:pb-0 first:pt-0 items-start"
          >
            <div
              className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[1rem] flex-shrink-0 ${n.iconBg}`}
            >
              {n.icon}
            </div>
            <div className="flex-1">
              <p className="text-[0.82rem] leading-[1.45] text-slate-900">
                {n.bold && <strong>{n.bold} </strong>}
                {n.text}
              </p>
              <div className="text-[0.72rem] text-slate-400 mt-[0.2rem]">{n.time}</div>
            </div>
            {n.unread && (
              <div className="w-[7px] h-[7px] bg-blue-600 rounded-full flex-shrink-0 mt-[5px]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
