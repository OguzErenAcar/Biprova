import { HomeTopbar } from "@/components/shared/home-topbar";
 
import { NotificationsWidget } from "@/features/notifications/components/notifications-widget";
import { ActiveTeamWidget } from "@/features/teams/components/active-team-widget";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Layer 2: TopBar + Sağ Panel */}
      <HomeTopbar />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 px-4 sm:px-6 py-4 pb-20 lg:px-8 lg:py-6 lg:pb-6 items-start">
        <div> 
          {/* Layer 4: Sayfa içeriği (dinamik) */}
          {children}
        </div>

        {/* Layer 2: Sağ panel widget'ları */}
        <div className="hidden lg:flex flex-col gap-5">
          <NotificationsWidget />
          <ActiveTeamWidget />
        </div>
      </div>
    </>
  );
}
