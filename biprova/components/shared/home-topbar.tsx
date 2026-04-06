import Link from "next/link";
import { NotificationBell } from "@/components/shared/notification-bell";
import { SearchBar } from "@/components/shared/search-bar";

export function HomeTopbar() {
  return (
    <div id="dashboard-topbar" className="sticky top-0 z-40 bg-slate-100/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-[0.9rem] flex items-center gap-4">
      <SearchBar />

      {/* Sağ ikonlar */}
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
