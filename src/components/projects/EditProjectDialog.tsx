import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectSchema } from "@contracts/core";

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select.tsx";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";


import {trpc} from "../../lib/trpc.tsx";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "../ui/dialog.tsx";
import {Button} from "../ui/button.tsx";
import {Label} from "recharts";
import ElementSelector from "../simulation/ElementSelector.tsx";

const EditSchema = z.object({
    id: z.string(),
    data: ProjectSchema.partial(),
});
type EditInput = z.infer<typeof EditSchema>;

type ProjectItem = {
    id: string;
    name: string;
    description: string | null;
    system_type: "binary" | "ternary" | "multicomponent";
    elements: string[];
    status: "active" | "completed" | "archived";
};

type Props = {
    open: boolean;
    onOpenChange: (o: boolean) => void;
    project: ProjectItem | null;
    onProjectUpdated?: () => void;
};

// Allowed unions
const SYSTEM_TYPES = ["binary", "ternary", "multicomponent"] as const;
type SystemType = (typeof SYSTEM_TYPES)[number];

const STATUSES = ["active", "completed", "archived"] as const;
type Status = (typeof STATUSES)[number];

// Runtime guards (optional but nice)
const isSystemType = (v: string): v is SystemType =>
    (SYSTEM_TYPES as readonly string[]).includes(v);

const isStatus = (v: string): v is Status =>
    (STATUSES as readonly string[]).includes(v);


export default function EditProjectDialog({ open, onOpenChange, project, onProjectUpdated }: Props) {
    const utils = trpc.useUtils();
    const update = trpc.projects.update.useMutation({
        onSuccess: () => {
            utils.projects.list.invalidate();
            onProjectUpdated?.();
            onOpenChange(false);
        },
    });

    const { register, handleSubmit, setValue, reset, watch } = useForm<EditInput>({
        resolver: zodResolver(EditSchema),
        defaultValues: { id: "", data: {} },
    });

    useEffect(() => {
        if (open && project) {
            reset({
                id: project.id,
                data: {
                    name: project.name,
                    description: project.description ?? undefined,
                    system_type: project.system_type,
                    elements: project.elements,
                    status: project.status,
                },
            });
        }
    }, [open, project, reset]);

    const onSelectElements = (elements: string[]) => {
        // elements is string[]; field is optional (partial), but string[] is fine
        setValue("data.elements", elements, {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    const onSubmit = async (values: EditInput) => {
        await update.mutateAsync(values);
    };

    const selectedElements = watch("data.elements") || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="backdrop-blur-xl bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto"
                onPointerDownOutside={(e) => {
                    // Prevent closing when element selector is open
                    const target = e.target as HTMLElement;
                    const isElementSelector = target.closest('[data-element-dialog]');
                    if (isElementSelector) {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl">Edit Project</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <input type="hidden" {...register("id")} />

                    <div>
                        <Label className="text-slate-400">Project Name</Label>
                        <Input className="bg-slate-800/50 border-slate-700 text-white mt-1" placeholder="Name"
                               {...register("data.name")} />
                    </div>

                    <div>
                        <Label className="text-slate-400">Description</Label>
                        <Textarea rows={3} className="bg-slate-800/50 border-slate-700 text-white mt-1"
                                  placeholder="Brief description"
                                  {...register("data.description")} />
                    </div>

                    <div>
                        <Label className="text-slate-400">System Type</Label>
                        <Select
                            defaultValue={project?.system_type ?? "binary"}
                            onValueChange={(v) => {
                                if (isSystemType(v)) {
                                    setValue("data.system_type", v, { shouldDirty: true });
                                }
                            }}
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

                    <div>
                        <Label className="text-slate-400">Status</Label>
                        <Select
                            defaultValue={project?.status ?? "active"}
                            onValueChange={(v) => {
                                if (isStatus(v)) {
                                    setValue("data.status", v, { shouldDirty: true });
                                }
                            }}
                        >
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white mt-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <ElementSelector
                        selectedElements={selectedElements}
                        onSelectElements={onSelectElements}
                    />

                    <DialogFooter className="gap-3 pt-2">
                        <Button type="button" variant="outline" className="border-slate-600 text-white hover:bg-slate-800"
                                onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={update.isPending}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                            {update.isPending ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
