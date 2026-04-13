"use client";

import { ReactNode, useEffect, useRef } from "react";

interface ContentHeaderProps {
  title: string;
  children?: ReactNode;
}

export function ContentHeader({ title, children }: ContentHeaderProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    let cleanup: (() => void) | undefined;

    const runAnimation = async () => {
      const [{ animate, stagger }, { TextSplitter }] = await Promise.all([
        import("animejs"),
        import("animejs/text"),
      ]);

      if (!titleRef.current) return;

      const splitter = new TextSplitter(titleRef.current);

      if (!splitter.chars.length) return;

      const anim = animate(splitter.chars, {
        opacity: [0, 1],
        translateY: ["0.6em", "0em"],
        duration: 600,
        delay: stagger(60),
        ease: "outExpo",
        loop: 3,
        loopDelay: 3400,
      });

      cleanup = () => {
        anim.pause();
        splitter.revert();
      };
    };

    runAnimation();

    return () => cleanup?.();
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
