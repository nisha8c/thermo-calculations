// src/pages/Equilibrium.tsx
import { useState } from "react";
import { Beaker, Play, Save, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import ElementSelector from "../components/simulation/ElementSelector";
import CompositionInput from "../components/simulation/CompositionInput";
import EquilibriumResults from "../components/simulation/EquilibriumResults";
import CalculationDialog, {
    type EquilibriumResult,
} from "../components/simulation/CalculationDialog";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { trpc } from "../lib/trpc";

const Equilibrium = () => {
    const [selectedElements, setSelectedElements] = useState<string[]>([]);
    const [composition, setComposition] = useState<Record<string, number>>({});
    const [temperature, setTemperature] = useState<number>(1000);
    const [pressure, setPressure] = useState<number>(101325);
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const [calculationResults, setCalculationResults] = useState<EquilibriumResult | null>(null);
    const [isCalculating, setIsCalculating] = useState<boolean>(false);
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

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
                calculation_type: "equilibrium",
                title: `Equilibrium Calculation - ${selectedElements.join("-")} at ${temperature}K`,
                elements: selectedElements,
                temperature_range: { min: temperature, max: temperature, unit: "K" },
                pressure,
                composition,
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
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Beaker className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Equilibrium Calculator</h1>
                        <p className="text-slate-400 text-sm md:text-base">
                            Predict equilibrium phase compositions and fractions
                        </p>
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

                    <CompositionInput
                        elements={selectedElements}
                        composition={composition}
                        temperature={temperature}
                        pressure={pressure}
                        onCompositionChange={setComposition}
                        onTemperatureChange={setTemperature}
                        onPressureChange={setPressure}
                    />

                    <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                onClick={handleCalculate}
                                disabled={selectedElements.length < 2 || isCalculating}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 h-auto py-2.5 md:py-3"
                            >
                                <Play className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="truncate">
                  {isCalculating ? "Calculating..." : "Calculate Equilibrium"}
                </span>
                            </Button>

                            <Button
                                onClick={handleSave}
                                variant="outline"
                                className="w-full border-slate-600 text-white hover:bg-slate-800 hover:text-white h-auto py-2.5 md:py-3"
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
                      {createCalc.isPending ? "Saving..." : "Save Calculation"}
                    </span>
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-2">
                    <EquilibriumResults results={calculationResults} />
                </div>
            </div>

            <CalculationDialog
                open={showDialog}
                onOpenChange={setShowDialog}
                elements={selectedElements}
                composition={composition}
                temperature={temperature}
                pressure={pressure}
                calculationType="equilibrium"
                onResults={(results) => {
                    setCalculationResults(results as EquilibriumResult);
                    setIsCalculating(false);
                }}
                onCalculating={(status) => setIsCalculating(status)}
            />
        </div>
    );
}
export default Equilibrium;
