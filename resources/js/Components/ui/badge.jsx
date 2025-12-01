import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-gold-500 text-white",
                secondary:
                    "border-transparent bg-gold-800 text-gold-200",
                destructive:
                    "border-transparent bg-red-600 text-white",
                outline: 
                    "border-gold-500/50 text-gold-300",
                success:
                    "border-transparent bg-green-600/30 text-green-300 border-green-500/30",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

function Badge({ className, variant, ...props }) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };

