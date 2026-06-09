"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

export function QuickPlan() {
  const router = useRouter();
  const [goal, setGoal] = useState("");
  const [scope, setScope] = useState("");
  const [isPlanning, setIsPlanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ projectId: string; taskCount: number } | null>(null);

  async function handlePlan(formData: FormData) {
    setIsPlanning(true);
    setError(null);
    setResult(null);

    const payload = {
      goal: formData.get("goal"),
      scope: formData.get("scope") || undefined,
      mode: "auto"
    };

    try {
      const response = await fetch("/api/codex/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "规划失败，请重试。");
        setIsPlanning(false);
        return;
      }

      const data = await response.json();
      setResult({ projectId: data.project.id, taskCount: data.tasks.length });
      setIsPlanning(false);
      router.refresh();
    } catch {
      setError("网络错误，请重试。");
      setIsPlanning(false);
    }
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-zinc-600" aria-hidden="true" />
          <h2 className="font-semibold text-zinc-950">Quick Plan with Codex</h2>
        </div>
        <p className="mt-1 text-sm text-zinc-500">输入目标，Codex 自动分解为可执行的任务列表。</p>
      </div>

      <div className="p-5">
        {result ? (
          <div className="rounded-md bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-800">规划完成！创建了 {result.taskCount} 个任务。</p>
            <div className="mt-3 flex gap-2">
              <a href={`/projects/${result.projectId}`} className="inline-flex h-8 items-center rounded-md bg-emerald-600 px-3 text-xs font-medium text-white hover:bg-emerald-700">View Project</a>
              <a href={`/projects/${result.projectId}/tasks`} className="inline-flex h-8 items-center rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50">View Tasks</a>
            </div>
          </div>
        ) : (
          <form action={handlePlan} className="space-y-4">
            {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
            <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
              目标 / Goal
              <textarea name="goal" required rows={3} value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="例如：为 AI DevOS 添加用户反馈功能，包含提交表单和列表展示" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" disabled={isPlanning} />
            </label>
            <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
              范围 / Scope（可选）
              <input name="scope" value={scope} onChange={(e) => setScope(e.target.value)} placeholder="例如：只涉及前端和数据库，不涉及第三方 API" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" disabled={isPlanning} />
            </label>
            <button type="submit" disabled={isPlanning || !goal.trim()} className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white disabled:opacity-50">
              {isPlanning ? (<><Loader2 className="h-4 w-4 animate-spin" />Codex is planning...</>) : (<><Sparkles className="h-4 w-4" />Plan with Codex</>)}
            </button>
            {isPlanning && <p className="text-xs text-zinc-400">Codex 正在分析目标并生成任务分解，这可能需要 1-3 分钟...</p>}
          </form>
        )}
      </div>
    </div>
  );
}
