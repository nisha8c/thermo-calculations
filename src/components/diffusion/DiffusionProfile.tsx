
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Wind } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

type DiffusionPoint = { position: number; concentration: number };

type DiffusionResults = {
    profileData: DiffusionPoint[];
    /** Penetration depth; number (µm) or already-formatted string */
    penetration_depth?: number | string;
    /** Flux rate; could be numeric or a string like "1.2× baseline" */
    flux_rate?: number | string;
    /** Percent or numeric string */
    interface_concentration?: number | string;
};

type DiffusionParameters = {
    time?: number; // seconds
};

type Props = {
    results?: DiffusionResults | null;
    elements: string[];
    parameters?: DiffusionParameters;
};

export default function DiffusionProfile({ results, elements, parameters }: Props) {
    if (!results) {
        return (
            <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50 h-full">
                <CardContent className="p-8 md:p-12 flex flex-col items-center justify-center h-full">
                    <Wind className="w-12 h-12 md:w-16 md:h-16 text-slate-600 mb-4" />
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No Results Yet</h3>
                    <p className="text-slate-400 text-center text-sm md:text-base">
                        Configure parameters and run simulation to see diffusion profiles
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Formatting helpers
    const timeHours =
        typeof parameters?.time === "number"
            ? (parameters.time / 3600).toFixed(2)
            : "—";

    const penetrationDepth =
        typeof results.penetration_depth === "number"
            ? `${results.penetration_depth} µm`
            : results.penetration_depth ?? "—";

    const fluxRate =
        typeof results.flux_rate === "number"
            ? results.flux_rate.toFixed(2)
            : results.flux_rate ?? "—";

    const interfaceConc =
        typeof results.interface_concentration === "number"
            ? results.interface_concentration.toFixed(2)
            : results.interface_concentration ?? "—";

    return (
        <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                    <Wind className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                    Concentration Profile: {elements.join("-")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 md:space-y-6">
                    <div className="w-full overflow-x-auto">
                        <ResponsiveContainer width="100%" height={400} minWidth={300}>
                            <LineChart data={results.profileData}>
                                <defs>
                                    <linearGradient id="concentration" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis
                                    dataKey="position"
                                    stroke="#94a3b8"
                                    label={{
                                        value: "Distance from Interface (μm)",
                                        position: "insideBottom",
                                        offset: -5,
                                        fill: "#94a3b8",
                                    }}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    label={{
                                        value: "Concentration (wt%)",
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
                                <Line
                                    type="monotone"
                                    dataKey="concentration"
                                    stroke="#06b6d4"
                                    strokeWidth={3}
                                    fill="url(#concentration)"
                                    name={`${elements[1]} Concentration`}
                                    dot={{ fill: "#06b6d4", r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                        <div className="p-3 md:p-4 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 rounded-xl">
                            <h4 className="text-cyan-400 font-semibold mb-2 text-sm md:text-base">Penetration Depth</h4>
                            <p className="text-white text-xl md:text-2xl font-bold">{penetrationDepth}</p>
                            <p className="text-slate-400 text-xs md:text-sm mt-1">At {timeHours}h</p>
                        </div>
                        <div className="p-3 md:p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl">
                            <h4 className="text-blue-400 font-semibold mb-2 text-sm md:text-base">Flux Rate</h4>
                            <p className="text-white text-xl md:text-2xl font-bold">{fluxRate}</p>
                            <p className="text-slate-400 text-xs md:text-sm mt-1">mol/(m²·s)</p>
                        </div>
                        <div className="p-3 md:p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl">
                            <h4 className="text-purple-400 font-semibold mb-2 text-sm md:text-base">Interface Conc.</h4>
                            <p className="text-white text-xl md:text-2xl font-bold">{interfaceConc}%</p>
                            <p className="text-slate-400 text-xs md:text-sm mt-1">At boundary</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
