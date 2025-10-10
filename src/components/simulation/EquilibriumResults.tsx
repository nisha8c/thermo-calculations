"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Beaker } from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";

/* ---------------------- Types ---------------------- */
type PhaseFraction = { name: string; value: number };
type PhaseComposition = { name: string; composition: Record<string, number> };

export type EquilibriumResultsData = {
    phaseFractions: PhaseFraction[];
    phaseCompositions: PhaseComposition[];
    properties?: Record<string, string | number>;
};

type Props = {
    results?: EquilibriumResultsData | null;
};

/* ---------------------- Constants ---------------------- */
const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"] as const;

/* ---------------------- Component ---------------------- */
const EquilibriumResults = ({ results }: Props) => {
    // Guard first
    if (!results) {
        return (
            <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50 h-full">
                <CardContent className="p-12 flex flex-col items-center justify-center h-full">
                    <Beaker className="w-16 h-16 text-slate-600 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Results Yet</h3>
                    <p className="text-slate-400 text-center">
                        Configure composition and run a calculation to see equilibrium results
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Safe to destructure now
    const { phaseFractions, phaseCompositions, properties } = results;

    // Cheap reduce (no memo needed); types explicit to satisfy ESLint
    const total = phaseFractions.reduce(
        (sum: number, p: PhaseFraction) => sum + p.value,
        0
    );

    return (
        <div className="space-y-6">
            {/* Phase Fractions */}
            <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Beaker className="w-5 h-5 text-purple-400" />
                        Phase Fractions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={phaseFractions}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) =>
                                    `${name ?? ""} ${total ? ((Number(value) / total) * 100).toFixed(1) : "0.0"}%`
                                }
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {phaseFractions.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "1px solid #475569",
                                    borderRadius: "8px",
                                    color: "#fff",
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Phase Compositions */}
            <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50">
                <CardHeader>
                    <CardTitle className="text-white">Phase Compositions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {phaseCompositions.map((phase, index) => (
                            <div
                                key={phase.name}
                                className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                            >
                                <h4
                                    className="text-white font-semibold mb-3"
                                    style={{ color: COLORS[index % COLORS.length] }}
                                >
                                    {phase.name}
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(phase.composition).map(([element, value]) => (
                                        <div key={element} className="flex justify-between text-sm">
                                            <span className="text-slate-400">{element}:</span>
                                            <span className="text-white font-medium">
                        {value.toFixed(2)}%
                      </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Thermodynamic Properties */}
            <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50">
                <CardHeader>
                    <CardTitle className="text-white">Thermodynamic Properties</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        {properties &&
                            Object.entries(properties).map(([key, value]) => (
                                <div key={key} className="p-4 bg-slate-800/50 rounded-xl">
                                    <p className="text-slate-400 text-sm mb-1">
                                        {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </p>
                                    <p className="text-white text-xl font-bold">{value}</p>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EquilibriumResults;
