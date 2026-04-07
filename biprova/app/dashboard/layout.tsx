import { Suspense } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { SidebarLoader } from "@/components/shared/sidebar-loader";
 import { HomeTopbar } from "@/components/shared/home-topbar";

export default function DashboardLayout({  children}: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeTopbar />
      <div className="flex flex-1 items-start">
        <Suspense fallback={<Sidebar />}>
          <SidebarLoader />
        </Suspense>
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
