import { spawn } from "node:child_process";

const CODEX_BIN = "/Applications/Codex.app/Contents/Resources/codex";
const DEFAULT_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export interface CodexExecResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
}

export async function execCodex(
  prompt: string,
  options?: {
    timeoutMs?: number;
    config?: Record<string, string>;
    workdir?: string;
  }
): Promise<CodexExecResult> {
  const args = ["exec"];
  if (options?.config) {
    for (const [key, value] of Object.entries(options.config)) {
      args.push("-c", `${key}=${value}`);
    }
  }
  args.push("-");

  const child = spawn(CODEX_BIN, args, {
    cwd: options?.workdir ?? process.cwd(),
    stdio: ["pipe", "pipe", "pipe"],
    timeout: options?.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    env: { ...process.env, ...(options?.config ?? {}) }
  });

  let stdout = "";
  let stderr = "";

  child.stdout.on("data", (data: Buffer) => {
    stdout += data.toString();
  });

  child.stderr.on("data", (data: Buffer) => {
    stderr += data.toString();
  });

  child.stdin.write(prompt);
  child.stdin.end();

  return new Promise((resolve) => {
    let resolved = false;
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        child.kill();
        resolve({ stdout, stderr, exitCode: null, timedOut: true });
      }
    }, options?.timeoutMs ?? DEFAULT_TIMEOUT_MS);

    child.on("close", (code) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        resolve({ stdout, stderr, exitCode: code, timedOut: false });
      }
    });

    child.on("error", (err) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        resolve({ stdout: "", stderr: err.message, exitCode: -1, timedOut: false });
      }
    });
  });
}

export function generatePlanningPrompt(goal: string, scope?: string): string {
  return [
    "你是一个 AI DevOS 规划助手。请对以下目标进行任务分解，输出可直接交给 Codex 执行的开发计划。",
    "",
    `目标：${goal}`,
    scope ? `范围：${scope}` : "",
    "",
    "请输出以下格式（中文）：",
    "",
    "## 项目名称",
    "简短的项目名称",
    "",
    "## 规划摘要",
    "2-3 句说明方案、约束和取舍",
    "",
    "## 任务列表",
    "对每个任务，严格按以下格式输出：",
    "",
    "### 任务 N: [任务标题]",
    "- 描述: [一句话描述]",
    "- 目标: [该任务的具体目标]",
    "- 范围: [改动范围，列出涉及的文件或模块]",
    "- 实现步骤: [1-2-3 步骤]",
    "- 相关文件: [涉及的具体文件路径]",
    "- 验收标准: [如何判断完成]",
    "- 需要commit: [是/否]",
    "- 需要push: [是/否]",
    "- 需要部署: [是/否]",
    "",
    "## Codex 省额度说明",
    "说明哪些文件优先看，哪些方向不要重新探索，遇到缺口时如何最短反馈。",
    "",
    "要求：",
    "- 任务 2-6 个，每个可独立交付",
    "- 任务按执行顺序排列",
    "- 每个任务边界清晰，Codex 可以一次执行完成",
    "- 不要写代码，只做规划",
    "- 使用中文输出",
  ].join("\n");
}
