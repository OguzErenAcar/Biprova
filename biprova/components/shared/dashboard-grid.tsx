"use client";

import { usePathname } from "next/navigation";

export function DashboardGrid({ sidebar, children, suggestedPeople }: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  suggestedPeople: React.ReactNode;
}) {
  const pathname = usePathname();
  const isProjectDetail = /^\/dashboard\/projects\/[^/]+/.test(pathname);

  if (isProjectDetail) {
    return (
      <div className="grid h-full grid-cols-[1fr_4fr] gap-4 m-[40]">
        <div>{sidebar}</div>
        <div className="mx-4">{children}</div>
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-[1fr_3fr_1fr] gap-4 m-[40]">
      <div>{sidebar}</div>
      <div className="mx-4">{children}</div>
      {suggestedPeople}
    </div>
  );
}
