import Link from "next/link";
import { NotificationBell } from "@/components/shared/notification-bell";

export function HomeTopbar() {
  return (
    <div id="dashboard-topbar" className="sticky top-0 z-40 bg-slate-100/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-[0.9rem] flex items-center gap-4">
      {/* Arama kutusu - ortalanmış */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-[400px] relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[0.9rem] pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          placeholder="Proje veya kişi ara..."
          className="w-full bg-white border-[1.5px] border-slate-200 rounded-[10px] pl-9 pr-4 py-[0.6rem] font-jakarta text-[0.88rem] text-slate-900 outline-none focus:border-blue-600 placeholder:text-slate-400 transition-colors duration-200"
        />
      </div>

      <div className="ml-auto flex items-center gap-[0.6rem]">
        {/* Ayarlar */}
        <Link
          href="/dashboard/settings"
          className="w-[38px] h-[38px] rounded-[10px] bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[1rem] cursor-pointer hover:border-blue-600 transition-colors duration-150"
        >
          ⚙️
        </Link>

        {/* Bildirim dropdown */}
        <NotificationBell />
      </div>
    </div>
  );
}
