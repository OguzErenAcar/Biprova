import { Suspense } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { SidebarLoader } from "@/components/shared/sidebar-loader";
import { HomeTopbar } from "@/components/shared/home-topbar";
import { SuggestedPeople } from "@/components/shared/suggested-people";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <HomeTopbar />
      <div className="flex">
        <Suspense fallback={<Sidebar />}>
          <SidebarLoader />
        </Suspense>
        <div className="flex-1 min-w-0">{children}</div>
        <div id="dashboard-right-panel" className="hidden lg:flex flex-col gap-5 sticky top-4 self-start mx-3">
          <SuggestedPeople />
        </div>
      </div>
    </div>
  );
}
