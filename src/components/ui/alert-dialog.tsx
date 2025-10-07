import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";


import {cn} from "../../lib/utils.ts";
import {buttonVariants} from "./button-variants.ts";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

/* ---------------- Overlay ---------------- */
type AlertDialogOverlayProps = React.ComponentPropsWithoutRef<
    typeof AlertDialogPrimitive.Overlay
>;
const AlertDialogOverlay = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Overlay>,
    AlertDialogOverlayProps
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
    />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

/* ---------------- Content ---------------- */
type AlertDialogContentProps = React.ComponentPropsWithoutRef<
    typeof AlertDialogPrimitive.Content
>;
const AlertDialogContent = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Content>,
    AlertDialogContentProps
>(({ className, ...props }, ref) => (
    <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
                className
            )}
            {...props}
        />
    </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

/* ---------------- Header & Footer ---------------- */
type DivProps = React.HTMLAttributes<HTMLDivElement>;

const AlertDialogHeader: React.FC<DivProps> = ({ className, ...props }) => (
    <div
        className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
        {...props}
    />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter: React.FC<DivProps> = ({ className, ...props }) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
            className
        )}
        {...props}
    />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

/* ---------------- Title & Description ---------------- */
type AlertDialogTitleProps = React.ComponentPropsWithoutRef<
    typeof AlertDialogPrimitive.Title
>;
const AlertDialogTitle = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Title>,
    AlertDialogTitleProps
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold", className)}
        {...props}
    />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

type AlertDialogDescriptionProps = React.ComponentPropsWithoutRef<
    typeof AlertDialogPrimitive.Description
>;
const AlertDialogDescription = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Description>,
    AlertDialogDescriptionProps
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
AlertDialogDescription.displayName =
    AlertDialogPrimitive.Description.displayName;

/* ---------------- Action & Cancel Buttons ---------------- */
type AlertDialogActionProps = React.ComponentPropsWithoutRef<
    typeof AlertDialogPrimitive.Action
>;
const AlertDialogAction = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Action>,
    AlertDialogActionProps
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Action
        ref={ref}
        className={cn(buttonVariants(), className)}
        {...props}
    />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

type AlertDialogCancelProps = React.ComponentPropsWithoutRef<
    typeof AlertDialogPrimitive.Cancel
>;
const AlertDialogCancel = React.forwardRef<
    React.ComponentRef<typeof AlertDialogPrimitive.Cancel>,
    AlertDialogCancelProps
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Cancel
        ref={ref}
        className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
        {...props}
    />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

/* ---------------- Exports ---------------- */
export {
    AlertDialog,
    AlertDialogPortal,
    AlertDialogOverlay,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
};
