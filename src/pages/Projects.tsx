// thermo-calculations/src/pages/Projects.tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../lib/trpc";
import { ProjectSchema, type ProjectInput } from "@contracts/core";

export default function Projects() {
    const utils = trpc.useUtils();
    const list = trpc.projects.list.useQuery();
    const create = trpc.projects.create.useMutation({
        onSuccess: () => utils.projects.list.invalidate()
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectInput>({
        resolver: zodResolver(ProjectSchema),
        defaultValues: { status: "active", system_type: "binary", elements: [] }
    });

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Projects</h1>

            <form
                className="grid gap-3 max-w-xl"
                onSubmit={handleSubmit(async (data) => {
                    await create.mutateAsync({ ...data, elements: data.elements.filter(Boolean) });
                    reset();
                })}
            >
                <input className="input" placeholder="Name" {...register("name")} />
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}

                <input className="input" placeholder="Description" {...register("description")} />

                <select className="input" {...register("system_type")}>
                    <option value="binary">binary</option>
                    <option value="ternary">ternary</option>
                    <option value="multicomponent">multicomponent</option>
                </select>

                <input
                    className="input"
                    placeholder="Elements (comma separated, e.g. Fe,C)"
                    onBlur={(e) => {
                        const arr = e.currentTarget.value.split(",").map(s => s.trim()).filter(Boolean);
                        // @ts-ignore small trick to set array without controller:
                        e.target.form?.elements["elements"]?.value = "";
                        // store locally in hidden input
                    }}
                />
                {/* Hidden array capture */}
                <input type="hidden" {...register("elements")} />

                <button className="btn" type="submit" disabled={create.isPending}>
                    {create.isPending ? "Creating..." : "Create Project"}
                </button>
            </form>

            <div className="grid gap-2">
                {list.data?.map(p => (
                    <div key={p.id} className="rounded-xl border border-slate-700 p-4 bg-slate-900/40">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-sm text-slate-400">{p.system_type} • {p.status}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
