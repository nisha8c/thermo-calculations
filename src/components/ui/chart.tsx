"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import type { LegendPayload } from "recharts";
import { cn } from "../../lib/utils.ts";

/* ---------------- Types ---------------- */

type ThemeName = "light" | "dark";

type ChartConfigItem = {
    /** Display label for this series/key */
    label?: string;
    /** Fixed color (overridden by theme-specific colors if provided) */
    color?: string;
    /** Optional theme-based colors */
    theme?: Partial<Record<ThemeName, string>>;
    /** Optional icon component to render in legends/tooltips */
    icon?: React.ComponentType;
};

type ChartConfig = Record<string, ChartConfigItem>;

/** Values we actually render */
type ValueType = number | string;
type NameType = string;

/** Minimal tooltip item shape we read from Recharts */
type TooltipItem<V = ValueType, N = NameType> = {
    dataKey?: string | number;
    name?: N;
    value?: V;
    color?: string;
    payload?: (Record<string, unknown> & { fill?: string }) | undefined;
};

/** CSS vars type (no `any`) */
type CSSVars = React.CSSProperties & {
    "--color-bg"?: string;
    "--color-border"?: string;
};

/* ---------------- Constants ---------------- */

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES: Record<ThemeName, string> = {
    light: "",
    dark: ".dark",
};

/* ---------------- Context ---------------- */

type ChartContextValue = { config: ChartConfig };

const ChartContext = React.createContext<ChartContextValue | null>(null);

function useChart(): ChartContextValue {
    const context = React.useContext(ChartContext);
    if (!context) throw new Error("useChart must be used within a <ChartContainer />");
    return context;
}

/* ---------------- Container ---------------- */

type ChartContainerProps = React.HTMLAttributes<HTMLDivElement> & {
    id?: string;
    /** Series styling/labels configuration */
    config: ChartConfig;
    children?: React.ReactNode;
};

const ChartContainer = React.forwardRef<React.ComponentRef<"div">, ChartContainerProps>(
    ({ id, className, children, config, ...props }, ref) => {
        const uniqueId = React.useId();
        const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

        // ResponsiveContainer wants a single ReactElement (not null).
        const childEl: React.ReactElement = React.isValidElement(children) ? children : <div />;

        return (
            <ChartContext.Provider value={{ config }}>
                <div
                    data-chart={chartId}
                    ref={ref}
                    className={cn(
                        "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
                        className
                    )}
                    {...props}
                >
                    <ChartStyle id={chartId} config={config} />
                    <RechartsPrimitive.ResponsiveContainer>{childEl}</RechartsPrimitive.ResponsiveContainer>
                </div>
            </ChartContext.Provider>
        );
    }
);
ChartContainer.displayName = "Chart";

/* ---------------- Dynamic CSS Vars per Theme ---------------- */

type ChartStyleProps = { id: string; config: ChartConfig };

const ChartStyle: React.FC<ChartStyleProps> = ({ id, config }) => {
    const colorConfig = Object.entries(config).filter(([, cfg]) => !!(cfg?.theme || cfg?.color));
    if (!colorConfig.length) return null;

    const css = Object.entries(THEMES)
        .map(([theme, prefix]) => {
            const lines = colorConfig
                .map(([key, itemConfig]) => {
                    const color = itemConfig.theme?.[theme as ThemeName] ?? itemConfig.color;
                    return color ? `  --color-${key}: ${color};` : null;
                })
                .filter(Boolean)
                .join("\n");
            return `${prefix} [data-chart=${id}] {\n${lines}\n}`;
        })
        .join("\n");

    return <style dangerouslySetInnerHTML={{ __html: css }} />;
};

/* ---------------- Tooltip ---------------- */

const ChartTooltip = RechartsPrimitive.Tooltip;

type ChartTooltipContentProps = {
    className?: string;
    indicator?: "dot" | "line" | "dashed";
    hideLabel?: boolean;
    hideIndicator?: boolean;
    labelClassName?: string;
    /** Custom formatter(value, name, item, index, rawPayload) */
    formatter?: (
        value: ValueType,
        name: NameType,
        item: TooltipItem,
        index: number,
        rawPayload: unknown
    ) => React.ReactNode;
    color?: string;
    nameKey?: string;
    labelKey?: string;

    /* Recharts-provided content props we actually use */
    active?: boolean;
    payload?: ReadonlyArray<TooltipItem>;
    label?: string | number;
    labelFormatter?: (
        label: string | number | undefined,
        payload?: ReadonlyArray<TooltipItem>
    ) => React.ReactNode;
};

const ChartTooltipContent = React.forwardRef<
    React.ComponentRef<"div">,
    ChartTooltipContentProps
>(
    (
        {
            active,
            payload,
            className,
            indicator = "dot",
            hideLabel = false,
            hideIndicator = false,
            label,
            labelFormatter,
            labelClassName,
            formatter,
            color,
            nameKey,
            labelKey,
        },
        ref
    ) => {
        const { config } = useChart();
        const items = (payload ?? []) as ReadonlyArray<TooltipItem>;

        const tooltipLabel = React.useMemo(() => {
            if (hideLabel || items.length === 0) return null;

            const [item] = items;
            const key = String(labelKey || item.dataKey || item.name || "value");
            const itemCfg = getPayloadConfigFromPayload(config, item, key);

            const derived =
                !labelKey && typeof label === "string" ? config[label]?.label || label : itemCfg?.label;

            if (labelFormatter) {
                return (
                    <div className={cn("font-medium", labelClassName)}>
                        {labelFormatter(derived, items)}
                    </div>
                );
            }

            if (!derived) return null;
            return <div className={cn("font-medium", labelClassName)}>{derived}</div>;
        }, [label, labelFormatter, items, hideLabel, labelClassName, config, labelKey]);

        if (!active || items.length === 0) return null;

        const nestLabel = items.length === 1 && indicator !== "dot";

        return (
            <div
                ref={ref}
                className={cn(
                    "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
                    className
                )}
            >
                {!nestLabel ? tooltipLabel : null}
                <div className="grid gap-1.5">
                    {items.map((item, index) => {
                        const key = String(nameKey || item.name || item.dataKey || "value");
                        const itemCfg = getPayloadConfigFromPayload(config, item, key);
                        const indicatorColor = color ?? item.payload?.fill ?? item.color;

                        return (
                            <div
                                key={String(item.dataKey)}
                                className={cn(
                                    "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                                    indicator === "dot" && "items-center"
                                )}
                            >
                                {formatter && item.value !== undefined && item.name ? (
                                    formatter(item.value, item.name, item, index, item.payload)
                                ) : (
                                    <>
                                        {itemCfg?.icon ? (
                                            <itemCfg.icon />
                                        ) : (
                                            !hideIndicator && (
                                                <div
                                                    className={cn(
                                                        "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                                                        {
                                                            "h-2.5 w-2.5": indicator === "dot",
                                                            "w-1": indicator === "line",
                                                            "w-0 border-[1.5px] border-dashed bg-transparent":
                                                                indicator === "dashed",
                                                            "my-0.5": nestLabel && indicator === "dashed",
                                                        }
                                                    )}
                                                    style={
                                                        {
                                                            "--color-bg": indicatorColor,
                                                            "--color-border": indicatorColor,
                                                        } as CSSVars
                                                    }
                                                />
                                            )
                                        )}
                                        <div
                                            className={cn(
                                                "flex flex-1 justify-between leading-none",
                                                nestLabel ? "items-end" : "items-center"
                                            )}
                                        >
                                            <div className="grid gap-1.5">
                                                {nestLabel ? tooltipLabel : null}
                                                <span className="text-muted-foreground">
                          {itemCfg?.label || item.name}
                        </span>
                                            </div>
                                            {item.value !== undefined && item.value !== null && (
                                                <span className="font-mono font-medium tabular-nums text-foreground">
                          {typeof item.value === "number"
                              ? item.value.toLocaleString()
                              : String(item.value)}
                        </span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
);
ChartTooltipContent.displayName = "ChartTooltip";

/* ---------------- Legend ---------------- */

const ChartLegend = RechartsPrimitive.Legend;

type ChartLegendContentProps = {
    className?: string;
    hideIcon?: boolean;
    payload?: LegendPayload[];
    verticalAlign?: "top" | "middle" | "bottom";
    nameKey?: string;
};

const ChartLegendContent = React.forwardRef<
    React.ComponentRef<"div">,
    ChartLegendContentProps
>(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
    const { config } = useChart();
    if (!payload?.length) return null;

    return (
        <div
            ref={ref}
            className={cn(
                "flex items-center justify-center gap-4",
                verticalAlign === "top" ? "pb-3" : "pt-3",
                className
            )}
        >
            {payload.map((item) => {
                const key = String(nameKey || item.dataKey || "value");
                const itemCfg = getPayloadConfigFromPayload(
                    config,
                    { dataKey: item.dataKey, name: String(item.value), color: item.color } as TooltipItem,
                    key
                );

                return (
                    <div
                        key={String(item.value)}
                        className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
                    >
                        {itemCfg?.icon && !hideIcon ? (
                            <itemCfg.icon />
                        ) : (
                            <div
                                className="h-2 w-2 shrink-0 rounded-[2px]"
                                style={{ backgroundColor: item.color }}
                            />
                        )}
                        {itemCfg?.label}
                    </div>
                );
            })}
        </div>
    );
});
ChartLegendContent.displayName = "ChartLegend";

/* ---------------- Helpers ---------------- */

function getPayloadConfigFromPayload(
    config: ChartConfig,
    payload: TooltipItem | LegendPayload | unknown,
    key: string
): ChartConfigItem | undefined {
    if (typeof payload !== "object" || payload === null) return undefined;

    const nested =
        (payload as TooltipItem).payload && typeof (payload as TooltipItem).payload === "object"
            ? ((payload as TooltipItem).payload as Record<string, unknown>)
            : undefined;

    let configLabelKey = key;

    if (
        key in (payload as Record<string, unknown>) &&
        typeof (payload as Record<string, unknown>)[key] === "string"
    ) {
        configLabelKey = (payload as Record<string, unknown>)[key] as string;
    } else if (nested && key in nested && typeof nested[key] === "string") {
        configLabelKey = nested[key] as string;
    }

    return (configLabelKey in config ? config[configLabelKey] : config[key]) as
        | ChartConfigItem
        | undefined;
}

/* ---------------- Exports ---------------- */

export {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    ChartStyle,
};
