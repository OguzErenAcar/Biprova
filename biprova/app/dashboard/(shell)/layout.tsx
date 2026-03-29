 import { HomeTopbar } from "@/components/shared/home-topbar";
import { ActiveTeamBanner } from "../_components/active-team-banner";
import { TimerWarning } from "../_components/timer-warning";
 
export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Layer 2: TopBar + Sağ Panel */}
      <HomeTopbar />

      <div id="dashboard-shell" className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 px-4 sm:px-6 py-4 pb-20 lg:px-8 lg:py-6 lg:pb-6 items-start">
        <div id="dashboard-main">
          {/* Layer 4: Sayfa içeriği (dinamik) */}
          {children}
        </div>

        {/* Layer 2: Sağ panel widget'ları */}
        <div id="dashboard-right-panel" className="hidden lg:flex flex-col gap-5">
         <ActiveTeamBanner />
          <TimerWarning />
        </div>
      </div>
    </>
  );
}

 