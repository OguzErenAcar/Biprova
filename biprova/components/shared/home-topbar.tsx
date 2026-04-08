import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/shared/notification-bell";
import { SearchBar } from "@/components/shared/search-bar";

export function HomeTopbar() {
  return (
    <div id="dashboard-topbar" className="my-5 bg-white/30 rounded-md mx-auto w-[90%] backdrop-blur-md border border-slate-400 px-4 sm:px-6 lg:px-8 py-[0.9rem] flex items-center gap-4">
      <Link
        href="/dashboard"
        className="font-display font-black text-h2 text-blue-600 px-2  no-underline"
      >
        Bi<span className="text-slate-900">prova</span>
      </Link>

      <div className="ml-auto flex items-center gap-[0.6rem]">
         <SearchBar />
        <Button variant="outline" size="icon" asChild className="rounded-[10px] border-[1.5px]">
          <Link href="/dashboard/settings">⚙️</Link>
        </Button>

        <NotificationBell />
      </div>
    </div>
  );
}
