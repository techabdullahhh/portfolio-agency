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
  baseSpeed?: number; // target px/sec at ~360px width
  minSpeed?: number;
  maxSpeed?: number;
  className?: string;
  itemClassName?: string;
};

const DEFAULT_BASE = 48;
const DEFAULT_MIN = 28;
const DEFAULT_MAX = 72;

const useMedia = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const listener = () => setMatches(mq.matches);
    listener();
    mq.addEventListener?.("change", listener);
    return () => mq.removeEventListener?.("change", listener);
  }, [query]);

  return matches;
};

const useAnimationFrame = (
  callback: (delta: number) => void,
  enabled: boolean
) => {
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const animate = (time: number) => {
      if (previousTimeRef.current !== null) {
        callback((time - previousTimeRef.current) / 1000);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = null;
    };
  }, [callback, enabled]);
};

const CapabilitiesPill: React.FC<CapabilitiesPillProps> = ({
  items,
  baseSpeed = DEFAULT_BASE,
  minSpeed = DEFAULT_MIN,
  maxSpeed = DEFAULT_MAX,
  className,
  itemClassName,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDesktop = useMedia("(min-width: 768px)");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  const marqueeEnabled =
    isDesktop && !prefersReducedMotion && items.length > 1 && contentWidth > 0;

  const baseItems = useMemo(() => items ?? [], [items]);

  const effectiveSpeed = useMemo(() => {
    if (!marqueeEnabled || containerWidth <= 0) return 0;
    const scaled = baseSpeed * (containerWidth / 360);
    return Math.min(Math.max(scaled, minSpeed), maxSpeed);
  }, [baseSpeed, minSpeed, maxSpeed, containerWidth, marqueeEnabled]);

  // Resize observer for container and content widths
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const update = () => {
      setContainerWidth(container.offsetWidth);
      setContentWidth(content.scrollWidth);
      if (progressRef.current) {
        progressRef.current.style.width = `${content.scrollWidth * 2}px`;
      }
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(content);

    return () => observer.disconnect();
  }, [baseItems]);

  const positionRef = useRef(0);

  const step = useCallback(
    (delta: number) => {
      if (!marqueeEnabled || !trackRef.current) return;
      const width = contentWidth || 1;
      positionRef.current -= effectiveSpeed * delta;
      if (-positionRef.current >= width) {
        positionRef.current += width;
      }
      const translate = `translate3d(${positionRef.current}px,0,0)`;
      trackRef.current.style.transform = translate;
      if (progressRef.current) {
        progressRef.current.style.transform = translate;
      }
    },
    [marqueeEnabled, contentWidth, effectiveSpeed]
  );

  useAnimationFrame(step, marqueeEnabled && !isPaused);

  useEffect(() => {
    positionRef.current = 0;
    if (trackRef.current) {
      trackRef.current.style.transform = "translate3d(0,0,0)";
    }
    if (progressRef.current) {
      progressRef.current.style.transform = "translate3d(0,0,0)";
    }
  }, [marqueeEnabled, baseItems]);

  const handleKeyScroll = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!containerRef.current || marqueeEnabled) return;
      if (event.key === "ArrowRight") {
        containerRef.current.scrollBy({ left: 60, behavior: "smooth" });
        event.preventDefault();
      } else if (event.key === "ArrowLeft") {
        containerRef.current.scrollBy({ left: -60, behavior: "smooth" });
        event.preventDefault();
      }
    },
    [marqueeEnabled]
  );

  return (
    <div
      className={cn(
        "relative mx-auto block max-w-full rounded-full p-[2px] before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-r before:from-emerald-400 before:to-fuchsia-500 before:content-['']",
        className
      )}
      aria-label="Capabilities carousel"
    >
      <div className="relative rounded-full bg-white/70 px-6 py-3 backdrop-blur">
        <div className="pointer-events-none absolute left-6 right-6 top-1 hidden overflow-hidden md:block">
          <div
            ref={progressRef}
            className="h-1 rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-fuchsia-400 opacity-60"
            aria-hidden="true"
          />
        </div>
        <div
          ref={containerRef}
          role="list"
          tabIndex={marqueeEnabled ? -1 : 0}
          onKeyDown={handleKeyScroll}
          className={cn(
            "mask-fade-x flex items-center gap-6",
            marqueeEnabled
              ? "overflow-hidden select-none"
              : "no-scrollbar snap-x snap-mandatory overflow-x-auto"
          )}
          onPointerEnter={() => setIsPaused(true)}
          onPointerLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <div
            ref={trackRef}
            className={cn(
              "flex items-center gap-6",
              marqueeEnabled ? "will-change-transform" : ""
            )}
          >
            <div ref={contentRef} className="flex items-center gap-6 pr-6">
              {baseItems.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  role="listitem"
                  className={cn(
                    "snap-start shrink-0 whitespace-nowrap text-sm font-medium uppercase tracking-[0.22em] text-slate-900 md:text-base",
                    itemClassName
                  )}
                >
                  {item}
                </span>
              ))}
            </div>
            {marqueeEnabled ? (
              <div
                className="flex items-center gap-6 pr-6"
                aria-hidden="true"
              >
                {baseItems.map((item, index) => (
                  <span
                    key={`dup-${item}-${index}`}
                    className={cn(
                      "shrink-0 whitespace-nowrap text-sm font-medium uppercase tracking-[0.22em] text-slate-900 md:text-base",
                      itemClassName
                    )}
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapabilitiesPill;

