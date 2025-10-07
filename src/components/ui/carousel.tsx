import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import type {
    EmblaCarouselType,
    EmblaOptionsType,
    EmblaPluginType,
} from "embla-carousel";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils.ts";
import { Button } from "./button"; // <-- import as a value (no `type`)

// derive Button props from the component
type ButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

/* ---------------- Types ---------------- */
type Orientation = "horizontal" | "vertical";

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: Orientation;
    opts?: EmblaOptionsType;
    plugins?: EmblaPluginType[];
    setApi?: (api: EmblaCarouselType) => void;
    children?: React.ReactNode;
}

interface CarouselContextValue {
    carouselRef: (node: HTMLDivElement | null) => void;
    api: EmblaCarouselType | undefined;
    opts?: EmblaOptionsType;
    orientation: Orientation;
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
}

/* ---------------- Context ---------------- */
const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel(): CarouselContextValue {
    const context = React.useContext(CarouselContext);
    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />");
    }
    return context;
}

/* ---------------- Root ---------------- */
const Carousel = React.forwardRef<React.ComponentRef<"div">, CarouselProps>(
    (
        { orientation = "horizontal", opts, setApi, plugins, className, children, ...props },
        ref
    ) => {
        const [carouselRef, api] = useEmblaCarousel(
            { ...opts, axis: orientation === "horizontal" ? "x" : "y" },
            plugins
        );

        const [canScrollPrev, setCanScrollPrev] = React.useState(false);
        const [canScrollNext, setCanScrollNext] = React.useState(false);

        const onSelect = React.useCallback((embla: EmblaCarouselType | undefined) => {
            if (!embla) return;
            setCanScrollPrev(embla.canScrollPrev());
            setCanScrollNext(embla.canScrollNext());
        }, []);

        const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
        const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

        const handleKeyDown = React.useCallback<React.KeyboardEventHandler<HTMLDivElement>>(
            (event) => {
                if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    scrollPrev();
                } else if (event.key === "ArrowRight") {
                    event.preventDefault();
                    scrollNext();
                }
            },
            [scrollPrev, scrollNext]
        );

        React.useEffect(() => {
            if (!api || !setApi) return;
            setApi(api);
        }, [api, setApi]);

        React.useEffect(() => {
            if (!api) return;
            onSelect(api);
            api.on("reInit", onSelect);
            api.on("select", onSelect);
            return () => {
                api.off("select", onSelect);
                api.off("reInit", onSelect);
            };
        }, [api, onSelect]);

        return (
            <CarouselContext.Provider
                value={{
                    carouselRef,
                    api,
                    opts,
                    orientation: orientation ?? (opts?.axis === "y" ? "vertical" : "horizontal"),
                    scrollPrev,
                    scrollNext,
                    canScrollPrev,
                    canScrollNext,
                }}
            >
                <div
                    ref={ref}
                    onKeyDownCapture={handleKeyDown}
                    className={cn("relative", className)}
                    role="region"
                    aria-roledescription="carousel"
                    {...props}
                >
                    {children}
                </div>
            </CarouselContext.Provider>
        );
    }
);
Carousel.displayName = "Carousel";

/* ---------------- Content ---------------- */
// use type alias (not empty interface)
type CarouselContentProps = React.HTMLAttributes<HTMLDivElement>;

const CarouselContent = React.forwardRef<React.ComponentRef<"div">, CarouselContentProps>(
    ({ className, ...props }, ref) => {
        const { carouselRef, orientation } = useCarousel();
        return (
            <div ref={carouselRef} className="overflow-hidden">
                <div
                    ref={ref}
                    className={cn(
                        "flex",
                        orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);
CarouselContent.displayName = "CarouselContent";

/* ---------------- Item ---------------- */
// use type alias (not empty interface)
type CarouselItemProps = React.HTMLAttributes<HTMLDivElement>;

const CarouselItem = React.forwardRef<React.ComponentRef<"div">, CarouselItemProps>(
    ({ className, ...props }, ref) => {
        const { orientation } = useCarousel();
        return (
            <div
                ref={ref}
                role="group"
                aria-roledescription="slide"
                className={cn(
                    "min-w-0 shrink-0 grow-0 basis-full",
                    orientation === "horizontal" ? "pl-4" : "pt-4",
                    className
                )}
                {...props}
            />
        );
    }
);
CarouselItem.displayName = "CarouselItem";

/* ---------------- Previous Button ---------------- */
type CarouselNavButtonProps = ButtonProps;

const CarouselPrevious = React.forwardRef<
    React.ComponentRef<"button">,
    CarouselNavButtonProps
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();
    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                "absolute  h-8 w-8 rounded-full",
                orientation === "horizontal"
                    ? "-left-12 top-1/2 -translate-y-1/2"
                    : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
                className
            )}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            {...props}
        >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Previous slide</span>
        </Button>
    );
});
CarouselPrevious.displayName = "CarouselPrevious";

/* ---------------- Next Button ---------------- */
const CarouselNext = React.forwardRef<
    React.ComponentRef<"button">,
    CarouselNavButtonProps
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();
    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                "absolute h-8 w-8 rounded-full",
                orientation === "horizontal"
                    ? "-right-12 top-1/2 -translate-y-1/2"
                    : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
                className
            )}
            disabled={!canScrollNext}
            onClick={scrollNext}
            {...props}
        >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
        </Button>
    );
});
CarouselNext.displayName = "CarouselNext";

/* ---------------- Exports ---------------- */
export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
