import { useState } from "react";
import { Wind, Play, Save, Info, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import ElementSelector from "../components/simulation/ElementSelector";
import DiffusionParameters, {
    type DiffusionParametersState,
} from "../components/diffusion/DiffusionParameters";
import DiffusionProfile from "../components/diffusion/DiffusionProfile";
import DiffusionAnimation from "../components/diffusion/DiffusionAnimation";
import CalculationDialog, {
    // If you exported these types in CalculationDialog, import them:
    type DiffusionResult,
} from "../components/simulation/CalculationDialog";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { trpc } from "../lib/trpc";

export default function Diffusion() {
    const [selectedElements, setSelectedElements] = useState<string[]>([]);

    const [parameters, setParameters] = useState<DiffusionParametersState>({
        temperature: 1200,
        time: 3600,
        interface_position: 0,
        diffusion_coefficient: 1e-12,
        boundary_conditions: "fixed",
    });

    const [showDialog, setShowDialog] = useState(false);

    const [calculationResults, setCalculationResults] = useState<DiffusionResult | null>(null);

    const [isCalculating, setIsCalculating] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const createCalc = trpc.calculations.create.useMutation({
        onSuccess: () => {
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        },
    });

    const handleCalculate = () => {
        if (selectedElements.length < 2) {
            alert("Please select at least 2 elements for diffusion simulation");
            return;
        }
        setShowDialog(true);
    };

    const handleSave = async () => {
        if (!calculationResults) return;

        try {
            await createCalc.mutateAsync({
                calculation_type: "diffusion",
                title: `Diffusion Simulation - ${selectedElements.join("-")} at ${parameters.temperature}K`,
                elements: selectedElements,
                temperature_range: {
                    min: parameters.temperature,
                    max: parameters.temperature,
                    unit: "K",
                },
                pressure: 101325,
                composition: { time: parameters.time },
                results: calculationResults, // JSON field
                status: "completed",
            });
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            alert("Failed to save simulation: " + msg);
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
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <Wind className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Diffusion Simulator</h1>
                        <p className="text-slate-400 text-sm md:text-base">
                            Model diffusion-controlled transformations (DICTRA)
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Info Card */}
            <Card className="backdrop-blur-xl bg-slate-800/60 border-cyan-500/30">
                <CardContent className="p-4 md:p-6">
                    <div className="flex gap-3">
                        <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm md:text-base">
                            <p className="font-semibold text-white mb-2">Diffusion Simulation</p>
                            <p className="text-slate-200">
                                Simulates atomic diffusion across interfaces using Fick&apos;s laws. Model
                                carburization, decarburization, homogenization, and other diffusion-controlled processes in materials.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Input Panel */}
                <div className="lg:col-span-1 space-y-4 md:space-y-6">
                    <ElementSelector
                        selectedElements={selectedElements}
                        onSelectElements={setSelectedElements}
                    />

                    <DiffusionParameters parameters={parameters} onParametersChange={setParameters} />

                    <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="text-white text-base md:text-lg">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                onClick={handleCalculate}
                                disabled={selectedElements.length < 2 || isCalculating}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-sm md:text-base h-auto py-2.5 md:py-3"
                            >
                                <Play className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="truncate">
                  {isCalculating ? "Simulating..." : "Run Simulation"}
                </span>
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
                                        <span className="truncate">
                      {createCalc.isPending ? "Saving..." : "Save Simulation"}
                    </span>
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                    <DiffusionProfile
                        results={calculationResults}
                        elements={selectedElements}
                        parameters={parameters}
                    />

                    {/* Pass a 2-tuple to DiffusionAnimation */}
                    {calculationResults && selectedElements.length >= 2 && (
                        <DiffusionAnimation
                            results={calculationResults}
                            elements={[selectedElements[0], selectedElements[1]] as [string, string]}
                        />
                    )}
                </div>
            </div>

            <CalculationDialog
                open={showDialog}
                onOpenChange={setShowDialog}
                elements={selectedElements}
                parameters={parameters}
                calculationType="diffusion"
                onResults={(results) => {
                    // In this page we only expect diffusion results
                    // If your CalculationDialog exports DiffusionResult, you can assert here:
                    setCalculationResults(results as DiffusionResult);
                    setIsCalculating(false);
                }}
                onCalculating={(status) => setIsCalculating(status)}
            />
        </div>
    );
}
