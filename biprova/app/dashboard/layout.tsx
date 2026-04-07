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
    <div className="">
      <HomeTopbar />
      <div className="h-screen m-0">
        <div className="grid h-full grid-cols-[1fr_3fr_1fr] gap-4 m-5">
          <div className="">
            <Suspense fallback={<Sidebar />}>
              <SidebarLoader />
            </Suspense>
          </div> 
          <div className="">B{/* {children} */}</div>
          <div className=""> 
            <SuggestedPeople />
          </div>
        </div>
      </div>
    </div>
  );
}
