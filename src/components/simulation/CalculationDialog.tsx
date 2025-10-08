import { useState } from "react";

import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

/* ---------- Types ---------- */
type TemperatureRange = { min: number; max: number; unit?: string };

export type CalculationType = "phase_diagram" | "diffusion" | "equilibrium" | "property";

export type DiffusionParameters = {
    temperature?: number;
    time?: number;
    diffusion_coefficient?: number;
    interface_position?: number; // normalized position in this mock
};

export type PropertyParameters = {
    properties?: string[];
};

export type CalculationParameters = DiffusionParameters & PropertyParameters;

/* Result types (based on the mock generators below) */
export type PhaseDiagramResult = {
    phaseData: Array<{ composition: number; liquidus: number; solidus: number }>;
    scatterData: Array<{ x: number; y: number; phase: "liquid" | "mixed" | "solid"; size: number }>;
    phases: { liquid: string; mixed: string; solid: string };
};

export type DiffusionResult = {
    profileData: Array<{ position: number; concentration: number }>;
    penetration_depth: string;         // e.g., "123.4 µm"
    flux_rate: string;                 // e.g., "1.23× baseline"
    interface_concentration: string;   // numeric string
    meta: { T: number; t: number; D: number };
};

export type EquilibriumResult = {
    phaseFractions: Array<{ name: string; value: number }>;
    phaseCompositions: Array<{ name: string; composition: Record<string, number> }>;
    properties: {
        gibbs_energy: string;   // e.g., "-12.34 kJ/mol"
        enthalpy: string;       // e.g., "1234 J/mol"
        entropy: string;        // e.g., "12.34 J/mol·K"
    };
    conditions: { T: number; P: number; composition: Record<string, number> };
};

export type PropertyResult = {
    properties: Array<{ name: string; value: string; unit: string }>;
    at: { T: number };
};

export type CalculationResult =
    | PhaseDiagramResult
    | DiffusionResult
    | EquilibriumResult
    | PropertyResult;

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    elements: string[];
    calculationType: CalculationType;
    // Optional context depending on calc type
    temperatureRange?: TemperatureRange;
    composition?: Record<string, number>;
    temperature?: number;
    pressure?: number;
    parameters?: CalculationParameters;
    onResults: (results: CalculationResult) => void;
    onCalculating: (running: boolean) => void;
};

const CalculationDialog = ({
                               open,
                               onOpenChange,
                               elements,
                               temperatureRange,
                               composition,
                               temperature,
                               pressure,
                               parameters,
                               calculationType,
                               onResults,
                               onCalculating,
                           }: Props) => {
    const [status, setStatus] = useState<"idle" | "running" | "completed" | "error">("idle");
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    /** --------- Local result generators (mock but consistent) --------- */
    const genPhaseDiagram = (): PhaseDiagramResult => {
        const minT = temperatureRange?.min ?? 900;
        const maxT = temperatureRange?.max ?? 1800;
        const n = 41;
        const phaseData = Array.from({ length: n }, (_, i) => {
            const x = (i / (n - 1)) * 100; // composition %
            const curve = Math.sin((x / 100) * Math.PI) * 0.15; // small hump
            const liquidus = maxT - (maxT - minT) * (x / 100) * (0.7 + curve);
            const solidus = minT + (maxT - minT) * 0.15 * Math.cos((x / 100) * Math.PI) + 20;
            return {
                composition: Number(x.toFixed(1)),
                liquidus: Number(liquidus.toFixed(1)),
                solidus: Number(solidus.toFixed(1)),
            };
        });

        const scatterData: PhaseDiagramResult["scatterData"] = Array.from({ length: 60 }, () => {
            const x = Math.random() * 100;
            const y =
                minT +
                (maxT - minT) * (0.2 + 0.6 * Math.random()); // spread in the central band
            const phase: "liquid" | "mixed" | "solid" =
                y > (minT + maxT) / 2 ? "liquid" : y > minT + (maxT - minT) * 0.35 ? "mixed" : "solid";
            return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)), phase, size: 2 + Math.random() * 4 };
        });

        return {
            phaseData,
            scatterData,
            phases: { liquid: "LIQUID", mixed: "LIQ+SOL", solid: "SOLID" },
        };
    };

    const genDiffusion = (): DiffusionResult => {
        // 1D profile -0.5..0.5 (normalized), interface near parameters.interface_position
        const T = parameters?.temperature ?? temperature ?? 1200;
        const t = parameters?.time ?? 3600;
        const D = parameters?.diffusion_coefficient ?? 1e-12;
        const x0 = parameters?.interface_position ?? 0;
        const n = 101;
        const profileData = Array.from({ length: n }, (_, i) => {
            const x = -0.5 + i / (n - 1); // -0.5..0.5
            // Smooth step across interface with width ~ sqrt(D*t)
            const width = Math.max(1e-6, Math.sqrt(Math.max(D * t, 1e-20)));
            const concentration = 0.5 * (1 + Math.tanh((x - x0) / (5 * width)));
            return { position: Number((x + 0.5).toFixed(4)), concentration: Number(concentration.toFixed(4)) };
        });

        return {
            profileData,
            penetration_depth: `${(5 * Math.sqrt(D * t) * 1e6).toFixed(1)} µm`,
            flux_rate: `${(D / 1e-12).toFixed(2)}× baseline`,
            interface_concentration: `${profileData[Math.round(n / 2)].concentration}`,
            meta: { T, t, D },
        };
    };

    const genEquilibrium = (): EquilibriumResult => {
        const T = temperature ?? temperatureRange?.min ?? 1200;
        const P = pressure ?? 101325;
        // simple two/three-phase split with totals = 1
        const a = Math.random() * 0.6 + 0.2;
        const b = (1 - a) * (Math.random() * 0.7);
        const c = 1 - a - b;
        const names = c > 0.1 ? ["FCC_A1", "BCC_A2", "LIQUID"] : ["FCC_A1", "LIQUID"];

        const phaseFractions = names.map((n, i) => ({
            name: n,
            value: Number([a, b, c][i] ?? 0),
        }));

        const elems = elements.length ? elements : ["Fe", "C"];
        const phaseCompositions = names.map((n) => ({
            name: n,
            composition: Object.fromEntries(
                elems.map((el) => [el, Number((Math.random() * 0.8 + 0.1).toFixed(3))])
            ),
        }));

        return {
            phaseFractions,
            phaseCompositions,
            properties: {
                gibbs_energy: `${(-1 * (T / 1000) * (Math.random() * 50 + 10)).toFixed(2)} kJ/mol`,
                enthalpy: `${(T * (Math.random() * 0.05 + 0.9)).toFixed(0)} J/mol`,
                entropy: `${(Math.random() * 25 + 10).toFixed(2)} J/mol·K`,
            },
            conditions: { T, P, composition: composition ?? {} },
        };
    };

    const genProperty = (): PropertyResult => {
        const T = temperature ?? 1200;
        const wanted: string[] = parameters?.properties ?? [
            "Gibbs energy",
            "Heat capacity",
            "Thermal conductivity",
        ];
        const unitFor = (name: string) =>
            /gibbs|energy/i.test(name)
                ? "kJ/mol"
                : /heat capacity|cp/i.test(name)
                    ? "J/mol·K"
                    : /thermal/i.test(name)
                        ? "W/m·K"
                        : "SI";

        const valFor = (name: string) =>
            /gibbs|energy/i.test(name)
                ? (Math.random() * -60 - 20).toFixed(2)
                : /heat capacity|cp/i.test(name)
                    ? (Math.random() * 40 + 10).toFixed(2)
                    : /thermal/i.test(name)
                        ? (Math.random() * 40 + 10).toFixed(1)
                        : (Math.random() * 100).toFixed(2);

        return {
            properties: wanted.map((name) => ({
                name,
                value: valFor(name),
                unit: unitFor(name),
            })),
            at: { T },
        };
    };

    /** ---------------- Run “calculation” with progress ---------------- */
    const runCalculation = async () => {
        try {
            setStatus("running");
            setProgress(0);
            setError(null);
            onCalculating(true);

            const interval = window.setInterval(() => {
                setProgress((p) => (p < 90 ? p + 10 : p));
            }, 300);

            // pretend to compute
            await new Promise((r) => setTimeout(r, 2200));

            let result: CalculationResult;
            if (calculationType === "phase_diagram") result = genPhaseDiagram();
            else if (calculationType === "diffusion") result = genDiffusion();
            else if (calculationType === "equilibrium") result = genEquilibrium();
            else result = genProperty();

            window.clearInterval(interval);
            setProgress(100);
            setStatus("completed");
            onResults(result);
            onCalculating(false);

            // Close after a short success state
            window.setTimeout(() => {
                onOpenChange(false);
                setStatus("idle");
                setProgress(0);
            }, 1200);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            setStatus("error");
            onCalculating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="backdrop-blur-xl bg-slate-900 border-slate-700 text-white max-w-md mx-4 md:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg md:text-xl">Running Calculation</DialogTitle>
                </DialogHeader>

                <div className="py-4 md:py-6 space-y-4 md:space-y-6">
                    <AnimatePresence mode="wait">
                        {status === "idle" && (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center space-y-4"
                            >
                                <p className="text-slate-400">
                                    Ready to calculate {calculationType.replace("_", " ")} for:
                                </p>
                                <div className="flex gap-2 justify-center flex-wrap">
                                    {elements.map((el) => (
                                        <span
                                            key={el}
                                            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30"
                                        >
                      {el}
                    </span>
                                    ))}
                                </div>
                                <Button
                                    onClick={runCalculation}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 mt-4"
                                >
                                    Start Calculation
                                </Button>
                            </motion.div>
                        )}

                        {status === "running" && (
                            <motion.div
                                key="running"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-center">
                                    <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Progress</span>
                                        <span className="text-white font-medium">{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                </div>
                                <p className="text-center text-slate-400 text-sm">
                                    {calculationType === "property"
                                        ? "Calculating thermodynamic properties..."
                                        : "Minimizing Gibbs energy and calculating phase equilibria..."}
                                </p>
                            </motion.div>
                        )}

                        {status === "completed" && (
                            <motion.div
                                key="completed"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center space-y-4"
                            >
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Calculation Complete!</h3>
                                    <p className="text-slate-400">Results are ready</p>
                                </div>
                            </motion.div>
                        )}

                        {status === "error" && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center space-y-4"
                            >
                                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                                    <AlertCircle className="w-10 h-10 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Calculation Failed</h3>
                                    <p className="text-slate-400">{error}</p>
                                </div>
                                <Button onClick={() => setStatus("idle")} variant="outline" className="border-slate-600">
                                    Try Again
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CalculationDialog;
