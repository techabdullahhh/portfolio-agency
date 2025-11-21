"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative h-10 w-10 rounded-2xl border border-white/10 bg-white/40 text-neutral-600 shadow-inner transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary dark:bg-white/5 dark:text-neutral-300"
    >
      <AnimatePresence initial={false} mode="wait">
        {mounted && theme === "dark" ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, scale: 0.75, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.75, rotate: 45 }}
            transition={{ duration: 0.2 }}
            className="text-primary"
          >
            <Sun className="h-5 w-5" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, scale: 0.75, rotate: 45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.75, rotate: -45 }}
            transition={{ duration: 0.2 }}
            className="text-primary"
          >
            <Moon className="h-5 w-5" />
          </motion.span>
        )}
      </AnimatePresence>
      <span className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/20 opacity-0 blur-lg transition group-hover:opacity-100" />
    </Button>
  );
}

