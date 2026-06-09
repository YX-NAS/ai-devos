import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

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
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  
  // Write prompt to temp file to avoid stdin pipe issues
  const tmpFile = join(tmpdir(), `codex-prompt-${Date.now()}.txt`);
  try {
    writeFileSync(tmpFile, prompt, "utf-8");
    
    const cmd = `${CODEX_BIN} exec - < "${tmpFile}"`;
    
    try {
      const stdout = execSync(cmd, {
        cwd: options?.workdir ?? process.cwd(),
        timeout: timeoutMs,
        maxBuffer: 10 * 1024 * 1024,
        encoding: "utf-8",
        env: { ...process.env, ...(options?.config ?? {}) }
      });
      return { stdout: stdout || "", stderr: "", exitCode: 0, timedOut: false };
    } catch (err: any) {
      return {
        stdout: err.stdout || "",
        stderr: err.stderr || err.message || "",
        exitCode: err.status || -1,
        timedOut: err.killed || false
      };
    }
  } finally {
    try { unlinkSync(tmpFile); } catch {}
  }
}export function generatePlanningPrompt(goal: string, scope?: string): string {
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
