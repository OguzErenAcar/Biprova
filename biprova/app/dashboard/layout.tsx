import { Suspense } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { SidebarLoader } from "@/components/shared/sidebar-loader";
import { TabBar } from "@/components/shared/tab-bar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="dashboard-root" className="flex min-h-screen bg-slate-100">
      <Suspense fallback={<Sidebar />}>
        <SidebarLoader />
      </Suspense>
      <div id="dashboard-content" className="lg:ml-60 flex-1 flex flex-col min-h-screen">
        {children}
      </div>
      <TabBar />
    </div>
  );
}
