import { Suspense } from "react";
import { HomeTopbar } from "@/components/shared/home-topbar";
import { NotificationsWidget } from "@/features/notifications/components/notifications-widget";
import { ActiveTeamWidget } from "@/features/teams/components/active-team-widget";

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
          <Suspense fallback={<WidgetSkeleton />}>
            <NotificationsWidget />
          </Suspense>
          <Suspense fallback={<WidgetSkeleton />}>
            <ActiveTeamWidget />
          </Suspense>
        </div>
      </div>
    </>
  );
}

function WidgetSkeleton() {
  return (
    <div className="bg-white border-[1.5px] border-slate-200 rounded-2xl p-[1.3rem] animate-pulse">
      <div className="h-4 bg-slate-100 rounded w-1/2 mb-4" />
      <div className="flex flex-col gap-3">
        <div className="h-3 bg-slate-100 rounded" />
        <div className="h-3 bg-slate-100 rounded w-4/5" />
        <div className="h-3 bg-slate-100 rounded w-3/5" />
      </div>
    </div>
  )
}
