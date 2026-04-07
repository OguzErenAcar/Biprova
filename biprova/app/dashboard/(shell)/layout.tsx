 import { SuggestedPeople } from "@/components/shared/suggested-people";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <>

      <div id="dashboard-shell" className="dashboard-shell">
        <div id="dashboard-main">
          {children}
        </div>

        <div id="dashboard-right-panel" className="hidden lg:flex flex-col gap-5 sticky top-4 self-start mx-3 mt-5">
          <SuggestedPeople />
        </div>
      </div>
    </>
  );
}

 