import { PullToRefresh } from "@/components/shared/pull-to-refresh";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PullToRefresh />
      <div id="dashboard-shell" className="mt-[50px]">
        <div id="dashboard-main">
          {children}
        </div>
      </div>
    </>
  );
}

 