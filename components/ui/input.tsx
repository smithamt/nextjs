import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          `flex h-[38px] cart-bg w-full rounded-md border-input px-3 py-2 text-sm 
          ring-offset-background 
          focus-visible:border-[#b8e0f8] 
          file:border-0 
          file:bg-transparent 
          file:text-sm 
          file:font-medium 
          border-[.8px]
          focus-visible:border-[.8px] 
          focus-visible:outline-none 
          focus-visible:ring-1 
          focus-visible:ring-[#0B78BE] 
          focus-visible:ring-offset-[.6px] 
          disabled:cursor-not-allowed 
          disabled:opacity-50`,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
