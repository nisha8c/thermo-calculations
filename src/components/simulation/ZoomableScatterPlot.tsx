"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../ui/card.tsx";
import { Button } from "../ui/button";
import {
    ZoomIn,
    ZoomOut,
    Maximize2,
    RefreshCw,
} from "lucide-react";
import {
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
} from "recharts";

/* -------------------- Types -------------------- */
type PhaseKind = "liquid" | "solid" | "mixed";

type ScatterPoint = {
    x: number;          // composition (%)
    y: number;          // temperature (K)
    phase: PhaseKind;
    size: number;       // (optional visual size; not used directly by recharts here)
};

type Props = {
    data?: ScatterPoint[];
    elements?: string[];
};

/* -------------------- Component -------------------- */
const ZoomableScatterPlot = ({ data, elements }: Props) => {
    const [zoom, setZoom] = React.useState<number>(1);
    const [panOffset, setPanOffset] = React.useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    const [isDragging, setIsDragging] = React.useState<boolean>(false);
    const [dragStart, setDragStart] = React.useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    // Generate sample scatter data if not provided
    const scatterData: ScatterPoint[] = React.useMemo(
        () =>
            data ??
            Array.from({ length: 100 }, () => {
                const r = Math.random();
                const phase: PhaseKind =
                    r > 0.66 ? "liquid" : r > 0.33 ? "solid" : "mixed";
                return {
                    x: Math.random() * 100,
                    y: 300 + Math.random() * 1500,
                    phase,
                    size: 20 + Math.random() * 30,
                };
            }),
        [data]
    );

    const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.2, 5));
    const handleZoomOut = () => setZoom((prev) => Math.max(prev / 1.2, 0.5));

    const handleReset = () => {
        setZoom(1);
        setPanOffset({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        setPanOffset({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            setZoom((prev) => Math.max(0.5, Math.min(5, prev * delta)));
        };

        container.addEventListener("wheel", onWheel, { passive: false });
        return () => container.removeEventListener("wheel", onWheel);
    }, []);

    const phaseColors: Record<PhaseKind, string> = {
        liquid: "#ef4444",
        solid: "#3b82f6",
        mixed: "#a855f7",
    };

    return (
        <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50">
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                        <Maximize2 className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                        Zoomable Phase Space: {elements?.join("-") || "Sample Data"}
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleZoomIn}
                            className="border-slate-600 text-slate-300 hover:bg-slate-800"
                            type="button"
                            aria-label="Zoom in"
                        >
                            <ZoomIn className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleZoomOut}
                            className="border-slate-600 text-slate-300 hover:bg-slate-800"
                            type="button"
                            aria-label="Zoom out"
                        >
                            <ZoomOut className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                            className="border-slate-600 text-slate-300 hover:bg-slate-800"
                            type="button"
                            aria-label="Reset view"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <p className="text-slate-400 text-xs md:text-sm mt-2">
                    Zoom: {zoom.toFixed(1)}x • Drag to pan • Scroll to zoom
                </p>
            </CardHeader>

            <CardContent>
                <div
                    ref={containerRef}
                    className="relative overflow-hidden rounded-lg bg-slate-950/50 border border-slate-700/50 cursor-grab active:cursor-grabbing"
                    style={{ height: "400px", touchAction: "none" }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div
                        style={{
                            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                            transformOrigin: "center",
                            transition: isDragging ? "none" : "transform 0.1s ease-out",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis
                                    type="number"
                                    dataKey="x"
                                    name="Composition"
                                    unit="%"
                                    stroke="#94a3b8"
                                    label={{
                                        value: `Composition (wt% ${elements?.[1] || "Element"})`,
                                        position: "insideBottom",
                                        offset: -10,
                                        fill: "#94a3b8",
                                        style: { fontSize: "12px" },
                                    }}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="y"
                                    name="Temperature"
                                    unit="K"
                                    stroke="#94a3b8"
                                    label={{
                                        value: "Temperature (K)",
                                        angle: -90,
                                        position: "insideLeft",
                                        fill: "#94a3b8",
                                        style: { fontSize: "12px" },
                                    }}
                                />
                                <Tooltip
                                    cursor={{ strokeDasharray: "3 3" }}
                                    contentStyle={{
                                        backgroundColor: "#1e293b",
                                        border: "1px solid #475569",
                                        borderRadius: "8px",
                                        color: "#fff",
                                    }}
                                    formatter={(value: number, name: string) => [value, name]}
                                />
                                <Scatter name="Phase Points" data={scatterData}>
                                    {scatterData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={phaseColors[entry.phase]}
                                            opacity={0.6}
                                        />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-500" />
                        <span className="text-slate-400 text-xs md:text-sm">Liquid Phase</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-blue-500" />
                        <span className="text-slate-400 text-xs md:text-sm">Solid Phase</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-purple-500" />
                        <span className="text-slate-400 text-xs md:text-sm">Mixed Phase</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default ZoomableScatterPlot;