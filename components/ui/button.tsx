import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button — Cobalt & Mint Theme
 * Primary:  Cobalt Blue fill, white text. Hover: bg-primary/90.
 * Accent:   Mint Green fill, white text. Hover: bg-accent/90.
 * Outline:  Transparent + border. Hover: muted surface.
 * Ghost:    No border, transparent. Hover: muted surface.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap",
    "font-heading text-sm font-medium tracking-[-0.01em]",
    "rounded-md",
    "ring-offset-background transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
    "cursor-pointer select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        /* Cobalt fill */
        default:
          "bg-primary text-primary-foreground border border-primary " +
          "hover:bg-primary/90 hover:border-primary/90",

        /* Mint Green fill */
        accent:
          "bg-accent text-accent-foreground border border-accent " +
          "hover:bg-accent/90 hover:border-accent/90",

        destructive:
          "bg-destructive text-destructive-foreground border border-destructive " +
          "hover:bg-destructive/90",

        /* Border, transparent bg */
        outline:
          "border border-border bg-transparent text-foreground " +
          "hover:bg-muted hover:border-foreground/30",

        secondary:
          "bg-secondary text-secondary-foreground border border-border " +
          "hover:bg-muted",

        /* No border, shows surface on hover */
        ghost:
          "bg-transparent text-foreground border border-transparent " +
          "hover:bg-muted hover:border-border",

        link: "text-primary underline-offset-4 hover:underline h-auto p-0",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm:      "h-8 px-4 text-xs",
        lg:      "h-12 px-8 text-base",
        icon:    "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
