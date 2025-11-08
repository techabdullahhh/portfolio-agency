import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type DataFlowBackdropProps = {
  className?: string;
  density?: number;
  packetRate?: number;
  speed?: number;
  tiltStrength?: number;
  gradientFrom?: string;
  gradientTo?: string;
  lineColorFrom?: string;
  lineColorTo?: string;
  blur?: number;
  zIndex?: string | number;
};

type LineDefinition = {
  id: string;
  d: string;
  depth: number;
};

type PacketState = {
  progress: number;
  speedFactor: number;
};

const DEFAULTS = {
  density: 16,
  packetRate: 8,
  speed: 60,
  tiltStrength: 0.25,
  gradientFrom: "#CFE9FF",
  gradientTo: "#ECE9FF",
  lineColorFrom: "#6F7CFB",
  lineColorTo: "#7EE8FA",
  blur: 8,
} satisfies Required<Omit<DataFlowBackdropProps, "className" | "zIndex">>;

const SEED_BASE = 43758.5453123;

const seededRandom = (seed: number) => {
  return (Math.sin(seed * SEED_BASE) * 10000) % 1;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const useElementSize = (ref: React.RefObject<HTMLElement>) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { inlineSize, blockSize } = entry.contentBoxSize[0] ?? {};
        if (inlineSize && blockSize) {
          setSize({ width: inlineSize, height: blockSize });
        } else {
          const { width, height } = entry.contentRect;
          setSize({ width, height });
        }
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
};

const buildLines = (
  density: number,
  width: number,
  height: number
): LineDefinition[] => {
  if (!width || !height || !density) return [];
  const paddingX = width * 0.1;
  return Array.from({ length: density }, (_, index) => {
    const seed = index + 1;
    const laneRatio = (index + 0.5) / density;
    const y = laneRatio * height;
    const dirFlip = seededRandom(seed) > 0.5 ? 1 : -1;
    const curvature = (height * 0.12 + index * 0.3) * (seededRandom(seed * 2) - 0.5);
    const controlYOffset = curvature * dirFlip;
    const controlYOffset2 =
      curvature * 0.6 * dirFlip * (seededRandom(seed * 3) - 0.5);
    const startX = -paddingX;
    const endX = width + paddingX;
    const c1x = width * 0.25 * (0.8 + seededRandom(seed * 4) * 0.4);
    const c2x = width * 0.65 * (0.8 + seededRandom(seed * 5) * 0.4);
    const depth = 0.4 + seededRandom(seed * 6) * 0.6;
    const path = [
      `M ${startX.toFixed(2)},${y.toFixed(2)}`,
      `C ${c1x.toFixed(2)},${(y + controlYOffset).toFixed(2)}`,
      `${c2x.toFixed(2)},${(y + controlYOffset2).toFixed(2)}`,
      `${endX.toFixed(2)},${(y + controlYOffset * 0.4).toFixed(2)}`,
    ].join(" ");
    return {
      id: `line-${index}`,
      d: path,
      depth,
    };
  });
};

const createPacketState = (
  count: number,
  seed: number
): PacketState[] => {
  return Array.from({ length: count }, (_, packetIndex) => {
    const packetSeed = seed * 100 + packetIndex * 31;
    return {
      progress: seededRandom(packetSeed),
      speedFactor: 0.6 + seededRandom(packetSeed + 1) * 0.8,
    };
  });
};

const useAnimationFrame = (
  callback: (time: number) => void,
  enabled: boolean
) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  useEffect(() => {
    if (!enabled) return;

    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const delta = (time - previousTimeRef.current) / 1000;
        callback(delta);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = undefined;
    };
  }, [callback, enabled]);
};

const setPacketPosition = (
  circle: SVGCircleElement,
  path: SVGPathElement,
  progress: number,
  length: number
) => {
  const point = path.getPointAtLength(progress * length);
  circle.setAttribute("cx", point.x.toFixed(2));
  circle.setAttribute("cy", point.y.toFixed(2));
};

const DataFlowBackdrop: React.FC<DataFlowBackdropProps> = ({
  className,
  density = DEFAULTS.density,
  packetRate = DEFAULTS.packetRate,
  speed = DEFAULTS.speed,
  tiltStrength = DEFAULTS.tiltStrength,
  gradientFrom = DEFAULTS.gradientFrom,
  gradientTo = DEFAULTS.gradientTo,
  lineColorFrom = DEFAULTS.lineColorFrom,
  lineColorTo = DEFAULTS.lineColorTo,
  blur = DEFAULTS.blur,
  zIndex,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRefs = useRef<(SVGPathElement | null)[]>([]);
  const packetRefs = useRef<(SVGCircleElement | null)[][]>([]);
  const packetsState = useRef<PacketState[][]>([]);
  const lengthCache = useRef<number[]>([]);
  const tiltRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });
  const prefersReducedMotion = useReducedMotion();
  const size = useElementSize(containerRef);

  const lineDefinitions = useMemo(
    () => buildLines(density, size.width, size.height),
    [density, size.height, size.width]
  );

  const packetCountPerLine = useMemo(() => {
    const packetsPerMinute = Math.max(packetRate, 1);
    const base = Math.round((packetsPerMinute / 60) * 12);
    return clamp(base, 1, 12);
  }, [packetRate]);

  useEffect(() => {
    packetsState.current = lineDefinitions.map((line, index) =>
      createPacketState(packetCountPerLine, index + 1)
    );
    packetRefs.current = lineDefinitions.map(() => []);
    lengthCache.current = lineDefinitions.map(() => 0);
  }, [lineDefinitions, packetCountPerLine]);

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current || tiltStrength <= 0) {
      return;
    }

    const element = containerRef.current;
    let raf: number | null = null;

    const updateTilt = () => {
      const { x, y, targetX, targetY } = tiltRef.current;
      const nextX = x + (targetX - x) * 0.08;
      const nextY = y + (targetY - y) * 0.08;
      tiltRef.current.x = nextX;
      tiltRef.current.y = nextY;
      element.style.transform = `perspective(1200px) rotateX(${nextY}deg) rotateY(${nextX}deg)`;
      raf = requestAnimationFrame(updateTilt);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
      tiltRef.current.targetX = clamp(relativeX * tiltStrength * 6, -4, 4);
      tiltRef.current.targetY = clamp(-relativeY * tiltStrength * 6, -4, 4);
      if (raf === null) {
        raf = requestAnimationFrame(updateTilt);
      }
    };

    const resetTilt = () => {
      tiltRef.current.targetX = 0;
      tiltRef.current.targetY = 0;
    };

    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerleave", resetTilt);
    return () => {
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerleave", resetTilt);
      if (raf) cancelAnimationFrame(raf);
      element.style.transform = "";
    };
  }, [tiltStrength, prefersReducedMotion]);

  const animationCallback = useCallback(
    (delta: number) => {
      if (!svgRef.current) return;

      lineDefinitions.forEach((line, lineIndex) => {
        const pathElement = lineRefs.current[lineIndex];
        if (!pathElement) return;

        const cachedLength = lengthCache.current[lineIndex];
        const length =
          cachedLength > 0 ? cachedLength : pathElement.getTotalLength();
        if (cachedLength === 0) {
          lengthCache.current[lineIndex] = length;
        }
        if (!length) return;
        const baseSpeed = speed * (0.7 + (line.depth - 0.4)); // incorporate depth
        const linePackets = packetsState.current[lineIndex];
        const circles = packetRefs.current[lineIndex] ?? [];

        linePackets?.forEach((packet, packetIndex) => {
          packet.progress += (baseSpeed * packet.speedFactor * delta) / length;
          if (packet.progress > 1) {
            packet.progress -= 1;
          }
          const circle = circles[packetIndex];
          if (!circle) return;
          setPacketPosition(circle, pathElement, packet.progress, length);
        });
      });
    },
    [speed, lineDefinitions]
  );

  useAnimationFrame(animationCallback, !prefersReducedMotion);

  useEffect(() => {
    // initialize packet positions immediately for both motion modes
    lineDefinitions.forEach((_, lineIndex) => {
      const pathElement = lineRefs.current[lineIndex];
      const circles = packetRefs.current[lineIndex] ?? [];
      if (!pathElement) return;
      const cachedLength = lengthCache.current[lineIndex];
      const length =
        cachedLength > 0 ? cachedLength : pathElement.getTotalLength();
      if (cachedLength === 0) {
        lengthCache.current[lineIndex] = length;
      }
      if (!length) return;
      const linePackets = packetsState.current[lineIndex];
      linePackets?.forEach((packet, packetIndex) => {
        const circle = circles[packetIndex];
        if (!circle) return;
        setPacketPosition(circle, pathElement, packet.progress, length);
      });
    });
  }, [lineDefinitions, prefersReducedMotion]);

  const gradientIdRef = useRef(
    `dfb-gradient-${Math.random().toString(36).slice(2)}`
  );
  const gradientId = gradientIdRef.current;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ zIndex }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 120% at 50% 20%, ${gradientFrom}, transparent 75%), linear-gradient(160deg, ${gradientFrom}, ${gradientTo})`,
          filter: `blur(${blur}px)`,
        }}
      />
      <motion.svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full"
        role="img"
        viewBox={`0 0 ${Math.max(size.width, 1)} ${Math.max(size.height, 1)}`}
        preserveAspectRatio="none"
        initial={false}
      >
        <title>Flowing data visualization backdrop</title>
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="50%"
            x2="100%"
            y2="50%"
          >
            <stop offset="0%" stopColor={lineColorFrom} stopOpacity={0.35} />
            <stop offset="50%" stopColor={lineColorTo} stopOpacity={0.55} />
            <stop offset="100%" stopColor={lineColorFrom} stopOpacity={0.35} />
          </linearGradient>
          <filter id="packet-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g opacity={prefersReducedMotion ? 0.5 : 0.8}>
          {lineDefinitions.map((line, index) => (
            <g key={line.id} style={{ opacity: 0.7 + line.depth * 0.25 }}>
              <path
                ref={(el) => {
                  lineRefs.current[index] = el;
                }}
                d={line.d}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth={1}
                strokeLinecap="round"
                style={{
                  opacity: 0.4 + line.depth * 0.35,
                }}
              />
              <g
                ref={(group) => {
                  if (!group) return;
                  const circles = Array.from(
                    group.querySelectorAll("circle")
                  );
                  packetRefs.current[index] = circles;
                }}
              >
                {packetsState.current[index]?.map((packet, packetIndex) => (
                  <circle
                    key={`packet-${line.id}-${packetIndex}`}
                    r={1.3}
                    fill={lineColorTo}
                    opacity={prefersReducedMotion ? 0.18 : 0.3}
                    filter="url(#packet-glow)"
                  />
                ))}
              </g>
            </g>
          ))}
        </g>
      </motion.svg>
    </div>
  );
};

export default DataFlowBackdrop;

export function Hero() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      <DataFlowBackdrop className="absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-800 md:text-6xl">
          Realtime Systems. Clear Results.
        </h1>
        <p className="mt-4 text-slate-600">
          Edge compute, autonomous agents, and streaming analytics.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button className="rounded-full bg-blue-500 px-6 py-3 text-white">
            Start Your Project
          </button>
          <button className="rounded-full bg-white/80 px-6 py-3 backdrop-blur ring-1 ring-slate-200">
            See Our Work
          </button>
        </div>
      </div>
    </section>
  );
}

