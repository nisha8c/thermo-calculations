import * as React from "react";
import { type VariantProps } from "class-variance-authority";


import { badgeVariants } from "./badge-variants";
import {cn} from "../../lib/utils.ts";

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<React.ComponentRef<"div">, BadgeProps>(
    ({ className, variant, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    )
);
Badge.displayName = "Badge";
