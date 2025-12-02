import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-12 w-full rounded-xl border border-gold-600/30 bg-gold-900/50 px-4 py-3 text-base text-gold-100 placeholder:text-gold-600 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

export { Input };



