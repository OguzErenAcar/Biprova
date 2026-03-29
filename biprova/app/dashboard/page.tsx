import { ActiveTeamBanner } from "./_components/active-team-banner";
import { TimerWarning } from "./_components/timer-warning";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <TimerWarning />
      <ActiveTeamBanner />
    </div>
  );
}
