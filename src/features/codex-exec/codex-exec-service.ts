import { execSync } from "node:child_process";

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
  
  // Escape single quotes for shell and truncate extremely long prompts
  const safePrompt = prompt.slice(0, 8000).replace(/'/g, "'\''");
  const cmd = `${CODEX_BIN} exec '${safePrompt}'`;
  
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
}