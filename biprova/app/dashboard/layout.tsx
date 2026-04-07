import { Suspense } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { SidebarLoader } from "@/components/shared/sidebar-loader";
 import { HomeTopbar } from "@/components/shared/home-topbar";

export default function DashboardLayout({  children}: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <HomeTopbar />
      <Suspense fallback={<Sidebar />}>
        <SidebarLoader />
      </Suspense>
      <div className="lg:ml-60 flex-1">
        {children}
      </div>
    </div>
  );
}
