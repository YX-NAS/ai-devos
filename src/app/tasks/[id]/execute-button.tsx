"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Play, Loader2 } from "lucide-react";

export function ExecuteWithCodexButton({
  taskId,
  hasCodexPrompt
}: {
  taskId: string;
  hasCodexPrompt: boolean;
}) {
  const router = useRouter();
  const [isExecuting, setIsExecuting] = useState(false);

  async function handleExecute() {
    const statusResponse = await fetch("/api/codex/status");
    const status = await statusResponse.json();

    if (!status.available) {
      alert(`Codex runtime is not ready: ${status.message}\n\nConfigure CODEX_BIN on the server, or use Copy Prompt and execute in Codex Desktop manually.`);
      return;
    }

    if (!confirm("Codex will execute this task. This may take several minutes. Continue?")) {
      return;
    }

    setIsExecuting(true);

    try {
      const response = await fetch(`/api/codex/execute/${taskId}`, {
        method: "POST"
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        alert(`Execution failed: ${data.error || "Unknown error"}`);
        setIsExecuting(false);
      }
    } catch {
      alert("Network error during execution.");
      setIsExecuting(false);
    }
  }

  if (!hasCodexPrompt) {
    return null;
  }

  return (
    <div className="mb-3 flex items-center gap-2">
      <button
        type="button"
        onClick={handleExecute}
        disabled={isExecuting}
        className="inline-flex h-8 items-center gap-1.5 rounded-md bg-emerald-600 px-3 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {isExecuting ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Executing...
          </>
        ) : (
          <>
            <Play className="h-3.5 w-3.5" />
            Execute with Codex
          </>
        )}
      </button>
    </div>
  );
}
