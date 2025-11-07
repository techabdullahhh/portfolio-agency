"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/components/ui/utils";
import {
  LayoutDashboard,
  FolderKanban,
  BriefcaseBusiness,
  MessageCircle,
  FileText,
  Users,
  Inbox,
  Settings,
  Image as ImageIcon,
  ChevronFirst,
  ChevronLast,
  Sparkles,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Services", href: "/admin/services", icon: BriefcaseBusiness },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageCircle },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Team", href: "/admin/team", icon: Users },
  { name: "Messages", href: "/admin/messages", icon: Inbox },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Media", href: "/admin/media", icon: ImageIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeItem = useMemo(() => navItems.find((item) => pathname.startsWith(item.href)), [pathname]);

  return (
    <motion.aside
      className="relative hidden h-screen border-r border-white/10 bg-neutral-100/50 shadow-glass backdrop-blur-glass transition-colors duration-500 dark:bg-neutral-900/30 lg:flex"
      animate={{ width: isCollapsed ? 88 : 288 }}
      initial={false}
      transition={{ type: "spring", stiffness: 320, damping: 38 }}
    >
      <div className="absolute inset-0 -z-10 bg-glass-gradient opacity-70" />
      <div className="absolute left-6 top-32 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative flex h-full w-full flex-col">
        <div className="flex items-center justify-between gap-2 border-b border-white/5 px-5 py-6">
          <motion.div
            layout
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium uppercase tracking-[0.28em] text-foreground/70",
              isCollapsed && "justify-center px-0"
            )}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/80 to-secondary/80 text-primary-foreground shadow-ambient ring-1 ring-white/10">
              <Sparkles className="h-4 w-4" />
            </span>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  key="brand"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="font-semibold tracking-wide"
                >
                  Agency Admin
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="group rounded-2xl border border-white/10 bg-white/5 p-2 text-neutral-500 shadow-inner transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary dark:text-neutral-400"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronLast className="h-4 w-4" /> : <ChevronFirst className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || activeItem?.href === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                title={item.name}
                className="group relative"
              >
                <motion.div
                  layout
                  className={cn(
                    "glass-panel relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition duration-500 ease-ultra-smooth hover:-translate-y-0.5 hover:shadow-ambient",
                    isCollapsed ? "justify-center px-2" : "justify-start",
                    isActive
                      ? "bg-gradient-to-r from-primary/80 via-secondary/70 to-accent/70 text-primary-foreground shadow-glow"
                      : "bg-white/10 text-neutral-500 hover:text-foreground dark:bg-white/5 dark:text-neutral-400"
                  )}
                  whileHover={{ scale: isCollapsed ? 1 : 1.015 }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                >
                  <Icon className={cn("h-5 w-5 transition duration-500", isActive ? "text-primary-foreground" : "")} />
                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.span
                        key={item.name}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && !isCollapsed && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 -z-10 rounded-2xl border border-white/20 shadow-inner"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="relative mt-auto px-4 pb-6">
          <motion.div
            layout
            className={cn(
              "glass-panel overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 dark:bg-white/5",
              isCollapsed && "px-3 py-4"
            )}
          >
            <div className="absolute inset-x-0 -top-12 h-24 bg-gradient-to-b from-primary/30 to-transparent blur-3xl" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-glow">
                <Sparkles className="h-5 w-5" />
              </div>
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-1"
                  >
                    <p className="text-sm font-semibold text-foreground/90">Inspired by Tomorrow</p>
                    <p className="text-xs text-foreground/60">
                      &copy; {new Date().getFullYear()} Portfolio Agency. Crafted with intention.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.aside>
  );
}

