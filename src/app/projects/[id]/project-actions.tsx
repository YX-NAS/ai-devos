"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import type { Project } from "@prisma/client";
import { projectCategoryLabels, priorityLabels, projectStageLabels } from "@/lib/constants";

export function ProjectActions({ project }: { project: Project }) {
  const router = useRouter();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpdate(formData: FormData) {
    setIsSaving(true);
    setError(null);
    const res = await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });
    if (!res.ok) { setError("Failed to update."); setIsSaving(false); return; }
    setShowEdit(false); setIsSaving(false); router.refresh();
  }

  async function handleDelete() {
    setError(null); setIsDeleting(true);
    const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    if (!res.ok) { setError("Failed to delete."); setIsDeleting(false); return; }
    router.push("/projects"); router.refresh();
  }

  return (
    <>
      <div className="flex gap-2">
        <button type="button" onClick={() => setShowEdit(true)} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-50">
          <Pencil className="h-3.5 w-3.5" />Edit
        </button>
        <button type="button" onClick={() => setShowDelete(true)} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 text-xs font-medium text-red-600 hover:bg-red-50">
          <Trash2 className="h-3.5 w-3.5" />Delete
        </button>
      </div>

      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 pt-10 pb-10">
          <div className="w-full max-w-xl rounded-lg border border-zinc-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-zinc-950">Edit: {project.name}</h2>
              <button type="button" onClick={() => setShowEdit(false)} className="text-zinc-400 hover:text-zinc-600"><X className="h-4 w-4" /></button>
            </div>
            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
            <form action={handleUpdate} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1 text-sm font-medium text-zinc-700">Name
                  <input name="name" required defaultValue={project.name} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" />
                </label>
                <label className="space-y-1 text-sm font-medium text-zinc-700">Description
                  <input name="description" defaultValue={project.description ?? ""} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" />
                </label>
                <label className="space-y-1 text-sm font-medium text-zinc-700">Repo Name
                  <input name="repoName" defaultValue={project.repoName ?? ""} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" />
                </label>
                <label className="space-y-1 text-sm font-medium text-zinc-700">Repo URL
                  <input name="repoUrl" defaultValue={project.repoUrl ?? ""} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" />
                </label>
                <label className="space-y-1 text-sm font-medium text-zinc-700">Category
                  <select name="category" defaultValue={project.category} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm">
                    {Object.entries(projectCategoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </label>
                <label className="space-y-1 text-sm font-medium text-zinc-700">Priority
                  <select name="priority" defaultValue={project.priority} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm">
                    {Object.entries(priorityLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </label>
                <label className="space-y-1 text-sm font-medium text-zinc-700">Stage
                  <select name="stage" defaultValue={project.stage} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm">
                    {Object.entries(projectStageLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </label>
                <label className="space-y-1 text-sm font-medium text-zinc-700">Owner
                  <input name="owner" defaultValue={project.owner ?? ""} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" />
                </label>
              </div>
              <label className="block space-y-1 text-sm font-medium text-zinc-700">Current Goal
                <textarea name="currentGoal" rows={2} defaultValue={project.currentGoal ?? ""} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
              </label>
              <label className="block space-y-1 text-sm font-medium text-zinc-700">Next Action
                <input name="nextAction" defaultValue={project.nextAction ?? ""} className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" />
              </label>
              <button type="submit" disabled={isSaving} className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white disabled:opacity-60">
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-lg">
            <h2 className="font-semibold text-zinc-950">Delete {project.name}?</h2>
            <p className="mt-2 text-sm text-zinc-600">This will also delete all associated tasks, requirements, and designs.</p>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <div className="mt-4 flex gap-2 justify-end">
              <button type="button" onClick={() => setShowDelete(false)} className="inline-flex h-9 items-center rounded-md border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Cancel</button>
              <button type="button" onClick={handleDelete} disabled={isDeleting} className="inline-flex h-9 items-center rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
