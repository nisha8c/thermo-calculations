import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

// Re-export the Radix Root with proper typing
type AspectRatioProps = React.ComponentPropsWithoutRef<
    typeof AspectRatioPrimitive.Root
>;

const AspectRatio = React.forwardRef<
    React.ComponentRef<typeof AspectRatioPrimitive.Root>,
    AspectRatioProps
>((props, ref) => <AspectRatioPrimitive.Root ref={ref} {...props} />);

AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
