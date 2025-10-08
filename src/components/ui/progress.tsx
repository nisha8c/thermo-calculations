"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import {cn} from "../../lib/utils.ts";


export type ProgressProps = React.ComponentPropsWithoutRef<
    typeof ProgressPrimitive.Root
>;

const Progress = React.forwardRef<
    React.ComponentRef<typeof ProgressPrimitive.Root>,
    ProgressProps
>(({ className, value, ...props }, ref) => {
    const pct = typeof value === "number" ? Math.min(100, Math.max(0, value)) : 0;

    return (
        <ProgressPrimitive.Root
            ref={ref}
            className={cn(
                "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
                className
            )}
            value={value}
            {...props}
        >
            <ProgressPrimitive.Indicator
                className="h-full w-full flex-1 bg-primary transition-all"
                style={{ transform: `translateX(-${100 - pct}%)` }}
            />
        </ProgressPrimitive.Root>
    );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
