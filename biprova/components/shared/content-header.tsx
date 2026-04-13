"use client";

import { animate, stagger } from "animejs";
import { TextSplitter } from "animejs/text";
import { ReactNode, useEffect, useRef } from "react";

interface ContentHeaderProps {
  title: string;
  children?: ReactNode;
}

export function ContentHeader({ title, children }: ContentHeaderProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const splitter = new TextSplitter(el, {
      chars: { wrap: "clip" },
    });

    if (!splitter.chars.length) return;

    const anim = animate(splitter.chars, {
      opacity: [0, 1],
      y: ["100%", "0%"],
      duration: 600,
      delay: stagger(50),
      ease: "outExpo",
      loop: 3,
      loopDelay: 3400,
    });

    return () => {
      anim.cancel();
      splitter.revert();
    };
  }, [title]);

  return (
    <div className="relative sticky top-0 z-40 backdrop-blur-[12px] flex items-center gap-4">
      <div className="flex items-between w-full justify-between my-2 md:mx-0 mx-2">
        <h1 ref={titleRef} className="dashheader text-ink">{title}</h1>
        {children && (
          <div className="flex items-center">{children}</div>
        )}
      </div>
    </div>
  );
}
