"use client";

import { useRouter, usePathname } from "next/navigation";
import { Navigation2 } from "lucide-react";
import { Select } from "@/components/ui/select";

const navItems = [
  { label: "Dashboard", value: "/admin" },
  { label: "Projects", value: "/admin/projects" },
  { label: "Services", value: "/admin/services" },
  { label: "Testimonials", value: "/admin/testimonials" },
  { label: "Blog", value: "/admin/blog" },
  { label: "Team", value: "/admin/team" },
  { label: "Messages", value: "/admin/messages" },
  { label: "Settings", value: "/admin/settings" },
  { label: "Media", value: "/admin/media" },
];

export function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex w-full gap-3 lg:hidden">
      <div className="glass-panel flex shrink-0 items-center justify-center rounded-2xl px-3 py-2 text-xs font-medium uppercase tracking-[0.26em] text-neutral-500">
        <Navigation2 className="mr-2 h-4 w-4 text-primary" /> Menu
      </div>
      <Select
        value={navItems.find((item) => pathname.startsWith(item.value))?.value ?? "/admin"}
        onChange={(event) => router.push(event.target.value)}
        className="flex-1 rounded-2xl border border-white/20 bg-white/70 px-3 py-2 text-sm font-medium text-neutral-600 shadow-inner transition focus-visible:border-primary focus-visible:outline-none dark:bg-neutral-900/60 dark:text-neutral-200"
      >
        {navItems.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

