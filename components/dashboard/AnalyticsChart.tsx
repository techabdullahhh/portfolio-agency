"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

type AnalyticsPoint = {
  month: string;
  projects: number;
  posts: number;
  leads: number;
};

type AnalyticsChartProps = {
  data: AnalyticsPoint[];
};

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <motion.div
      className="glass-panel relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/60 p-6 shadow-glass backdrop-blur-xl dark:bg-neutral-900/70"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Content Velocity</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-300/80">Projects, stories, and leads over the last 6 months</p>
        </div>
        <span className="rounded-full border border-white/20 bg-white/60 px-3 py-1 text-xs font-medium text-neutral-500 shadow-inner dark:bg-neutral-900/60">
          Live sync
        </span>
      </div>
      <div className="absolute inset-x-0 top-1/3 h-64 bg-gradient-to-b from-primary/20 via-secondary/10 to-transparent blur-[120px]" />
      <div className="relative h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="projects" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.7} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="posts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.7} />
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="leads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.7} />
                <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 8" stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(148, 163, 184, 0.8)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tick={{ fill: "rgba(148, 163, 184, 0.8)", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.85)",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#e2e8f0",
                backdropFilter: "blur(12px)",
              }}
            />
            <Area type="monotone" dataKey="projects" stroke="hsl(var(--primary))" fill="url(#projects)" strokeWidth={2.4} />
            <Area type="monotone" dataKey="posts" stroke="hsl(var(--accent))" fill="url(#posts)" strokeWidth={2.4} />
            <Area type="monotone" dataKey="leads" stroke="hsl(var(--secondary))" fill="url(#leads)" strokeWidth={2.4} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

