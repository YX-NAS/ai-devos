"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Task } from "@prisma/client";

export function TaskEditForm({ taskId, task }: { taskId: string; task: Task }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setIsSaving(true);
    setError(null);

    const payload: Record<string, unknown> = {
      executionResult: formData.get("executionResult"),
      commitSha: formData.get("commitSha"),
      pullRequestUrl: formData.get("pullRequestUrl"),
      deployedUrl: formData.get("deployedUrl"),
      goal: formData.get("goal"),
      scope: formData.get("scope"),
      planningSummary: formData.get("planningSummary"),
      implementationPlan: formData.get("implementationPlan"),
      codexBudgetNotes: formData.get("codexBudgetNotes"),
      relatedFiles: formData.get("relatedFiles"),
      acceptanceCriteria: formData.get("acceptanceCriteria")
    };

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setIsSaving(false);
      setError("保存失败，请重试。");
      return;
    }

    router.refresh();
    setIsSaving(false);
  }

  return (
    <form action={onSubmit} className="space-y-4">
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium text-zinc-700">
          执行结果摘要
          <textarea
            name="executionResult"
            rows={4}
            defaultValue={task.executionResult ?? ""}
            placeholder="Codex 执行后的结果摘要"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
        <div className="space-y-4">
          <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
            Commit SHA
            <input
              name="commitSha"
              defaultValue={task.commitSha ?? ""}
              placeholder="abc1234"
              className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm font-mono"
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
            PR URL
            <input
              name="pullRequestUrl"
              defaultValue={task.pullRequestUrl ?? ""}
              placeholder="https://github.com/..."
              className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm font-mono"
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
            部署 URL
            <input
              name="deployedUrl"
              defaultValue={task.deployedUrl ?? ""}
              placeholder="https://..."
              className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm font-mono"
            />
          </label>
        </div>
      </div>

      <details className="rounded-md border border-zinc-200">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-zinc-600 hover:text-zinc-950">
          Edit Handoff Fields
        </summary>
        <div className="space-y-4 border-t border-zinc-200 p-4">
          <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
            目标
            <textarea
              name="goal"
              rows={2}
              defaultValue={task.goal ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
            范围
            <textarea
              name="scope"
              rows={2}
              defaultValue={task.scope ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
            规划摘要
            <textarea
              name="planningSummary"
              rows={3}
              defaultValue={task.planningSummary ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
            实现步骤
            <textarea
              name="implementationPlan"
              rows={3}
              defaultValue={task.implementationPlan ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
            省额度说明
            <textarea
              name="codexBudgetNotes"
              rows={2}
              defaultValue={task.codexBudgetNotes ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
            相关文件
            <textarea
              name="relatedFiles"
              rows={2}
              defaultValue={task.relatedFiles ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
            验收标准
            <textarea
              name="acceptanceCriteria"
              rows={3}
              defaultValue={task.acceptanceCriteria ?? ""}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </details>

      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
