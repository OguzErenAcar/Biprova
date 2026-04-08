import { Suspense } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { SidebarLoader } from "@/components/shared/sidebar-loader";
import { HomeTopbar } from "@/components/shared/home-topbar";
import { SuggestedPeople } from "@/components/shared/suggested-people";
import { DashboardGrid } from "@/components/shared/dashboard-grid";
import { SplashOverlay } from "@/components/shared/splash-overlay";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <SplashOverlay />
      <HomeTopbar />
      <div className="h-screen">
        <DashboardGrid
          sidebar={
            <Suspense fallback={<Sidebar />}>
              <SidebarLoader />
            </Suspense>
          }
          suggestedPeople={<SuggestedPeople />}
        >
          {children}
        </DashboardGrid>
      </div>
    </div>
  );
}
