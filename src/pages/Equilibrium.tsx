// thermo-calculations/src/pages/Equilibrium.tsx
import React from "react";
import { trpc } from "../lib/trpc";

export default function Equilibrium() {
    const [T, setT] = React.useState(1200);
    const [comp, setComp] = React.useState("Fe-0.8%C");
    const { data, refetch, isFetching } = trpc.calcPhase.useQuery(
        { temperature: T, composition: comp },
        { enabled: false }
    );

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Equilibrium</h1>
            <div className="grid gap-3 max-w-md">
                <input className="input" type="number" value={T} onChange={e=>setT(Number(e.target.value))} />
                <input className="input" value={comp} onChange={e=>setComp(e.target.value)} />
                <button className="btn" onClick={()=>refetch()} disabled={isFetching}>
                    {isFetching ? "Calculating..." : "Run"}
                </button>
            </div>
            {data && (
                <pre className="text-xs bg-slate-900/60 p-3 rounded">{JSON.stringify(data, null, 2)}</pre>
            )}
        </div>
    );
}
