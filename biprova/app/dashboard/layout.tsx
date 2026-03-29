import { Suspense } from "react";
import { SidebarLoader } from "@/components/shared/sidebar-loader";
import { TabBar } from "@/components/shared/tab-bar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="dashboard-root" className="flex min-h-screen bg-slate-100">
      <Suspense fallback={<aside className="w-60 bg-white border-r border-slate-200 fixed top-0 left-0 bottom-0 z-50" />}>
        <SidebarLoader />
      </Suspense>
      <div id="dashboard-content" className="lg:ml-60 flex-1 flex flex-col min-h-screen">
        <Suspense>
          {children}
        </Suspense>
      </div>
      <Suspense>
        <TabBar />
      </Suspense>
    </div>
  );
}
