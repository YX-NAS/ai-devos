"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { generatePlanningPrompt } from "@/features/codex-exec/planning-prompt";
import { PromptTemplates, PROMPT_TEMPLATES, type PromptTemplate } from "./prompt-templates";

type FlowMode = "codex" | "chatgpt";

export function QuickPlan() {
  const router = useRouter();
  const [flowMode, setFlowMode] = useState<FlowMode>("chatgpt");
  const [goal, setGoal] = useState("");
  const [scope, setScope] = useState("");
  const [isPlanning, setIsPlanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ projectId: string; taskCount: number } | null>(null);
  const [copied, setCopied] = useState(false);

  // ChatGPT flow states
  const [step, setStep] = useState<"input" | "prompt" | "paste">("input");
  const [chatgptPrompt, setChatgptPrompt] = useState("");
  const [chatgptResponse, setChatgptResponse] = useState("");

  function handleTemplateSelect(template: PromptTemplate) {
    if (template.id !== "custom") {
      setGoal(template.goal);
      setScope(template.scope);
    } else {
      setGoal("");
      setScope("");
    }
  }

  // Generate ChatGPT planning prompt
  function handleGeneratePrompt() {
    if (!goal.trim()) return;
    const prompt = generatePlanningPrompt(goal, scope || undefined);
    setChatgptPrompt(prompt);
    setStep("prompt");
  }

  // Copy prompt to clipboard
  async function handleCopyPrompt() {
    await navigator.clipboard.writeText(chatgptPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Codex auto-plan (existing)
  async function handleCodexPlan(formData: FormData) {
    setIsPlanning(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/codex/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: formData.get("goal"),
          scope: formData.get("scope") || undefined,
          mode: "auto"
        })
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "规划失败");
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

  // Parse ChatGPT response
  async function handleParseChatGPT() {
    if (!chatgptResponse.trim() || chatgptResponse.trim().length < 100) {
      setError("请先粘贴 ChatGPT 的完整回复（至少100字符）。");
      return;
    }
    setIsPlanning(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/codex/parse-chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: chatgptResponse, goal, scope })
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "解析失败，请检查 ChatGPT 输出格式。");
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
          <h2 className="font-semibold text-zinc-950">Quick Plan</h2>
        </div>
        <p className="mt-1 text-sm text-zinc-500">输入目标，自动分解为可执行的任务列表。</p>
      </div>

      <div className="p-5">
        {result ? (
          <div className="rounded-md bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-800">创建了 {result.taskCount} 个任务。</p>
            <div className="mt-3 flex gap-2">
              <a href={`/projects/${result.projectId}`} className="inline-flex h-8 items-center rounded-md bg-emerald-600 px-3 text-xs font-medium text-white hover:bg-emerald-700">View Project</a>
              <a href={`/projects/${result.projectId}/tasks`} className="inline-flex h-8 items-center rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50">View Tasks</a>
            </div>
          </div>
        ) : (
          <>
            {/* Flow mode selector */}
            <div className="mb-4 flex rounded-md border border-zinc-300 bg-zinc-100 p-0.5">
              <button
                type="button"
                onClick={() => { setFlowMode("chatgpt"); setStep("input"); setError(null); }}
                className={`flex-1 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors ${flowMode === "chatgpt" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
              >
                ChatGPT 规划
              </button>
              <button
                type="button"
                onClick={() => { setFlowMode("codex"); setError(null); }}
                className={`flex-1 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors ${flowMode === "codex" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
              >
                Codex 自动
              </button>
            </div>

            {error ? (
              <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            ) : null}

            {flowMode === "codex" ? (
              /* Codex auto-plan */
              <form action={handleCodexPlan} className="space-y-4">
                <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
                  目标 / Goal
                  <textarea name="goal" required rows={3} value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="例如：为 AI DevOS 添加用户反馈功能" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" disabled={isPlanning} />
                </label>
                <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
                  范围 / Scope（可选）
                  <input name="scope" value={scope} onChange={(e) => setScope(e.target.value)} placeholder="例如：只涉及前端和数据库" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" disabled={isPlanning} />
                </label>
                <button type="submit" disabled={isPlanning || !goal.trim()} className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white disabled:opacity-50">
                  {isPlanning ? (<><Loader2 className="h-4 w-4 animate-spin" />Codex is planning...</>) : (<><Sparkles className="h-4 w-4" />Plan with Codex</>)}
                </button>
              </form>
            ) : (
              /* ChatGPT flow */
              <div className="space-y-4">
                {step === "input" && (
                  <>
                    <PromptTemplates onSelect={handleTemplateSelect} />
                    <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
                      目标 / Goal
                      <textarea rows={3} value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="例如：为 AI DevOS 添加用户反馈功能" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
                    </label>
                    <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
                      范围 / Scope（可选）
                      <input value={scope} onChange={(e) => setScope(e.target.value)} placeholder="例如：只涉及前端和数据库" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm" />
                    </label>
                    <button type="button" onClick={handleGeneratePrompt} disabled={!goal.trim()} className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white disabled:opacity-50">
                      <Sparkles className="h-4 w-4" />
                      Generate ChatGPT Prompt
                    </button>
                  </>
                )}

                {step === "prompt" && (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-zinc-700">Step 1: Copy prompt → paste to ChatGPT</p>
                      <button type="button" onClick={() => setStep("paste")} className="text-xs font-medium text-zinc-500 hover:text-zinc-700">
                        Already done? Continue →
                      </button>
                    </div>
                    <pre className="max-h-48 overflow-auto rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs leading-5 text-zinc-700 whitespace-pre-wrap">{chatgptPrompt}</pre>
                    <button type="button" onClick={handleCopyPrompt} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50">
                      {copied ? (<><Check className="h-3.5 w-3.5 text-green-600" />Copied</>) : (<><Copy className="h-3.5 w-3.5" />Copy Prompt</>)}
                    </button>
                    <p className="text-xs text-zinc-400">
                      打开 <a href="https://chatgpt.com" target="_blank" className="underline hover:text-zinc-600">chatgpt.com</a>，粘贴 prompt，等待 ChatGPT 回复。
                    </p>
                  </>
                )}

                {step === "paste" && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-zinc-700">Step 2: Paste ChatGPT response here</p>
                      <p className="mt-1 text-xs text-zinc-400">将 ChatGPT 的完整回复粘贴到下方文本框。</p>
                    </div>
                    <div className="mb-2 rounded-md bg-blue-50 p-2 text-xs text-blue-700">
                      <p className="font-medium">如果解析失败，请确保 ChatGPT 输出使用以下格式之一：</p>
                      <p className="mt-1"><code>### 任务 1: 标题</code> 或 <code>### Task 1: Title</code> 或 <code>**任务 1**: 标题</code></p>
                      <p>每个任务下包含 <code>- 描述:</code> <code>- 目标:</code> <code>- 范围:</code> <code>- 实现步骤:</code> 等字段</p>
                    </div>
                    <textarea
                      rows={12}
                      value={chatgptResponse}
                      onChange={(e) => setChatgptResponse(e.target.value)}
                      placeholder="在此粘贴 ChatGPT 的完整回复（包含 ### 任务 1、- 描述 等格式）..."
                      className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm font-mono"
                    />
                    <div className="flex gap-2">
                      <button type="button" onClick={handleParseChatGPT} disabled={isPlanning || chatgptResponse.trim().length < 100} className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white disabled:opacity-50">
                        {isPlanning ? (<><Loader2 className="h-4 w-4 animate-spin" />Parsing...</>) : (<>Parse &amp; Create Tasks</>)}
                      </button>
                      <button type="button" onClick={() => setStep("prompt")} className="inline-flex h-10 items-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
                        ← Back
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
