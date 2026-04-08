import Link from "next/link";
import { NotificationBell } from "@/components/shared/notification-bell";
import { SearchBar } from "@/components/shared/search-bar";

export function HomeTopbar() {
  return (
    <div id="dashboard-topbar" className="my-5 g-topbar shadow-lg shadow-black/10 rounded-md mx-auto w-[90%]  border border-slate-400 px-4 sm:px-6 lg:px-8 py-[0.9rem] flex items-center gap-4">
      <Link
        href="/dashboard"
        className="font-display font-black text-h2 text-blue-600 px-2  no-underline"
      >
        Bi<span className="text-slate-900">prova</span>
      </Link>

      <div className="ml-auto flex items-center gap-[0.6rem]">
         <SearchBar />
        <button    className="rounded-[10px] border-[1.5px]  h-8 w-8">
          <Link href="/dashboard/settings">⚙️</Link>
        </button>

        <NotificationBell />
      </div>
    </div>
  );
}
