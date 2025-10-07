import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { CalculationSchema } from "@contracts/core";
import { prisma } from "../db/prisma.js";

const t = initTRPC.create();

export const calculationsRouter = t.router({
    list: t.procedure.query(() =>
        prisma.calculation.findMany({
            orderBy: { createdAt: "desc" },
        })
    ),

    create: t.procedure.input(CalculationSchema).mutation(async ({ input }) => {
        const calc = await prisma.calculation.create({
            data: {
                project_id: input.project_id ?? null,
                calculation_type: input.calculation_type,
                title: input.title,
                elements: input.elements,
                temperature_min: input.temperature_range?.min ?? null,
                temperature_max: input.temperature_range?.max ?? null,
                temperature_unit: input.temperature_range?.unit ?? "K",
                pressure: input.pressure ?? null,
                composition: input.composition ?? undefined,
                results: input.results ?? undefined,
                status: input.status ?? "pending",
            },
        });
        return calc;
    }),

    byId: t.procedure.input(z.object({ id: z.string() })).query(({ input }) =>
        prisma.calculation.findUniqueOrThrow({ where: { id: input.id } })
    ),
});
