import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/shared/sidebar";
import { SidebarLoader } from "@/components/shared/sidebar-loader";
import { HomeTopbar } from "@/components/shared/home-topbar";
import { TabBar } from "@/components/shared/tab-bar";
import { DashboardGrid } from "@/components/shared/dashboard-grid";
import { SplashWrapper } from "@/components/shared/splash-overlay";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <HomeTopbar />
      <div className="h-screen">
        <DashboardGrid
          sidebar={
            <Suspense fallback={<Sidebar />}>
              <SidebarLoader />
            </Suspense>
          }
        >
          <SplashWrapper>{children}</SplashWrapper>
        </DashboardGrid>
      </div>
      <TabBar />
      <Toaster position="bottom-center" style={{ bottom: "120px" }} />
    </div>
  );
}
