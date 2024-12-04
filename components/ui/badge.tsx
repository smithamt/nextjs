import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center capitalize h-8 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        approved:
          "bg-[#0B78BE] text-white border-transparent",
        processing:
          "border-transparent bg-yellow-500 text-secondary-foreground hover:bg-yellow/80",
        pending:
          "border-transparent bg-yellow-500 text-secondary-foreground hover:bg-yellow/80",
        rejected:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text",
      },
    },
    defaultVariants: {
      variant: "approved",
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

