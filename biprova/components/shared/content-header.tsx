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

    let splitter: InstanceType<typeof TextSplitter> | null = null;
    let anim: ReturnType<typeof animate> | null = null;

    try {
      splitter = new TextSplitter(el, { chars: true });

      if (!splitter.chars.length) return;

      anim = animate(splitter.chars, {
        opacity: [0, 1],
        duration: 800,
        delay: stagger(60),
        ease: "outExpo",
        loop: 3,
        loopDelay: 3500,
        onComplete: () => {
          splitter?.chars.forEach((c) => {
            (c as HTMLElement).style.opacity = "1";
          });
        },
      });
    } catch {
      splitter?.revert();
    }

    return () => {
      anim?.cancel();
      splitter?.revert();
    };
  }, [title]);

  return (
    <div className="relative sticky mb-2 top-0 z-40 backdrop-blur-[42px] px-3 flex items-center gap-4">
      <div className="flex items-between w-full justify-between my-2 pb-2  px-0">
        <h1 ref={titleRef} className="dashheader  ">{title}</h1>
        {children && (
          <div className="flex items-center">{children}</div>
        )}
      </div>
    </div>
  );
}
