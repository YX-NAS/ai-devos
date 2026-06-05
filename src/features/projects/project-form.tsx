"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save } from "lucide-react";

export function ProjectForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function onSubmit(formData: FormData) {
    setIsSaving(true);
    setError(null);

    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setIsSaving(false);
      setError("保存失败，请检查 slug 是否唯一，URL 是否合法。");
      return;
    }

    const project = await response.json();
    router.push(`/projects/${project.id}`);
    router.refresh();
  }

  return (
    <form action={onSubmit} className="max-w-3xl space-y-5 rounded-lg border border-zinc-200 bg-white p-6">
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-zinc-700">
          项目名称
          <input name="name" required className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" />
        </label>
        <label className="space-y-2 text-sm font-medium text-zinc-700">
          Slug
          <input name="slug" required pattern="[a-z0-9-]+" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" />
        </label>
        <label className="space-y-2 text-sm font-medium text-zinc-700">
          分类
          <select name="category" defaultValue="AI_PRODUCT" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm">
            <option value="AI_PRODUCT">AI 产品</option>
            <option value="WORK">工作</option>
            <option value="SIDE_PROJECT">业余</option>
            <option value="EDUCATION">教育</option>
            <option value="INFRASTRUCTURE">基础设施</option>
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-zinc-700">
          优先级
          <select name="priority" defaultValue="P2" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm">
            <option value="P0">P0</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-zinc-700">
          阶段
          <select name="stage" defaultValue="IDEA" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm">
            <option value="IDEA">Idea</option>
            <option value="RESEARCH">Research</option>
            <option value="DESIGN">Design</option>
            <option value="READY_FOR_CODEX">Ready for Codex</option>
            <option value="IN_CODEX">In Codex</option>
            <option value="REVIEW">Review</option>
            <option value="DONE">Done</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-zinc-700">
          Owner
          <input name="owner" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" />
        </label>
      </div>
      <label className="block space-y-2 text-sm font-medium text-zinc-700">
        描述
        <textarea name="description" rows={4} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
      </label>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-zinc-700">
          GitHub Repo
          <input name="repoName" placeholder="YX-NAS/ai-devos" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" />
        </label>
        <label className="space-y-2 text-sm font-medium text-zinc-700">
          Repo URL
          <input name="repoUrl" placeholder="https://github.com/YX-NAS/ai-devos" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" />
        </label>
      </div>
      <label className="block space-y-2 text-sm font-medium text-zinc-700">
        当前目标
        <input name="currentGoal" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" />
      </label>
      <label className="block space-y-2 text-sm font-medium text-zinc-700">
        下一步
        <input name="nextAction" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" />
      </label>
      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white disabled:opacity-60"
      >
        <Save className="h-4 w-4" aria-hidden="true" />
        {isSaving ? "Saving" : "Save Project"}
      </button>
    </form>
  );
}
