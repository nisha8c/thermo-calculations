import { z } from "zod";

export const ProjectSchema = z.object({
    name: z.string().min(1, "Project name required"),
    description: z.string().optional(),
    system_type: z.enum(["binary", "ternary", "multicomponent"]),
    elements: z.array(z.string()).min(1),
    status: z.enum(["active", "completed", "archived"]).default("active")
});
export type ProjectInput = z.infer<typeof ProjectSchema>;

export const CalculationSchema = z.object({
    project_id: z.string().optional(), // can be linked later
    calculation_type: z.enum([
        "phase_diagram",
        "equilibrium",
        "property",
        "precipitation",
        "diffusion"
    ]),
    title: z.string().min(1),
    elements: z.array(z.string()).min(1),
    temperature_range: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
        unit: z.string().default("K").optional()
    }).optional(),
    pressure: z.number().optional(),
    composition: z.record(z.string(), z.number()).optional(),
    results: z.unknown().optional(),
    status: z.enum(["pending","running","completed","failed"]).default("pending")
});
export type CalculationInput = z.infer<typeof CalculationSchema>;
