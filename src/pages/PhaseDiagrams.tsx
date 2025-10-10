// src/pages/PhaseDiagrams.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Play, Save, CheckCircle2 } from "lucide-react";

import ElementSelector from "../components/simulation/ElementSelector";
import TemperatureRange from "../components/simulation/TemperatureRange";
import PhaseDiagramChart from "../components/simulation/PhaseDiagramChart";
import ZoomableScatterPlot from "../components/simulation/ZoomableScatterPlot";
import InteractivePhaseDiagram from "../components/simulation/InteractivePhaseDiagram";

import CalculationDialog, {
    type PhaseDiagramResult,
} from "../components/simulation/CalculationDialog";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { trpc } from "../lib/trpc";

/** Local types to keep state tidy */
type TempRange = { min: number; max: number; unit?: string };

const PhaseDiagrams = () => {
    const [selectedElements, setSelectedElements] = useState<string[]>([]);
    const [temperatureRange, setTemperatureRange] = useState<TempRange>({
        min: 300,
        max: 2000,
        unit: "K",
    });

    const [showDialog, setShowDialog] = useState(false);
    const [calculationResults, setCalculationResults] = useState<PhaseDiagramResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // tRPC mutation to persist the calculation
    const createCalc = trpc.calculations.create.useMutation({
        onSuccess: () => {
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        },
    });

    const handleCalculate = () => {
        if (selectedElements.length < 2) {
            alert("Please select at least 2 elements");
            return;
        }
        setShowDialog(true);
    };

    const handleSave = async () => {
        if (!calculationResults) return;

        try {
            await createCalc.mutateAsync({
                calculation_type: "phase_diagram",
                title: `Phase Diagram - ${selectedElements.join("-")}`,
                elements: selectedElements,
                // If your server expects separate fields (temperature_min/max/unit),
                // swap this object to whatever your Zod input requires.
                temperature_range: temperatureRange,
                results: calculationResults, // JSON field
                status: "completed",
            });
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            alert("Failed to save calculation: " + msg);
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-xl bg-slate-900/40 border border-slate-700/50 rounded-2xl p-4 md:p-6"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Activity className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Phase Diagram Calculator</h1>
                        <p className="text-slate-400 text-sm md:text-base">Calculate binary and ternary phase equilibria</p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Input Panel */}
                <div className="lg:col-span-1 space-y-4 md:space-y-6">
                    <ElementSelector
                        selectedElements={selectedElements}
                        onSelectElements={setSelectedElements}
                    />

                    <TemperatureRange
                        range={temperatureRange}
                        onRangeChange={setTemperatureRange}
                    />

                    <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="text-white text-base md:text-lg">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                onClick={handleCalculate}
                                disabled={selectedElements.length < 2 || isCalculating}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-sm md:text-base h-auto py-2.5 md:py-3"
                            >
                                <Play className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="truncate">{isCalculating ? "Calculating..." : "Calculate Diagram"}</span>
                            </Button>

                            <Button
                                onClick={handleSave}
                                variant="outline"
                                className="w-full border-slate-600 text-white hover:bg-slate-800 hover:text-white text-sm md:text-base h-auto py-2.5 md:py-3"
                                disabled={!calculationResults || createCalc.isPending}
                            >
                                {saveSuccess ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0 text-green-400" />
                                        <span className="truncate text-green-400">Saved Successfully!</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2 flex-shrink-0" />
                                        <span className="truncate">{createCalc.isPending ? "Saving..." : "Save Calculation"}</span>
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                    <PhaseDiagramChart
                        results={calculationResults}
                        elements={selectedElements}
                        temperatureRange={temperatureRange}
                    />

                    {calculationResults && (
                        <>
                            <InteractivePhaseDiagram
                                results={calculationResults}
                                elements={selectedElements}
                            />

                            <ZoomableScatterPlot
                                data={calculationResults.scatterData}
                                elements={selectedElements}
                            />
                        </>
                    )}
                </div>
            </div>

            <CalculationDialog
                open={showDialog}
                onOpenChange={setShowDialog}
                elements={selectedElements}
                temperatureRange={temperatureRange}
                calculationType="phase_diagram"
                onResults={(results) => {
                    // Dialog returns a union type; here we know it's a phase-diagram result.
                    setCalculationResults(results as PhaseDiagramResult);
                    setIsCalculating(false);
                }}
                onCalculating={(running) => setIsCalculating(running)}
            />
        </div>
    );
}
export default PhaseDiagrams;
