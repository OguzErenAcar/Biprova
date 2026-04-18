"use client";

import { usePathname } from "next/navigation";

interface DashboardGridProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardGrid({ sidebar, children }: DashboardGridProps) {
  const pathname = usePathname();
  const isProjectDetail = /^\/dashboard\/projects\/[^/]+/.test(pathname);

  if (isProjectDetail) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4   ">
        <div className="hidden lg:block sidebar_container min-h-screen">{sidebar}</div>
        <div className="">{children}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4      ">
      <div className="hidden lg:block sidebar_container min-h-screen">{sidebar}</div>
      <div className=" ">{children}</div>
    </div>
  );
}
