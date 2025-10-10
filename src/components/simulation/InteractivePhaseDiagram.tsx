"use client";

import * as React from "react";
import { MousePointer2, Info } from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card.tsx";
import {Badge} from "../ui/badge.tsx";

type PhaseName = "Liquid" | "Solid (α)" | "Solid (β)" | "Mixed (α + β)";

type SelectedPoint = {
    composition: string; // percentage string (e.g., "42.1")
    temperature: string; // K as string (e.g., "1234")
    phase: PhaseName;
    x: number; // svg px
    y: number; // svg px
};

type Props = {
    results?: unknown | null; // only used to gate rendering
    elements: string[];
};

const phaseColors: Record<PhaseName, string> = {
    Liquid: "#ef4444",
    "Solid (α)": "#3b82f6",
    "Solid (β)": "#8b5cf6",
    "Mixed (α + β)": "#a855f7",
};

const InteractivePhaseDiagram = ({ results, elements }: Props) => {
    const [selectedPoint, setSelectedPoint] = React.useState<SelectedPoint | null>(null);

    if (!results) return null;

    const determinePhase = (comp: number, temp: number): PhaseName => {
        if (temp > 1500) return "Liquid";
        if (temp < 800) return "Solid (α)";
        if (comp < 30) return "Solid (α)";
        if (comp > 70) return "Solid (β)";
        return "Mixed (α + β)";
    };

    const handleSVGClick = (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();

        // relative 0..1 inside SVG
        const relX = (e.clientX - rect.left) / rect.width;
        const relY = (e.clientY - rect.top) / rect.height;

        const xPct = relX * 100; // composition %
        const yPctFromBottom = 100 - relY * 100;

        // Map 0..100% (bottom→top) to 300K..2000K
        const temperature = 300 + (yPctFromBottom / 100) * 1700;
        const composition = xPct;

        const phase = determinePhase(composition, temperature);

        setSelectedPoint({
            composition: composition.toFixed(1),
            temperature: temperature.toFixed(0),
            phase,
            x: e.clientX - rect.left, // px within SVG
            y: e.clientY - rect.top,  // px within SVG
        });
    };

    const el2 = elements?.[1] ?? "B";

    return (
        <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                    <MousePointer2 className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                    Interactive Phase Diagram: {elements.join("-")}
                </CardTitle>
                <p className="text-slate-400 text-sm">Click anywhere on the diagram to identify phases</p>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <svg
                        className="w-full h-[400px] cursor-crosshair bg-slate-950/50 rounded-xl border border-slate-700/50"
                        viewBox="0 0 400 400"
                        onClick={handleSVGClick}
                        role="img"
                        aria-label="Interactive phase diagram"
                    >
                        {/* Liquid region */}
                        <path d="M 0,50 Q 200,30 400,50 L 400,0 L 0,0 Z" fill="#ef4444" opacity="0.2" />
                        {/* Solid alpha region */}
                        <path d="M 0,400 L 0,250 Q 100,200 200,220 L 200,400 Z" fill="#3b82f6" opacity="0.2" />
                        {/* Solid beta region */}
                        <path d="M 400,400 L 400,250 Q 300,200 200,220 L 200,400 Z" fill="#8b5cf6" opacity="0.2" />
                        {/* Mixed region */}
                        <path
                            d="M 200,220 Q 200,100 200,50 Q 250,80 300,100 Q 300,200 200,220 Z"
                            fill="#a855f7"
                            opacity="0.2"
                        />

                        {/* Grid */}
                        {[0, 1, 2, 3, 4].map((i) => (
                            <line
                                key={`h${i}`}
                                x1="0"
                                y1={i * 100}
                                x2="400"
                                y2={i * 100}
                                stroke="#334155"
                                strokeDasharray="2,2"
                            />
                        ))}
                        {[0, 1, 2, 3, 4].map((i) => (
                            <line
                                key={`v${i}`}
                                x1={i * 100}
                                y1="0"
                                x2={i * 100}
                                y2="400"
                                stroke="#334155"
                                strokeDasharray="2,2"
                            />
                        ))}

                        {/* Phase boundary lines */}
                        <path d="M 0,50 Q 200,30 400,50" stroke="#ef4444" strokeWidth="2" fill="none" />
                        <path d="M 0,250 Q 100,200 200,220" stroke="#3b82f6" strokeWidth="2" fill="none" />
                        <path d="M 400,250 Q 300,200 200,220" stroke="#8b5cf6" strokeWidth="2" fill="none" />

                        {/* Selected point */}
                        {selectedPoint && (
                            <circle
                                cx={selectedPoint.x}
                                cy={selectedPoint.y}
                                r="6"
                                fill={phaseColors[selectedPoint.phase]}
                                stroke="white"
                                strokeWidth="2"
                            />
                        )}

                        {/* Axes labels */}
                        <text x="200" y="390" fill="#94a3b8" fontSize="12" textAnchor="middle">
                            Composition (wt% {el2})
                        </text>
                        <text x="10" y="200" fill="#94a3b8" fontSize="12" transform="rotate(-90 10 200)">
                            Temperature (K)
                        </text>
                    </svg>

                    {/* Info panel */}
                    {selectedPoint && (
                        <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                                <div className="space-y-2 flex-1">
                                    <h4 className="text-white font-semibold">Selected Point</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-slate-400">Composition</p>
                                            <p className="text-white font-medium">
                                                {selectedPoint.composition}% {el2}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400">Temperature</p>
                                            <p className="text-white font-medium">{selectedPoint.temperature}K</p>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-slate-400 text-sm mb-2">Phase Region</p>
                                        <Badge
                                            className="text-white border-0"
                                            style={{ backgroundColor: phaseColors[selectedPoint.phase] }}
                                        >
                                            {selectedPoint.phase}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
export default InteractivePhaseDiagram;
