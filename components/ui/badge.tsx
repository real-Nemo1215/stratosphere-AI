import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1",
    "rounded-full border px-3 py-0.5",
    "text-xs font-heading font-medium tracking-[0.01em]",
    "transition-colors duration-150",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  ].join(" "),
  {
    variants: {
      variant: {
        /* Cobalt Primary fill */
        default:
          "border-transparent bg-primary text-primary-foreground",

        secondary:
          "border-border bg-secondary text-secondary-foreground",

        destructive:
          "border-transparent bg-destructive text-destructive-foreground",

        /* Border, semantic text */
        outline:
          "border-border bg-transparent text-foreground",

        /* Mint accent — for savings / highlights */
        accent:
          "border-transparent bg-accent text-accent-foreground",

        /* Risk — high risk destructive */
        risk:
          "border-transparent bg-destructive text-destructive-foreground",

        /* Eyebrow labels — subdued, uppercase */
        eyebrow:
          "border-border bg-transparent text-muted-foreground uppercase text-[10px] tracking-[0.08em] font-medium",

        /* Success — mint tint / accent */
        success:
          "border-transparent bg-accent/20 text-accent font-medium dark:bg-accent/25 dark:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
