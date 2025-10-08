import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Plus, FolderOpen, Trash2, Pencil } from "lucide-react";



import {Button} from "../components/ui/button.tsx";
import {trpc} from "../lib/trpc.tsx";
import {Badge} from "../components/ui/badge.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "../components/ui/card.tsx";
import CreateProjectDialog from "../components/projects/CreateProjectDialog.tsx";
import EditProjectDialog from "../components/projects/EditProjectDialog.tsx";

type ProjectItem = {
    id: string;
    name: string;
    description: string | null;
    system_type: "binary" | "ternary" | "multicomponent";
    elements: string[];
    status: "active" | "completed" | "archived";
    createdAt: string | Date; // Prisma returns ISO; make robust
};

export default function Projects() {
    const utils = trpc.useUtils();
    const listQuery = trpc.projects.list.useQuery(undefined, {
        refetchOnWindowFocus: false,
    });
    const deleteMutation = trpc.projects.delete.useMutation({
        onSuccess: () => utils.projects.list.invalidate(),
    });

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

    const isLoading = listQuery.isLoading;
    const projects = (listQuery.data ?? []) as ProjectItem[];

    const handleDeleteProject = async (projectId: string) => {
        if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            await deleteMutation.mutateAsync({ id: projectId });
        }
    };

    const handleEditProject = (project: ProjectItem) => {
        setEditingProject(project);
        setShowEditDialog(true);
    };

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Header (base44 look) */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-xl bg-slate-900/40 border border-slate-700/50 rounded-2xl p-4 md:p-6"
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">Projects</h1>
                            <p className="text-slate-400 text-sm md:text-base">Manage your simulation projects</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setShowCreateDialog(true)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full sm:w-auto text-sm md:text-base"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Project
                    </Button>
                </div>
            </motion.div>

            {/* Projects Grid (base44 look) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-fr">
                {projects.map((project, index) => {
                    const created = new Date(project.createdAt);
                    return (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="h-full"
                        >
                            <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50 hover:border-slate-600/50 transition-all group h-full flex flex-col">
                                <CardHeader className="flex-none">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-white mb-2 truncate">{project.name}</CardTitle>
                                            <p className="text-slate-400 text-sm line-clamp-2">{project.description}</p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEditProject(project)}
                                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-8 w-8"
                                                title="Edit project"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteProject(project.id)}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8"
                                                title="Delete project"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                                {project.system_type}
                                            </Badge>
                                            <Badge className={
                                                project.status === "active"
                                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                                    : project.status === "completed"
                                                        ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                                                        : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                                            }>
                                                {project.status}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {(project.elements ?? []).map((el) => (
                                                <span key={el} className="px-2 py-1 bg-slate-800/50 text-slate-300 text-xs rounded">
                          {el}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-500 pt-3 mt-3 border-t border-slate-700/50">
                                        Created {format(created, "MMM d, yyyy")}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}

                {projects.length === 0 && !isLoading && (
                    <div className="col-span-full">
                        <Card className="backdrop-blur-xl bg-slate-900/40 border-slate-700/50">
                            <CardContent className="p-12 text-center">
                                <FolderOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
                                <p className="text-slate-400 mb-6">Create your first project to get started</p>
                                <Button
                                    onClick={() => setShowCreateDialog(true)}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Project
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Dialogs */}
            <CreateProjectDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                onProjectCreated={() => utils.projects.list.invalidate()}
            />
            <EditProjectDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                project={editingProject}
                onProjectUpdated={() => utils.projects.list.invalidate()}
            />
        </div>
    );
}
