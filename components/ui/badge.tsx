import { cn } from "@/components/ui/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-primary/80 via-secondary/70 to-accent/70 text-primary-foreground shadow-glow",
        secondary:
          "border border-white/20 bg-white/70 text-neutral-600 shadow-inner dark:bg-neutral-900/60 dark:text-neutral-100",
        outline: "border border-white/20 text-neutral-500 dark:text-neutral-200",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-sm",
        muted: "border border-white/20 bg-white/40 text-neutral-500 dark:bg-neutral-900/60 dark:text-neutral-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

