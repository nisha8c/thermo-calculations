"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import {cn} from "../../lib/utils.ts";

/* ---------- Types ---------- */
export type DrawerProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Root> & {
    shouldScaleBackground?: boolean;
};
export type DrawerOverlayProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>;
export type DrawerContentProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>;
export type DrawerTitleProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>;
export type DrawerDescriptionProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>;

/* ---------- Root ---------- */
const Drawer: React.FC<DrawerProps> = ({
                                           shouldScaleBackground = true,
                                           ...props
                                       }) => (
    <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = "Drawer";

/* ---------- Primitives ---------- */
const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;

/* ---------- Overlay ---------- */
const DrawerOverlay = React.forwardRef<
    React.ComponentRef<typeof DrawerPrimitive.Overlay>,
    DrawerOverlayProps
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Overlay
        ref={ref}
        className={cn("fixed inset-0 z-50 bg-black/80", className)}
        {...props}
    />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

/* ---------- Content ---------- */
const DrawerContent = React.forwardRef<
    React.ComponentRef<typeof DrawerPrimitive.Content>,
    DrawerContentProps
>(({ className, children, ...props }, ref) => (
    <DrawerPortal>
        <DrawerOverlay />
        <DrawerPrimitive.Content
            ref={ref}
            className={cn(
                "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
                className
            )}
            {...props}
        >
            <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
            {children}
        </DrawerPrimitive.Content>
    </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

/* ---------- Header & Footer ---------- */
type DivProps = React.HTMLAttributes<HTMLDivElement>;

const DrawerHeader: React.FC<DivProps> = ({ className, ...props }) => (
    <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter: React.FC<DivProps> = ({ className, ...props }) => (
    <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

/* ---------- Title & Description ---------- */
const DrawerTitle = React.forwardRef<
    React.ComponentRef<typeof DrawerPrimitive.Title>,
    DrawerTitleProps
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold leading-none tracking-tight", className)}
        {...props}
    />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
    React.ComponentRef<typeof DrawerPrimitive.Description>,
    DrawerDescriptionProps
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

/* ---------- Exports ---------- */
export {
    Drawer,
    DrawerPortal,
    DrawerOverlay,
    DrawerTrigger,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle,
    DrawerDescription,
};
