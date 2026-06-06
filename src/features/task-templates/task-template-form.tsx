"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClipboardPlus } from "lucide-react";

export function TaskTemplateForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setIsSaving(true);
    setError(null);

    const payload = {
      title: formData.get("title"),
      goal: formData.get("goal"),
      scope: formData.get("scope"),
      planningSummary: formData.get("planningSummary"),
      implementationPlan: formData.get("implementationPlan"),
      codexBudgetNotes: formData.get("codexBudgetNotes"),
      relatedFiles: formData.get("relatedFiles"),
      acceptanceCriteria: formData.get("acceptanceCriteria"),
      status: formData.get("status"),
      priority: formData.get("priority"),
      requiresCommit: formData.get("requiresCommit") === "on",
      requiresPush: formData.get("requiresPush") === "on",
      requiresDeployment: formData.get("requiresDeployment") === "on"
    };

    const response = await fetch(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setIsSaving(false);
      setError("创建任务失败，请检查模板字段。");
      return;
    }

    router.refresh();
    setIsSaving(false);
  }

  return (
    <form action={onSubmit} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <ClipboardPlus className="h-4 w-4 text-zinc-600" aria-hidden="true" />
        <h2 className="font-semibold text-zinc-950">Codex Task Template</h2>
      </div>
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-zinc-700">
          任务标题 / Title
          <input name="title" required className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" />
        </label>
        <label className="space-y-2 text-sm font-medium text-zinc-700">
          优先级 / Priority
          <select name="priority" defaultValue="P1" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm">
            <option value="P0">P0</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
          </select>
        </label>
      </div>
      <input type="hidden" name="status" value="READY_FOR_CODEX" />
      <label className="block space-y-2 text-sm font-medium text-zinc-700">
        目标 / Goal
        <textarea name="goal" rows={2} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
      </label>
      <label className="block space-y-2 text-sm font-medium text-zinc-700">
        范围 / Scope
        <textarea name="scope" rows={3} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
      </label>
      <label className="block space-y-2 text-sm font-medium text-zinc-700">
        ChatGPT 规划摘要 / ChatGPT planning summary
        <textarea
          name="planningSummary"
          rows={3}
          placeholder="说明 ChatGPT 已确认的方案、约束和取舍，Codex 不需要重新探索。"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="block space-y-2 text-sm font-medium text-zinc-700">
        建议实现步骤 / Suggested implementation plan
        <textarea
          name="implementationPlan"
          rows={3}
          placeholder="1. 修改哪些文件；2. 增加哪些字段/API；3. 运行哪些验证。"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="block space-y-2 text-sm font-medium text-zinc-700">
        Codex 省额度说明 / Codex budget notes
        <textarea
          name="codexBudgetNotes"
          rows={2}
          placeholder="只阅读相关文件；不做大范围重构；遇到缺失信息先提出最短问题。"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="block space-y-2 text-sm font-medium text-zinc-700">
        相关文件 / Relevant files
        <textarea name="relatedFiles" rows={2} placeholder="src/app/projects, prisma/schema.prisma" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
      </label>
      <label className="block space-y-2 text-sm font-medium text-zinc-700">
        验收标准 / Acceptance criteria
        <textarea name="acceptanceCriteria" rows={3} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
      </label>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700">
          <input name="requiresCommit" type="checkbox" defaultChecked />
          需要 commit
        </label>
        <label className="flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700">
          <input name="requiresPush" type="checkbox" defaultChecked />
          需要 push
        </label>
        <label className="flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-700">
          <input name="requiresDeployment" type="checkbox" />
          需要部署
        </label>
      </div>
      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white disabled:opacity-60"
      >
        {isSaving ? "Saving" : "Create Codex Task"}
      </button>
    </form>
  );
}
