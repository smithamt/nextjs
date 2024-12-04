import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      `peer h-[18px] w-[18px] rounded-full shrink-0 
      border border-primary 
     focus-visible:outline-none 
     focus-visible:ring-2 
     focus-visible:ring-ring 
     focus-visible:ring-offset-2 
     disabled:cursor-not-allowed 
     disabled:opacity-50 
     data-[state=checked]:border-[#0B78BE] 
      data-[state=checked]:bg-[#0B78BE] 
      data-[state=checked]:hover:bg-[#0161A0] 
      data-[state=checked]:text-primary-foreground`,
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center p-[1px]")}
    >
      <Check className="h-4 w-4 text-white" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
