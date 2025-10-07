import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { ProjectSchema } from "@contracts/core";
import { prisma } from "../db/prisma.js";
import type { Prisma } from "@prisma/client";

const t = initTRPC.create();

export const projectsRouter = t.router({
    list: t.procedure.query(() =>
        prisma.project.findMany({
            orderBy: { createdAt: "desc" },
        })
    ),

    create: t.procedure.input(ProjectSchema).mutation(async ({ input }) => {
        const project = await prisma.project.create({
            data: {
                name: input.name,
                description: input.description ?? null,
                system_type: input.system_type,
                // elements is Json in Prisma → cast safely
                elements: input.elements, // string[] is valid JSON input
                status: input.status ?? "active",
            },
        });
        return project;
    }),

    byId: t.procedure.input(z.object({ id: z.string() })).query(({ input }) =>
        prisma.project.findUniqueOrThrow({ where: { id: input.id } })
    ),
});
