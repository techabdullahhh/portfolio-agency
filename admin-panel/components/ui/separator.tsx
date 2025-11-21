import * as React from "react";
import { cn } from "@/components/ui/utils";

export function Separator({ className, orientation = "horizontal", ...props }: { className?: string; orientation?: "horizontal" | "vertical" } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      role="separator"
      aria-orientation={orientation}
      {...props}
    />
  );
}

