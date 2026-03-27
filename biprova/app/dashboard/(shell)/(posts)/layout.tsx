 
import { ActiveTeamBanner } from "@/app/dashboard/_components/active-team-banner";
import { TimerWarning } from "@/app/dashboard/_components/timer-warning";
 

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Layer 2: TopBar + Sağ Panel */}
        {/* Layer 3: Aktif ekip banner + uyarı */}
          <ActiveTeamBanner />
          <TimerWarning />
          {children}
    </>
  );
}
