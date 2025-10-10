import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Activity } from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card.tsx";

type PhaseDatum = {
    composition: number; // wt% of second element
    liquidus: number;    // K
    solidus: number;     // K
};

type PhaseDiagramResults = {
    phaseData: PhaseDatum[];
    phases?: {
        liquid?: string;
        mixed?: string;
        solid?: string;
    };
};

type TemperatureRange = { min: number; max: number; unit?: string };

type Props = {
    results?: PhaseDiagramResults | null;
    elements: string[];
    temperatureRange?: TemperatureRange;
};

export default function PhaseDiagramChart({ results, elements, temperatureRange }: Props) {
    if (!results) {
        return (
            <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50 h-full">
                <CardContent className="p-8 md:p-12 flex flex-col items-center justify-center h-full">
                    <Activity className="w-12 h-12 md:w-16 md:h-16 text-slate-600 mb-4" />
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No Results Yet</h3>
                    <p className="text-slate-400 text-center text-sm md:text-base">
                        Select elements and run a calculation to see the phase diagram
                    </p>
                </CardContent>
            </Card>
        );
    }

    const secondEl = elements?.[1] ?? "B";
    const yDomain = temperatureRange
        ? ([temperatureRange.min, temperatureRange.max] as [number, number])
        : undefined;

    return (
        <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                    <Activity className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                    Phase Diagram: {elements.join("-")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 md:space-y-6">
                    <div className="w-full overflow-x-auto">
                        <ResponsiveContainer width="100%" height={300} minWidth={300}>
                            <AreaChart data={results.phaseData}>
                                <defs>
                                    <linearGradient id="liquid" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="solid" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis
                                    dataKey="composition"
                                    stroke="#94a3b8"
                                    label={{
                                        value: `Composition (wt% ${secondEl})`,
                                        position: "insideBottom",
                                        offset: -5,
                                        fill: "#94a3b8",
                                    }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    {...(yDomain ? { domain: yDomain } : {})}
                                    label={{
                                        value: "Temperature (K)",
                                        angle: -90,
                                        position: "insideLeft",
                                        fill: "#94a3b8",
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1e293b",
                                        border: "1px solid #475569",
                                        borderRadius: "8px",
                                        color: "#fff",
                                    }}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="liquidus"
                                    stroke="#ef4444"
                                    fill="url(#liquid)"
                                    name="Liquid Phase"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="solidus"
                                    stroke="#3b82f6"
                                    fill="url(#solid)"
                                    name="Solid Phase"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-6">
                        <div className="p-3 md:p-4 bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl">
                            <h4 className="text-red-400 font-semibold mb-2 text-sm md:text-base">Liquid Phase</h4>
                            <p className="text-white text-xl md:text-2xl font-bold">
                                {results.phases?.liquid ?? "—"}
                            </p>
                            <p className="text-slate-400 text-xs md:text-sm mt-1">Above liquidus line</p>
                        </div>
                        <div className="p-3 md:p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl">
                            <h4 className="text-purple-400 font-semibold mb-2 text-sm md:text-base">Mixed Phase</h4>
                            <p className="text-white text-xl md:text-2xl font-bold">
                                {results.phases?.mixed ?? "—"}
                            </p>
                            <p className="text-slate-400 text-xs md:text-sm mt-1">Between lines</p>
                        </div>
                        <div className="p-3 md:p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl">
                            <h4 className="text-blue-400 font-semibold mb-2 text-sm md:text-base">Solid Phase</h4>
                            <p className="text-white text-xl md:text-2xl font-bold">
                                {results.phases?.solid ?? "—"}
                            </p>
                            <p className="text-slate-400 text-xs md:text-sm mt-1">Below solidus line</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
