"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { cn } from "@/components/ui/utils";
import { usePrefersReducedMotion } from "@/components/hooks/usePrefersReducedMotion";

type CapsuleWaveProps = {
  className?: string;
  height?: number;
  waves?: number;
  amplitude?: number;
  speed?: number; // cycles per 10s
  gradientFrom?: string;
  gradientTo?: string;
};

const DEFAULT_HEIGHT = 72;
const DEFAULT_WAVES = 2;
const DEFAULT_AMPLITUDE = 10;
const DEFAULT_SPEED = 1.2;

type Point = { x: number; y: number };

const useResizeObserver = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        sizeRef.current = { width, height };
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, sizeRef };
};

const pointsToPath = (points: Point[]) => {
  if (points.length < 2) return "";
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    const control1X = p1.x + (p2.x - p0.x) / 6;
    const control1Y = p1.y + (p2.y - p0.y) / 6;
    const control2X = p2.x - (p3.x - p1.x) / 6;
    const control2Y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${control1X.toFixed(2)} ${control1Y.toFixed(2)}, ${control2X.toFixed(
      2
    )} ${control2Y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return d;
};

const CapsuleWave: React.FC<CapsuleWaveProps> = ({
  className,
  height = DEFAULT_HEIGHT,
  waves = DEFAULT_WAVES,
  amplitude = DEFAULT_AMPLITUDE,
  speed = DEFAULT_SPEED,
  gradientFrom = "#7EE8FA",
  gradientTo = "#6F7CFB",
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { ref: containerRef, sizeRef } = useResizeObserver<HTMLDivElement>();
  const pathRefs = useRef<SVGPathElement[]>([]);
  const glowRefs = useRef<SVGPathElement[]>([]);
  const phasesRef = useRef<number[]>([]);
  const animationFrame = useRef<number | null>(null);

  const waveCount = Math.max(1, Math.min(4, waves));

  const gradientId = useMemo(
    () => `capsule-wave-gradient-${Math.random().toString(36).slice(2)}`,
    []
  );

  const glowId = useMemo(
    () => `capsule-wave-glow-${Math.random().toString(36).slice(2)}`,
    []
  );

  const ensurePhases = () => {
    if (phasesRef.current.length !== waveCount) {
      phasesRef.current = Array.from({ length: waveCount }, (_, i) => i * Math.PI * 0.6);
    }
  };

  const updatePaths = useCallback(
    (phaseIncrement = 0) => {
      ensurePhases();
      const { width } = sizeRef.current;
      const viewWidth = width || 600;
      const viewHeight = height;
      const centerY = viewHeight / 2;
      const amplitudeClamped = Math.min(amplitude, viewHeight / 2 - 4);
      const sampleCount = 8;

      phasesRef.current = phasesRef.current.map((phase) => phase + phaseIncrement);

      phasesRef.current.forEach((phase, index) => {
        const points: Point[] = [];
        for (let i = 0; i <= sampleCount; i++) {
          const ratio = i / sampleCount;
          const x = ratio * viewWidth;
          const theta = ratio * Math.PI * 2 + phase + index * 0.8;
          const y = centerY + Math.sin(theta) * amplitudeClamped;
          points.push({ x, y });
        }
        const path = pointsToPath(points);
        const targetPath = pathRefs.current[index];
        const glowPath = glowRefs.current[index];
        if (targetPath) targetPath.setAttribute("d", path);
        if (glowPath) glowPath.setAttribute("d", path);
      });
    },
    [height, amplitude, waveCount, sizeRef]
  );

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const updateSize = (width: number) => {
      sizeRef.current = { width, height };
      updatePaths(0);
    };

    updateSize(element.clientWidth || 600);
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        updateSize(width);
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [containerRef, sizeRef, height, updatePaths]);

  useEffect(() => {
    if (prefersReducedMotion) {
      updatePaths(0);
      return;
    }

    const cyclesPerSecond = speed / 10; // per instructions
    const angularVelocity = cyclesPerSecond * Math.PI * 2;

    let previous = performance.now();
    const animate = (time: number) => {
      const delta = (time - previous) / 1000;
      previous = time;
      updatePaths(angularVelocity * delta);
      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [prefersReducedMotion, speed, height, amplitude, waveCount, updatePaths]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative rounded-full p-[2px] before:absolute before:inset-0 before:-z-20 before:rounded-full before:bg-gradient-to-r before:from-emerald-300 before:via-sky-200 before:to-fuchsia-300",
        className
      )}
      style={{ height }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-emerald-200/70 via-sky-200/70 to-fuchsia-200/70 opacity-80" />
      <div className="relative h-full w-full overflow-hidden rounded-full bg-white/70 shadow-inner backdrop-blur">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${Math.max(sizeRef.current.width || 600, 1)} ${height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={gradientFrom} stopOpacity="0.85" />
              <stop offset="100%" stopColor={gradientTo} stopOpacity="0.6" />
            </linearGradient>
            <filter id={glowId} x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
            </filter>
          </defs>
          {Array.from({ length: waveCount }).map((_, index) => (
            <g key={index}>
              <path
                ref={(el) => {
                  glowRefs.current[index] = el as SVGPathElement;
                }}
                fill="none"
                stroke={gradientFrom}
                strokeWidth={2.5}
                opacity={0.15}
                filter={`url(#${glowId})`}
              />
              <path
                ref={(el) => {
                  pathRefs.current[index] = el as SVGPathElement;
                }}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.9 - index * 0.2}
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default CapsuleWave;

