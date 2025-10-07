import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";


import { buttonVariants } from "./button-variants";
import {cn} from "../../lib/utils.ts";

type ButtonBaseProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface ButtonProps
    extends ButtonBaseProps,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

export const Button = React.forwardRef<React.ComponentRef<"button">, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                ref={ref}
                className={cn(buttonVariants({ variant, size, className }))}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
