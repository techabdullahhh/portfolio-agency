import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/components/ui/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-300 ease-ultra-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground shadow-ambient hover:-translate-y-0.5 hover:shadow-glow",
        secondary:
          "relative overflow-hidden bg-gradient-to-r from-secondary via-accent to-primary text-primary-foreground shadow-ambient hover:-translate-y-0.5 hover:shadow-glow",
        outline:
          "glass-panel bg-white/50 text-neutral-600 shadow-inner transition hover:-translate-y-0.5 hover:bg-white/70 hover:text-primary dark:bg-neutral-900/60 dark:text-neutral-200",
        subtle:
          "rounded-2xl border border-white/10 bg-white/40 text-neutral-600 shadow-inner hover:border-primary/40 hover:bg-primary/10 hover:text-primary dark:bg-neutral-900/50 dark:text-neutral-200",
        ghost: "rounded-2xl text-neutral-500 hover:bg-white/40 hover:text-primary dark:text-neutral-300 dark:hover:bg-white/10",
        link: "text-primary underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground shadow-ambient hover:-translate-y-0.5 hover:bg-destructive/90",
        glass:
          "relative overflow-hidden backdrop-blur-xl border border-white/10 bg-white/30 text-neutral-700 shadow-glass hover:border-primary/40 hover:text-primary dark:bg-neutral-900/60 dark:text-neutral-100",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 rounded-xl px-4 text-sm",
        lg: "h-12 rounded-3xl px-8 text-base",
        icon: "h-11 w-11 rounded-2xl",
        pill: "h-10 rounded-full px-6 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const showSheen = variant === "default" || variant === "secondary";

    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {asChild ? (
          children
        ) : (
          <>
            <span className="relative z-10 flex items-center gap-2">{children}</span>
            {showSheen ? (
              <span className="absolute inset-0 z-0 opacity-0 transition duration-500 group-hover:opacity-100">
                <span className="card-sheen absolute inset-0" />
              </span>
            ) : null}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { buttonVariants };

