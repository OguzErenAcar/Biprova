"use client";

import { animate, stagger } from "animejs";
import { TextSplitter } from "animejs/text";
import { ReactNode, useEffect, useRef, useState } from "react";

interface ContentHeaderProps {
  title: string;
  children?: ReactNode;
}

export function ContentHeader({ title, children }: ContentHeaderProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

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
    <>
      <div ref={sentinelRef} className="h-px" />
      <div className="relative sticky mb-2 top-0 z-40 backdrop-blur-[42px] md:me-8 flex items-center gap-4">
        <div className={`flex w-full justify-between mb-2 pb-2 px-0 ${isStuck ? "items-center" : "items-start"}`}>
          <h1 ref={titleRef} className="dashheader">{title}</h1>
          {children && (
            <div className="flex items-center">{children}</div>
          )}
        </div>
      </div>
    </>
  );
}
