import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "border-transparent items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        approved: "text-green-500 hover:text-green-600",
        processing: "text-yellow-500 hover:text-yellow/80",
        pending: "text-yellow-500 hover:text-yellow/80",
        rejected: "text-destructive hover:text-destructive/80",
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

function BadgeText({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

export { BadgeText, badgeVariants };
