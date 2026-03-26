"use client";

import { useEffect, useRef, useState } from "react";

interface HeroCounterProps {
  target: number;
}

export function HeroCounter({ target }: HeroCounterProps) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let current = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(current);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [target]);

  return <>{count}</>;
}
