import Fastify from 'fastify';
import cors from '@fastify/cors';
import { initTRPC } from '@trpc/server';
import {fastifyTRPCPlugin, FastifyTRPCPluginOptions} from '@trpc/server/adapters/fastify';
import { z } from 'zod';
import { projectsRouter } from './routers/projects.js';
import { calculationsRouter } from './routers/calculations.js';

type Context = Record<string, never>;
const createContext = async (): Promise<Context> => ({});
const t = initTRPC.context<Context>().create();

const appRouter = t.router({
    ping: t.procedure.query(() => 'pong'),
    calcPhase: t.procedure
        .input(z.object({ temperature: z.number(), composition: z.string() }))
        .query(({ input }) => ({ ...input, phase: 'FCC_A1', stable: true })),
    projects: projectsRouter,
    calculations: calculationsRouter,
});
export type AppRouter = typeof appRouter;

const fastify = Fastify({ logger: true });
await fastify.register(cors, { origin: true });

const trpcPluginOpts = {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext },
} satisfies FastifyTRPCPluginOptions<typeof appRouter>;

await fastify.register(fastifyTRPCPlugin, trpcPluginOpts);

fastify.get('/health', async () => ({ ok: true }));
fastify.get('/projects', async () => ({ items: [] })); // simple REST showcase


const port = Number(process.env.PORT ?? 4000);
await fastify.listen({ port, host: '0.0.0.0' });
console.log(`API on http://localhost:${port}`);
