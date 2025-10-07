import Fastify from 'fastify'
import cors from '@fastify/cors'
import { initTRPC } from '@trpc/server'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { z } from 'zod'

type Context = {}
const createContext = async (): Promise<Context> => ({})

const t = initTRPC.context<Context>().create()

const appRouter = t.router({
    ping: t.procedure.query(() => 'pong'),
    calcPhase: t.procedure
        .input(z.object({ temperature: z.number(), composition: z.string() }))
        .query(({ input }) => ({ ...input, phase: 'FCC_A1', stable: true }))
})
export type AppRouter = typeof appRouter

const fastify = Fastify({ logger: true })

await fastify.register(cors, { origin: true })

await fastify.register(fastifyTRPCPlugin as any, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext }
})


fastify.get('/health', async () => ({ ok: true }))

const port = Number(process.env.PORT ?? 4000)
await fastify.listen({ port, host: '0.0.0.0' })
console.log(`API on http://localhost:${port}`)
