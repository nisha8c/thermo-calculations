import * as React from "react";
import { Thermometer } from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card.tsx";
import {Label} from "recharts";
import {Input} from "../ui/input.tsx";

type TemperatureRangeValue = {
    min: number;
    max: number;
};

type Props = {
    range: TemperatureRangeValue;
    onRangeChange: (next: TemperatureRangeValue) => void;
};

const TemperatureRange = ({ range, onRangeChange }: Props) => {
    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.currentTarget.valueAsNumber;
        onRangeChange({ ...range, min: Number.isNaN(v) ? range.min : v });
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.currentTarget.valueAsNumber;
        onRangeChange({ ...range, max: Number.isNaN(v) ? range.max : v });
    };

    return (
        <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-red-400" />
                    Temperature Range
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label className="text-slate-400 text-sm">Minimum (K)</Label>
                    <Input
                        type="number"
                        value={range.min}
                        onChange={handleMinChange}
                        className="bg-slate-800/50 border-slate-700 text-white mt-1"
                    />
                </div>
                <div>
                    <Label className="text-slate-400 text-sm">Maximum (K)</Label>
                    <Input
                        type="number"
                        value={range.max}
                        onChange={handleMaxChange}
                        className="bg-slate-800/50 border-slate-700 text-white mt-1"
                    />
                </div>
                <div className="pt-2 border-t border-slate-700/50">
                    <p className="text-sm text-slate-400">
                        Range: {range.min}K - {range.max}K
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        ({(range.min - 273.15).toFixed(0)}°C - {(range.max - 273.15).toFixed(0)}°C)
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
export default TemperatureRange;
