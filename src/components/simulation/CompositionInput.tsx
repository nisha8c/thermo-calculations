"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Scale, Thermometer, Gauge } from "lucide-react";

type Props = {
    elements: ReadonlyArray<string>;
    composition: Record<string, number>;
    temperature: number;
    pressure: number;
    onCompositionChange: (next: Record<string, number>) => void;
    onTemperatureChange: (next: number) => void;
    onPressureChange: (next: number) => void;
};

const CompositionInput = ({
                                             elements,
                                             composition,
                                             temperature,
                                             pressure,
                                             onCompositionChange,
                                             onTemperatureChange,
                                             onPressureChange,
                                         }: Props) => {
    const handleCompositionChange = (element: string, value: number) => {
        onCompositionChange({
            ...composition,
            [element]: Number.isNaN(value) ? 0 : value,
        });
    };

    return (
        <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Scale className="w-5 h-5 text-purple-400" />
                    Composition &amp; Conditions
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {elements.map((element) => (
                    <div key={element}>
                        <Label className="text-slate-400 text-sm">{element} (wt%)</Label>
                        <Input
                            type="number"
                            min={0}
                            max={100}
                            step={0.1}
                            value={composition[element] ?? ""}
                            onChange={(e) =>
                                handleCompositionChange(element, e.currentTarget.valueAsNumber)
                            }
                            className="bg-slate-800/50 border-slate-700 text-white mt-1"
                            placeholder="0.00"
                            inputMode="decimal"
                        />
                    </div>
                ))}

                <div className="pt-4 border-t border-slate-700/50 space-y-4">
                    <div>
                        <Label className="text-slate-400 text-sm flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-red-400" />
                            Temperature (K)
                        </Label>
                        <Input
                            type="number"
                            value={temperature}
                            onChange={(e) =>
                                onTemperatureChange(
                                    Number.isNaN(e.currentTarget.valueAsNumber)
                                        ? temperature
                                        : e.currentTarget.valueAsNumber
                                )
                            }
                            className="bg-slate-800/50 border-slate-700 text-white mt-1"
                            inputMode="numeric"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            {(temperature - 273.15).toFixed(0)}°C
                        </p>
                    </div>

                    <div>
                        <Label className="text-slate-400 text-sm flex items-center gap-2">
                            <Gauge className="w-4 h-4 text-blue-400" />
                            Pressure (Pa)
                        </Label>
                        <Input
                            type="number"
                            value={pressure}
                            onChange={(e) =>
                                onPressureChange(
                                    Number.isNaN(e.currentTarget.valueAsNumber)
                                        ? pressure
                                        : e.currentTarget.valueAsNumber
                                )
                            }
                            className="bg-slate-800/50 border-slate-700 text-white mt-1"
                            inputMode="numeric"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            {(pressure / 101325).toFixed(2)} atm
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default CompositionInput;