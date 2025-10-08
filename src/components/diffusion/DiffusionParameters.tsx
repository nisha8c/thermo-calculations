import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

import { Thermometer, Clock, Gauge } from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select.tsx";
import {Label} from "../ui/label.tsx";

type BoundaryCondition = "fixed" | "flux" | "infinite";

export type DiffusionParametersState = {
    temperature: number;             // Kelvin
    time: number;                    // seconds
    diffusion_coefficient: number;   // m^2/s
    interface_position: number;      // μm
    boundary_conditions: BoundaryCondition;
};

type Props = {
    parameters: DiffusionParametersState;
    onParametersChange: (next: DiffusionParametersState) => void;
};

const DiffusionParameters = ({ parameters, onParametersChange }: Props) => {
    const handleChange = <K extends keyof DiffusionParametersState>(
        field: K,
        value: DiffusionParametersState[K]
    ) => {
        onParametersChange({
            ...parameters,
            [field]: value,
        });
    };

    return (
        <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50">
            <CardHeader>
                <CardTitle className="text-white text-base md:text-lg flex items-center gap-2">
                    <Gauge className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                    Simulation Parameters
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label className="text-slate-400 text-sm flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-red-400" />
                        Temperature (K)
                    </Label>
                    <Input
                        type="number"
                        value={parameters.temperature}
                        onChange={(e) =>
                            handleChange("temperature", Number.isNaN(e.currentTarget.valueAsNumber)
                                ? parameters.temperature
                                : e.currentTarget.valueAsNumber)
                        }
                        className="bg-slate-800/50 border-slate-700 text-white mt-1"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        {(parameters.temperature - 273.15).toFixed(0)}°C
                    </p>
                </div>

                <div>
                    <Label className="text-slate-400 text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        Diffusion Time (seconds)
                    </Label>
                    <Input
                        type="number"
                        value={parameters.time}
                        onChange={(e) =>
                            handleChange("time", Number.isNaN(e.currentTarget.valueAsNumber)
                                ? parameters.time
                                : e.currentTarget.valueAsNumber)
                        }
                        className="bg-slate-800/50 border-slate-700 text-white mt-1"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        {(parameters.time / 3600).toFixed(2)} hours
                    </p>
                </div>

                <div>
                    <Label className="text-slate-400 text-sm">Diffusion Coefficient (m²/s)</Label>
                    <Input
                        type="number"
                        step="0.000000000001"
                        value={parameters.diffusion_coefficient}
                        onChange={(e) =>
                            handleChange(
                                "diffusion_coefficient",
                                Number.isNaN(e.currentTarget.valueAsNumber)
                                    ? parameters.diffusion_coefficient
                                    : e.currentTarget.valueAsNumber
                            )
                        }
                        className="bg-slate-800/50 border-slate-700 text-white mt-1"
                    />
                    <p className="text-xs text-slate-500 mt-1">Typical range: 10⁻¹⁵ to 10⁻⁹ m²/s</p>
                </div>

                <div>
                    <Label className="text-slate-400 text-sm">Interface Position (μm)</Label>
                    <Input
                        type="number"
                        value={parameters.interface_position}
                        onChange={(e) =>
                            handleChange("interface_position", Number.isNaN(e.currentTarget.valueAsNumber)
                                ? parameters.interface_position
                                : e.currentTarget.valueAsNumber)
                        }
                        className="bg-slate-800/50 border-slate-700 text-white mt-1"
                    />
                </div>

                <div>
                    <Label className="text-slate-400 text-sm">Boundary Conditions</Label>
                    <Select
                        value={parameters.boundary_conditions}
                        onValueChange={(value) =>
                            handleChange("boundary_conditions", value as BoundaryCondition)
                        }
                    >
                        <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white mt-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="fixed">Fixed Concentration</SelectItem>
                            <SelectItem value="flux">Fixed Flux</SelectItem>
                            <SelectItem value="infinite">Infinite Source</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}
export default DiffusionParameters;
