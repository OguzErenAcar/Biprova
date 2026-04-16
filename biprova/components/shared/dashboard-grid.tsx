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
      <div className="h-full grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 py-4 md:ms-8">
        <div className="hidden lg:block">{sidebar}</div>
        <div className="">{children}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4  py-4 md:ms-8  ">
      <div className="hidden lg:block">{sidebar}</div>
      <div className=" ">{children}</div>
    </div>
  );
}
