import * as React from "react";

export const MOBILE_BREAKPOINT = 768 as const;

export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT): boolean {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

    React.useEffect(() => {
        if (typeof window === "undefined") return;

        const query = `(max-width: ${breakpoint - 1}px)`;
        const mql = window.matchMedia(query);

        const handleQueryChange = () => setIsMobile(mql.matches);
        handleQueryChange(); // initial

        if (typeof mql.addEventListener === "function") {
            // Modern browsers
            mql.addEventListener("change", handleQueryChange);
            return () => mql.removeEventListener("change", handleQueryChange);
        }

        // Legacy fallback: listen to window changes that affect the query
        const handleWindowChange = () => handleQueryChange();
        window.addEventListener("resize", handleWindowChange);
        window.addEventListener("orientationchange", handleWindowChange);
        return () => {
            window.removeEventListener("resize", handleWindowChange);
            window.removeEventListener("orientationchange", handleWindowChange);
        };
    }, [breakpoint]);

    return !!isMobile;
}
