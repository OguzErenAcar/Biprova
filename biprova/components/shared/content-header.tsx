"use client";

import { ReactNode } from "react";

interface ContentHeaderProps {
  title: string;
  children?: ReactNode;
}

export function ContentHeader({ title, children }: ContentHeaderProps) {
  return (
    <div className="relative sticky top-0 z-40 backdrop-blur-[12px] flex items-center gap-4">
      <div className="flex items-between w-full justify-between  my-2 md:mx-0 mx-2">
        <h1 className="dashheader text-ink"></h1>
        {children && (
          <div className="   flex items-center  ">{children}</div>
        )}
      </div> 
    </div>
  );
}
