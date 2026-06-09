import { exec } from "node:child_process";

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
  return new Promise((resolve) => {
    const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    let resolved = false;

    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve({ stdout: "", stderr: "timeout", exitCode: null, timedOut: true });
      }
    }, timeoutMs);

    // Write prompt to stdin via heredoc-style echo pipe
    const escapedPrompt = prompt.replace(/\\/g, "\\\\").replace(/'/g, "'\\''");
    const cmd = `echo '${escapedPrompt}' | ${CODEX_BIN} exec -`;

    exec(cmd, {
      cwd: options?.workdir ?? process.cwd(),
      timeout: timeoutMs,
      maxBuffer: 10 * 1024 * 1024, // 10 MB
      env: { ...process.env, ...(options?.config ?? {}) }
    }, (error, stdout, stderr) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        resolve({
          stdout: stdout || "",
          stderr: stderr || "",
          exitCode: error ? (error as NodeJS.ErrnoException).code || -1 : 0,
          timedOut: false
        });
      }
    });
  });
}
export function generatePlanningPrompt(goal: string, scope?: string): string {
  return [
    "你是一个 AI DevOS 规划助手。请对以下目标进行任务分解。",
    "务必使用以下精确格式输出，每个任务使用 ### 开头：",
    "",
    `目标：${goal}`,
    scope ? `范围：${scope}` : "",
    "",
    "## 项目名称",
    "[简短项目名]",
    "",
    "## 规划摘要",
    "[2-3句方案说明]",
    "",
    "## 任务列表",
    "",
    "### 任务 1: [标题]",
    "- 描述: [一句话]",
    "- 目标: [具体目标]",
    "- 范围: [改动范围]",
    "- 实现步骤: [步骤]",
    "- 相关文件: [文件路径]",
    "- 验收标准: [完成标准]",
    "- 需要commit: 是",
    "- 需要push: 否",
    "- 需要部署: 否",
    "",
    "### 任务 2: [标题]",
    "...",
    "",
    "## Codex 省额度说明",
    "[优先阅读的文件，不需要探索的方向]",
    "",
    "规则：",
    "1. 使用 ### 任务 N: 开头定义每个任务",
    "2. 每个任务严格包含上面9个字段",
    "3. 需要commit/需要push/需要部署 只用 是/否",
    "4. 不要写代码",
    "5. 任务2-6个",
  ].join("\n");
}
