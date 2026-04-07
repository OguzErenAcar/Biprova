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
    <div className="min-h-screen bg-slate-100">
      <HomeTopbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-[1fr_3fr_1fr] gap-4 items-start">
          <Suspense fallback={<Sidebar />}>
            <SidebarLoader />
          </Suspense>
          <main className="min-w-0">{children}</main>
          <aside className="sticky top-4">
            <SuggestedPeople />
          </aside>
        </div>
      </div>
    </div>
  );
}
