import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectSchema, type ProjectInput } from "@contracts/core";

import { Textarea } from "../ui/textarea";

import {trpc} from "../../lib/trpc.tsx";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog.tsx";
import {Button} from "../ui/button.tsx";
import {Label} from "recharts";
import {Input} from "../ui/input.tsx";
import ElementSelector from "../simulation/ElementSelector.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select.tsx";

type Props = {
    open: boolean;
    onOpenChange: (o: boolean) => void;
    onProjectCreated?: () => void;
};

export default function CreateProjectDialog({ open, onOpenChange, onProjectCreated }: Props) {
    const utils = trpc.useUtils();
    const create = trpc.projects.create.useMutation({
        onSuccess: () => {
            utils.projects.list.invalidate();
            onProjectCreated?.();
            onOpenChange(false);
        },
    });

    const { register, handleSubmit, setValue, reset, watch, formState: { errors } } =
        useForm<ProjectInput>({
            resolver: zodResolver(ProjectSchema),
            defaultValues: { name: "", description: "", system_type: "binary", elements: [], status: "active" },
        });

    const selectedElements = watch("elements") || [];

    const onSelectElements = (elements: string[]) => {
        setValue("elements", elements, { shouldDirty: true, shouldValidate: true });
    };

    const onSubmit = async (data: ProjectInput) => {
        await create.mutateAsync(data);
        reset({ name: "", description: "", system_type: "binary", elements: [], status: "active" });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="backdrop-blur-xl bg-slate-900 border-slate-700 text-white max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Create New Project</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <Label className="text-slate-400">Project Name</Label>
                        <Input placeholder="e.g., Steel Alloy Analysis" className="bg-slate-800/50 border-slate-700 text-white mt-1"
                               {...register("name")} />
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Label className="text-slate-400">Description</Label>
                        <Textarea rows={3} placeholder="Brief description of the project"
                                  className="bg-slate-800/50 border-slate-700 text-white mt-1"
                                  {...register("description")} />
                    </div>

                    <div>
                        <Label className="text-slate-400">System Type</Label>
                        <Select
                            defaultValue="binary"
                            onValueChange={(v) =>
                                setValue("system_type", v as ProjectInput["system_type"], {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                })
                            }
                        >
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white mt-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                                <SelectItem value="binary">Binary System</SelectItem>
                                <SelectItem value="ternary">Ternary System</SelectItem>
                                <SelectItem value="multicomponent">Multicomponent System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <ElementSelector selectedElements={selectedElements} onSelectElements={onSelectElements} />
                    {errors.elements && <p className="text-xs text-red-500">{errors.elements.message as string}</p>}

                    <DialogFooter className="gap-3 pt-2">
                        <Button type="button" variant="outline" className="border-slate-600"
                                onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={create.isPending}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                            {create.isPending ? "Creating..." : "Create Project"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
