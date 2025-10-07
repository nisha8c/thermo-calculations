import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { ProjectSchema } from "@contracts/core";
import { prisma } from "../db/prisma.js";

const t = initTRPC.create();

export const projectsRouter = t.router({
    list: t.procedure.query(() =>
        prisma.project.findMany({
            orderBy: { createdAt: "desc" },
        })
    ),

    create: t.procedure.input(ProjectSchema).mutation(async ({ input }) => {
        return prisma.project.create({
            data: {
                name: input.name,
                description: input.description ?? null,
                system_type: input.system_type,
                elements: input.elements,
                status: input.status ?? "active",
            },
        });
    }),

    // update
    update: t.procedure
        .input(
            z.object({
                id: z.string(),
                data: ProjectSchema.partial(),
            })
        )
        .mutation(({ input }) =>
            prisma.project.update({
                where: { id: input.id },
                data: {
                    ...input.data,
                    // allow omitting fields
                    description: input.data.description ?? undefined,
                    elements: input.data.elements ?? undefined,
                    status: input.data.status ?? undefined,
                },
            })
        ),

    // delete
    delete: t.procedure
        .input(z.object({ id: z.string() }))
        .mutation(({ input }) => prisma.project.delete({ where: { id: input.id } })),

    byId: t.procedure
        .input(z.object({ id: z.string() }))
        .query(({ input }) =>
            prisma.project.findUniqueOrThrow({ where: { id: input.id } })
        ),
});
