"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/components/ui/utils";

export type Stat = {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
};

type StatsCardsProps = {
  items: Stat[];
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export function StatsCards({ items }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((stat, index) => (
        <motion.div
          key={stat.title}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/60 p-6 shadow-ambient backdrop-blur-xl transition dark:bg-neutral-900/70"
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="card-sheen pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100" />
          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-300">
                {stat.title}
              </p>
              <div className="text-3xl font-semibold text-neutral-800 dark:text-neutral-100">{stat.value}</div>
              {stat.trend ? (
                <p
                  className={cn(
                    "inline-flex items-center gap-2 text-xs font-medium",
                    stat.trend.isPositive ? "text-success" : "text-destructive"
                  )}
                >
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                  {stat.trend.isPositive ? "Tracking up " : "Tracking down "}
                  {stat.trend.value}
                </p>
              ) : (
                stat.description && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-300/80">{stat.description}</p>
                )
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/20 via-secondary/20 to-accent/20 text-primary">
              {stat.icon}
            </div>
          </div>
          <div className="mt-5 h-1 rounded-full bg-gradient-to-r from-primary/70 via-secondary/70 to-accent/70 opacity-60 transition group-hover:opacity-100" />
        </motion.div>
      ))}
    </div>
  );
}

