import { Suspense } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { SidebarLoader } from "@/components/shared/sidebar-loader";
import { TabBar } from "@/components/shared/tab-bar";
import { HomeTopbar } from "@/components/shared/home-topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="dashboard-root" className="dashboard-root">
      <HomeTopbar />
      <Suspense fallback={<Sidebar />}>
        <SidebarLoader />
      </Suspense>
      <div id="dashboard-content" className="dashboard-content pt-14">
        {children}
      </div>
      <TabBar />
    </div>
  );
}
