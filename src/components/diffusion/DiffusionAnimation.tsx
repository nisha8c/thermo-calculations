"use client";

import * as React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import {Card, CardContent, CardHeader, CardTitle} from "../ui/card.tsx";
import {Button} from "../ui/button.tsx";

type Props = {
    /** not used in the current UI, kept for future use */
    results?: unknown;
    /** exactly two element symbols/names */
    elements: Readonly<[string, string]>;
};

type Particle = {
    id: number;
    x: number;       // percentage (0–100)
    y: number;       // percentage (0–100)
    element: string; // which element this particle represents
    opacity: number; // 0–1
};

const DiffusionAnimation = ({ results: _results, elements }: Props) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [currentFrame, setCurrentFrame] = React.useState(0);
    const totalFrames = 50;

    React.useEffect(() => {
        let interval: number | undefined;

        if (isPlaying) {
            interval = window.setInterval(() => {
                setCurrentFrame((prev) => {
                    if (prev >= totalFrames - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 100);
        }

        return () => {
            if (interval !== undefined) window.clearInterval(interval);
        };
    }, [isPlaying, totalFrames]);

    const handleReset = () => {
        setCurrentFrame(0);
        setIsPlaying(false);
    };

    const getParticlePositions = (): Particle[] => {
        const particles: Particle[] = [];
        const progress = currentFrame / totalFrames;

        for (let i = 0; i < 30; i++) {
            const baseX = (i / 30) * 100;
            const diffusion = progress * 50 * Math.random();
            particles.push({
                id: i,
                x: baseX,
                y: 50 + (Math.random() - 0.5) * 40 + diffusion * (Math.random() - 0.5),
                element: i < 15 ? elements[0] : elements[1],
                opacity: 0.3 + progress * 0.7,
            });
        }
        return particles;
    };

    return (
        <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50">
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle className="text-white text-base md:text-lg">
                        Diffusion Animation
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsPlaying((p) => !p)}
                            className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:text-white h-auto py-2"
                            type="button"
                        >
                            {isPlaying ? (
                                <>
                                    <Pause className="w-4 h-4 mr-1.5" />
                                    <span className="hidden sm:inline">Pause</span>
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 mr-1.5" />
                                    <span className="hidden sm:inline">Play</span>
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                            className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700 hover:text-white h-auto py-2 px-3"
                            title="Reset"
                            type="button"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative h-64 md:h-80 bg-slate-950/50 rounded-xl border border-slate-700/50 overflow-hidden">
                    {/* Interface line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-cyan-500/50" />

                    {/* Labels */}
                    <div className="absolute top-4 left-4 text-blue-400 font-semibold text-sm">
                        {elements[0]} Rich
                    </div>
                    <div className="absolute top-4 right-4 text-purple-400 font-semibold text-sm">
                        {elements[1]} Rich
                    </div>

                    {/* Animated particles */}
                    {getParticlePositions().map((particle) => (
                        <motion.div
                            key={particle.id}
                            animate={{
                                left: `${particle.x}%`,
                                top: `${particle.y}%`,
                                opacity: particle.opacity,
                            }}
                            transition={{ duration: 0.1 }}
                            className={`absolute w-2 h-2 rounded-full ${
                                particle.element === elements[0] ? "bg-blue-500" : "bg-purple-500"
                            }`}
                            style={{ transform: "translate(-50%, -50%)" }}
                        />
                    ))}

                    {/* Progress indicator */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-100"
                                style={{ width: `${(currentFrame / totalFrames) * 100}%` }}
                            />
                        </div>
                        <p className="text-slate-300 text-xs mt-2 text-center font-medium">
                            Time: {((currentFrame / totalFrames) * 100).toFixed(0)}% of total diffusion time
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
export default DiffusionAnimation;
