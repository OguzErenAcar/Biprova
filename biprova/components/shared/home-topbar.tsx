import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/shared/notification-bell";
import { SearchBar } from "@/components/shared/search-bar";

export function HomeTopbar() {
  return (
    <div id="dashboard-topbar" className="dashboard-topbar">
      <SearchBar />

      <div className="ml-auto flex items-center gap-[0.6rem]">
        <Button variant="outline" size="icon" asChild className="rounded-[10px] border-[1.5px]">
          <Link href="/dashboard/settings">⚙️</Link>
        </Button>

        <NotificationBell />
      </div>
    </div>
  );
}
