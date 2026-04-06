import { HomeTopbar } from "@/components/shared/home-topbar";
import { SuggestedPeople } from "@/components/shared/suggested-people";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HomeTopbar />

      <div id="dashboard-shell" className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 px-4 sm:px-6 py-4 pb-20 lg:px-8 lg:py-6 lg:pb-6 items-start">
        <div id="dashboard-main">
          {children}
        </div>

        <div id="dashboard-right-panel" className="hidden lg:flex flex-col gap-5">
          <SuggestedPeople />
        </div>
      </div>
    </>
  );
}

 