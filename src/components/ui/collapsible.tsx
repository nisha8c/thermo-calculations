"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

/* ----------- Types ----------- */
export type CollapsibleProps = React.ComponentPropsWithoutRef<
    typeof CollapsiblePrimitive.Root
>;
export type CollapsibleTriggerProps = React.ComponentPropsWithoutRef<
    typeof CollapsiblePrimitive.Trigger
>;
export type CollapsibleContentProps = React.ComponentPropsWithoutRef<
    typeof CollapsiblePrimitive.Content
>;

/* ----------- Components ----------- */
const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.Trigger;
const CollapsibleContent = CollapsiblePrimitive.Content;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
