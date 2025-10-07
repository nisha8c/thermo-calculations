import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import React from "react";

// Import types from server (best via the build output or a shared types pkg).
// For now reference the server's TS directly:
import type { AppRouter } from "../../server/src/index.ts";

export const trpc = createTRPCReact<AppRouter>();

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/trpc";
const queryClient = new QueryClient();

export function TRPCProvider(props: { children: React.ReactNode }) {
    const trpcClient = React.useMemo(
        () =>
            trpc.createClient({
                links: [
                    loggerLink(),
                    httpBatchLink({ url: API_URL })
                ]
            }),
        []
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        </trpc.Provider>
    );
}
