import { useState } from "react";
import { Atom, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {Button} from "../ui/button.tsx";
import {Badge} from "../ui/badge.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "../ui/dialog.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card.tsx";

type Category = "metal" | "nonmetal" | "metalloid";

interface ElementInfo {
    symbol: string;
    name: string;
    category: Category;
}

const COMMON_ELEMENTS: ReadonlyArray<ElementInfo> = [
    { symbol: "Fe", name: "Iron", category: "metal" },
    { symbol: "C", name: "Carbon", category: "nonmetal" },
    { symbol: "Cr", name: "Chromium", category: "metal" },
    { symbol: "Ni", name: "Nickel", category: "metal" },
    { symbol: "Al", name: "Aluminum", category: "metal" },
    { symbol: "Cu", name: "Copper", category: "metal" },
    { symbol: "Mn", name: "Manganese", category: "metal" },
    { symbol: "Si", name: "Silicon", category: "metalloid" },
    { symbol: "Ti", name: "Titanium", category: "metal" },
    { symbol: "V", name: "Vanadium", category: "metal" },
    { symbol: "Mo", name: "Molybdenum", category: "metal" },
    { symbol: "W", name: "Tungsten", category: "metal" },
    { symbol: "Co", name: "Cobalt", category: "metal" },
    { symbol: "Zn", name: "Zinc", category: "metal" },
    { symbol: "Mg", name: "Magnesium", category: "metal" },
    { symbol: "N", name: "Nitrogen", category: "nonmetal" },
    { symbol: "O", name: "Oxygen", category: "nonmetal" },
    { symbol: "S", name: "Sulfur", category: "nonmetal" },
] as const;

type CategoryColors = Record<Category, string>;

const categoryColors: CategoryColors = {
    metal: "from-blue-500 to-cyan-500",
    nonmetal: "from-green-500 to-emerald-500",
    metalloid: "from-purple-500 to-pink-500",
};

export interface ElementSelectorProps {
    selectedElements: string[];
    onSelectElements: (next: string[]) => void;
}

const ElementSelector = ({
                                            selectedElements,
                                            onSelectElements,
                                        }: ElementSelectorProps) => {
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const toggleElement = (symbol: string) => {
        if (selectedElements.includes(symbol)) {
            onSelectElements(selectedElements.filter((el) => el !== symbol));
        } else if (selectedElements.length < 5) {
            onSelectElements([...selectedElements, symbol]);
        }
    };

    return (
        <>
            <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                        <Atom className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                        Element Selection
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {selectedElements.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            <AnimatePresence>
                                {selectedElements.map((element) => {
                                    const elementData = COMMON_ELEMENTS.find(
                                        (e) => e.symbol === element
                                    );
                                    const colorKey: Category =
                                        elementData?.category ?? "metal";

                                    return (
                                        <motion.div
                                            key={element}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                        >
                                            <Badge
                                                className={`bg-gradient-to-r ${categoryColors[colorKey]} text-white border-0 px-3 py-1`}
                                            >
                                                {element}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleElement(element)}
                                                    className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                                    aria-label={`Remove ${element}`}
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}

                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowDialog(true);
                        }}
                        variant="outline"
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                        <Atom className="w-4 h-4 mr-2" />
                        {selectedElements.length > 0 ? "Modify Selection" : "Select Elements"}
                    </Button>

                    <p className="text-xs text-slate-500">
                        Selected: {selectedElements.length}/5 elements
                    </p>
                </CardContent>
            </Card>

            <Dialog open={showDialog} onOpenChange={setShowDialog} modal={false}>
                <DialogContent
                    data-element-dialog
                    className="backdrop-blur-xl bg-slate-900 border-slate-700 text-white max-w-xl mx-4 md:max-w-2xl"
                    onPointerDownOutside={(e) => {
                        // Only close element selector, not parent
                        const target = e.target as HTMLElement;
                        if (target.closest('[role="dialog"]') && target !== e.currentTarget) {
                            e.preventDefault();
                        }
                    }}
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.stopPropagation()}
                >
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg md:text-xl">
                            <Atom className="w-5 h-5 text-blue-400" />
                            Select Elements
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-3 py-4 max-h-[60vh] overflow-y-auto">
                        {COMMON_ELEMENTS.map((element) => {
                            const isSelected = selectedElements.includes(element.symbol);
                            return (
                                <motion.button
                                    key={element.symbol}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleElement(element.symbol)}
                                    className={`p-3 md:p-4 rounded-lg md:rounded-xl border-2 transition-all ${
                                        isSelected
                                            ? `bg-gradient-to-br ${categoryColors[element.category]} border-transparent shadow-lg`
                                            : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                                    }`}
                                    type="button"
                                    aria-pressed={isSelected}
                                    aria-label={`Toggle ${element.name}`}
                                >
                                    <div className="text-lg md:text-2xl font-bold mb-1">
                                        {element.symbol}
                                    </div>
                                    <div className="text-[10px] md:text-xs opacity-80">
                                        {element.name}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ElementSelector;