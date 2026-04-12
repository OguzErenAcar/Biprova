"use client";

import { ReactNode } from "react";

interface ContentHeaderProps {
  title: string;
  children?: ReactNode;
}

export function ContentHeader({ title, children }: ContentHeaderProps) {
  return (
    <div className="sticky top-0 z-40 backdrop-blur-[12px] flex items-center gap-4">
      <div className="flex items-between w-full justify-between border-b border-slate-200  mb-4 md:mx-0 mx-2">
        <h1 className="dashheader text-ink">{title}</h1>
        {children && (
          <div className="ml-auto flex items-center gap-2.5">{children}</div>
        )}
      </div>
    </div>
  );
}
