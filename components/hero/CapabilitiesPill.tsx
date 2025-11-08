"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/components/ui/utils";
import { usePrefersReducedMotion } from "@/components/hooks/usePrefersReducedMotion";

type CapabilitiesPillProps = {
  items: string[];
  speed?: number; // px per second on desktop
  pillClassName?: string;
  itemClassName?: string;
};

const DEFAULT_SPEED = 60;

const useIsWideEnough = () => {
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const handleChange = () => setIsWide(mq.matches);
    handleChange();
    mq.addEventListener?.("change", handleChange);
    return () => mq.removeEventListener?.("change", handleChange);
  }, []);

  return isWide;
};

const useAnimationFrame = (
  callback: (delta: number) => void,
  enabled: boolean
) => {
  const frameRef = useRef<number | null>(null);
  const previousRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const animate = (time: number) => {
      if (previousRef.current !== null) {
        callback((time - previousRef.current) / 1000);
      }
      previousRef.current = time;
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      previousRef.current = null;
    };
  }, [callback, enabled]);
};

const CapabilitiesPill: React.FC<CapabilitiesPillProps> = ({
  items,
  speed = DEFAULT_SPEED,
  pillClassName,
  itemClassName,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isWide = useIsWideEnough();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const singleRunRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const positionRef = useRef(0);
  const widthRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  const marqueeEnabled =
    isWide && !prefersReducedMotion && speed > 0 && items.length > 0;

  const baseItems = useMemo(() => items ?? [], [items]);

  const scrollFallback = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!trackRef.current || marqueeEnabled) return;
    if (event.key === "ArrowRight") {
      trackRef.current.scrollBy({ left: 60, behavior: "smooth" });
      event.preventDefault();
    } else if (event.key === "ArrowLeft") {
      trackRef.current.scrollBy({ left: -60, behavior: "smooth" });
      event.preventDefault();
    }
  }, [marqueeEnabled]);

  useEffect(() => {
    if (!singleRunRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      widthRef.current = singleRunRef.current?.offsetWidth ?? 0;
      if (progressRef.current) {
        progressRef.current.style.width = `${(widthRef.current || 0) * 2}px`;
      }
    });
    resizeObserver.observe(singleRunRef.current);
    return () => resizeObserver.disconnect();
  }, [baseItems]);

  const updatePosition = useCallback(
    (delta: number) => {
      if (!marqueeEnabled || !trackRef.current) return;
      const segmentWidth = widthRef.current;
      if (!segmentWidth) return;

      positionRef.current -= speed * delta;
      if (-positionRef.current >= segmentWidth) {
        positionRef.current += segmentWidth;
      }

      const translate = `translateX(${positionRef.current}px)`;
      trackRef.current.style.transform = translate;
      if (progressRef.current) {
        progressRef.current.style.transform = translate;
      }
    },
    [marqueeEnabled, speed]
  );

  useAnimationFrame(updatePosition, marqueeEnabled && !isPaused);

  useEffect(() => {
    positionRef.current = 0;
    if (trackRef.current) {
      trackRef.current.style.transform = "translateX(0px)";
    }
    if (progressRef.current) {
      progressRef.current.style.transform = "translateX(0px)";
    }
  }, [marqueeEnabled, baseItems]);

  const renderItems = (iterationKey: string, ariaHidden = false) => (
    <div
      key={iterationKey}
      className="flex items-center gap-6"
      ref={iterationKey === "primary" ? singleRunRef : undefined}
      aria-hidden={ariaHidden}
    >
      {baseItems.map((item, index) => (
        <span
          key={`${iterationKey}-${item}-${index}`}
          role="listitem"
          className={cn(
            "snap-start shrink-0 whitespace-nowrap text-sm font-medium uppercase tracking-[0.25em] text-slate-900 md:text-base",
            itemClassName
          )}
        >
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "relative rounded-full p-[2px] before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-r before:from-emerald-400 before:to-fuchsia-500",
        pillClassName
      )}
      aria-label="Capabilities carousel"
    >
      <div className="relative rounded-full bg-white/70 px-4 py-3 backdrop-blur">
        <div className="pointer-events-none absolute left-4 right-4 top-1 hidden overflow-hidden md:block">
          <div
            ref={progressRef}
            className="h-1 rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-fuchsia-400 opacity-60"
            aria-hidden="true"
          />
        </div>
        <div
          ref={trackRef}
          role="list"
          tabIndex={marqueeEnabled ? -1 : 0}
          onKeyDown={scrollFallback}
          className={cn(
            "flex items-center gap-6 mask-fade-x",
            marqueeEnabled
              ? "select-none will-change-transform"
              : "no-scrollbar snap-x snap-mandatory overflow-x-auto"
          )}
          onPointerEnter={() => setIsPaused(true)}
          onPointerLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          style={marqueeEnabled ? { transform: "translateX(0px)" } : undefined}
        >
          {renderItems("primary")}
          {marqueeEnabled ? renderItems("duplicate", true) : null}
        </div>
      </div>
    </div>
  );
};

export default CapabilitiesPill;

