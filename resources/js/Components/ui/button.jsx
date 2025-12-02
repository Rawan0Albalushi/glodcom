import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg hover:from-gold-400 hover:to-gold-500 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                destructive:
                    "bg-red-600 text-white shadow-lg hover:bg-red-700 hover:shadow-xl",
                outline:
                    "border-2 border-gold-500/50 bg-transparent text-gold-300 hover:bg-gold-500/10 hover:border-gold-400",
                secondary:
                    "bg-gold-800/50 text-gold-200 border border-gold-600/30 hover:bg-gold-700/50",
                ghost:
                    "text-gold-300 hover:bg-gold-800/50 hover:text-gold-200",
                link:
                    "text-gold-400 underline-offset-4 hover:underline hover:text-gold-300",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 rounded-lg px-4 text-xs",
                lg: "h-12 rounded-xl px-8 text-base",
                xl: "h-14 rounded-xl px-10 text-lg",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Button = React.forwardRef(
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



