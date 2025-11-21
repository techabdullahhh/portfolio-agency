import { motion } from "framer-motion";

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
};

type RecentActivityProps = {
  items: ActivityItem[];
};

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className="glass-panel h-full rounded-3xl border border-white/10 bg-white/60 p-6 shadow-glass backdrop-blur-xl dark:bg-neutral-900/70">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Recent Activity</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-300/80">Latest signals across the studio</p>
        </div>
        <span className="h-2 w-2 animate-pulse rounded-full bg-success shadow-glow" />
      </div>
      <div className="relative space-y-5">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-secondary/30 to-transparent" />
        {items.length === 0 && <p className="text-sm text-muted-foreground">No activity logged yet.</p>}
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className="relative ml-10 rounded-2xl border border-white/10 bg-white/50 p-4 shadow-inner transition duration-300 hover:border-primary/40 hover:bg-white/70 dark:bg-neutral-900/60"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <span className="absolute -left-12 top-5 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 text-primary shadow-glow">
              <span className="h-2 w-2 rounded-full bg-primary" />
            </span>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-100">{item.title}</p>
              <span className="text-xs text-neutral-400 dark:text-neutral-300/80">{item.timestamp}</span>
            </div>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-300">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

