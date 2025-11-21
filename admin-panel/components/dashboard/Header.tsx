"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { motion } from "framer-motion";
import { CalendarDays, TrendingUp } from "lucide-react";
import { useMemo } from "react";

export function Header() {
  const { data } = useSession();
  const today = useMemo(() => new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date()), []);

  return (
    <header className="relative z-10 flex flex-col gap-4 border-b border-white/5 bg-transparent px-4 py-6 lg:px-10">
      <div className="absolute left-8 top-14 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute right-12 top-0 h-32 w-32 rounded-full bg-secondary/20 blur-3xl" />
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/70 p-6 shadow-glass backdrop-blur-xl transition-colors dark:bg-neutral-900/70 lg:flex-row lg:items-center lg:justify-between lg:p-8">
        <div className="flex flex-1 flex-col gap-3">
          <motion.span
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.32em] text-neutral-500 shadow-inner dark:bg-white/5 dark:text-neutral-300"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Performance Pulse
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2"
          >
            <h1 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 md:text-3xl">
              Welcome back, <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">{data?.user?.name ?? "Admin"}</span> 👋
            </h1>
            <p className="max-w-xl text-sm text-neutral-500 dark:text-neutral-300">
              Your studio is humming. Review today&apos;s momentum, ship content across the portfolio, and keep every touchpoint aligned with the brand.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-300"
          >
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/50 px-3 py-1 shadow-inner dark:bg-white/10">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              {today}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/50 px-3 py-1 shadow-inner dark:bg-white/10">
              {activeGreeting()}
            </span>
          </motion.div>
        </div>

        <div className="flex flex-col items-stretch gap-3 lg:w-auto lg:flex-row lg:items-center">
          <MobileNav />
          <div className="flex items-center justify-end gap-3">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              className="rounded-2xl border-primary/30 bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/10 px-5 font-medium text-primary shadow-inner hover:-translate-y-0.5 hover:shadow-ambient"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function activeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Rise & Build";
  if (hour < 18) return "Onward through the day";
  return "Night shift brilliance";
}

