import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import {cn} from "../../lib/utils.ts";


/* ---------- Breadcrumb ---------- */
export type BreadcrumbProps = React.HTMLAttributes<HTMLElement>;
export const Breadcrumb = React.forwardRef<React.ComponentRef<"nav">, BreadcrumbProps>(
    (props, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />
);
Breadcrumb.displayName = "Breadcrumb";

/* ---------- BreadcrumbList ---------- */
export type BreadcrumbListProps = React.HTMLAttributes<HTMLOListElement>;
export const BreadcrumbList = React.forwardRef<
    React.ComponentRef<"ol">,
    BreadcrumbListProps
>(({ className, ...props }, ref) => (
    <ol
        ref={ref}
        className={cn(
            "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
            className
        )}
        {...props}
    />
));
BreadcrumbList.displayName = "BreadcrumbList";

/* ---------- BreadcrumbItem ---------- */
export type BreadcrumbItemProps = React.LiHTMLAttributes<HTMLLIElement>;
export const BreadcrumbItem = React.forwardRef<
    React.ComponentRef<"li">,
    BreadcrumbItemProps
>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

/* ---------- BreadcrumbLink ---------- */
export interface BreadcrumbLinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    asChild?: boolean;
}
export const BreadcrumbLink = React.forwardRef<
    React.ComponentRef<"a">,
    BreadcrumbLinkProps
>(({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";
    return (
        <Comp
            ref={ref}
            className={cn("transition-colors hover:text-foreground", className)}
            {...props}
        />
    );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

/* ---------- BreadcrumbPage ---------- */
export type BreadcrumbPageProps = React.HTMLAttributes<HTMLSpanElement>;
export const BreadcrumbPage = React.forwardRef<
    React.ComponentRef<"span">,
    BreadcrumbPageProps
>(({ className, ...props }, ref) => (
    <span
        ref={ref}
        role="link"
        aria-disabled="true"
        aria-current="page"
        className={cn("font-normal text-foreground", className)}
        {...props}
    />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

/* ---------- BreadcrumbSeparator ---------- */
export type BreadcrumbSeparatorProps = React.LiHTMLAttributes<HTMLLIElement>;
export const BreadcrumbSeparator: React.FC<BreadcrumbSeparatorProps> = ({
                                                                            children,
                                                                            className,
                                                                            ...props
                                                                        }) => (
    <li
        role="presentation"
        aria-hidden="true"
        className={cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className)}
        {...props}
    >
        {children ?? <ChevronRight />}
    </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

/* ---------- BreadcrumbEllipsis ---------- */
export type BreadcrumbEllipsisProps = React.HTMLAttributes<HTMLSpanElement>;
export const BreadcrumbEllipsis: React.FC<BreadcrumbEllipsisProps> = ({
                                                                          className,
                                                                          ...props
                                                                      }) => (
    <span
        role="presentation"
        aria-hidden="true"
        className={cn("flex h-9 w-9 items-center justify-center", className)}
        {...props}
    >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";


