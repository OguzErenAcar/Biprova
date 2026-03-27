import { Sidebar } from "@/components/shared/sidebar";
import { TabBar } from "@/components/shared/tab-bar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar messageCount={3} />
      <div className="lg:ml-60 flex-1 flex flex-col min-h-screen">
        {children}
      </div>
      <TabBar />
    </div>
  );
}
