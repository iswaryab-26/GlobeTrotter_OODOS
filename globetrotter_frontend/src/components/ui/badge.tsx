import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-soft hover:shadow-glow",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-soft hover:shadow-teal",
        accent:
          "border-transparent bg-accent text-accent-foreground shadow-soft",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-soft",
        success:
          "border-transparent bg-success text-success-foreground shadow-soft",
        outline: "border-primary text-primary bg-transparent",
        glass: "glass-card border-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
