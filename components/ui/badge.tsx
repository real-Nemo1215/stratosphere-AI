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
        /* Chestnut fill */
        default:
          "border-transparent bg-primary text-primary-foreground",

        secondary:
          "border-border bg-secondary text-secondary-foreground",

        destructive:
          "border-transparent bg-destructive text-destructive-foreground",

        /* Sand border, warm text */
        outline:
          "border-border bg-transparent text-foreground",

        /* Amber accent — for savings / highlights */
        accent:
          "border-transparent bg-amber text-cream",

        /* Risk — warm red-amber */
        risk:
          "border-transparent bg-amber text-cream",

        /* Eyebrow labels — subdued, uppercase */
        eyebrow:
          "border-border bg-transparent text-muted-foreground uppercase text-[10px] tracking-[0.08em] font-medium",

        /* Success — soft green tint on beige */
        success:
          "border-transparent bg-[#d4e8d0] text-[#2a5c26]",
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
