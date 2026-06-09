import { existsSync } from "node:fs";
import { delimiter } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";

const DEFAULT_CODEX_BIN = "/Applications/Codex.app/Contents/Resources/codex";
const DEFAULT_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export interface CodexExecResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
}

export interface CodexRuntimeStatus {
  available: boolean;
  bin: string;
  source: "env" | "mac-app" | "path" | "missing";
  message: string;
}

function pathHasCommand(command: string) {
  const pathEntries = (process.env.PATH ?? "").split(delimiter).filter(Boolean);
  return pathEntries.some((entry) => existsSync(`${entry}/${command}`));
}

export function getCodexRuntimeStatus(): CodexRuntimeStatus {
  const envBin = process.env.CODEX_BIN?.trim();

  if (envBin) {
    return existsSync(envBin) || pathHasCommand(envBin)
      ? { available: true, bin: envBin, source: "env", message: "CODEX_BIN is configured." }
      : {
          available: false,
          bin: envBin,
          source: "missing",
          message: "CODEX_BIN is configured but the executable was not found."
        };
  }

  if (existsSync(DEFAULT_CODEX_BIN)) {
    return {
      available: true,
      bin: DEFAULT_CODEX_BIN,
      source: "mac-app",
      message: "Codex Desktop executable was found on this machine."
    };
  }

  const which = spawnSync("which", ["codex"], { encoding: "utf-8" });
  const pathBin = which.status === 0 ? which.stdout.trim() : "";

  if (pathBin || pathHasCommand("codex")) {
    return {
      available: true,
      bin: pathBin || "codex",
      source: "path",
      message: "codex was found in PATH."
    };
  }

  return {
    available: false,
    bin: "codex",
    source: "missing",
    message: "Codex CLI was not found. Configure CODEX_BIN or install/login Codex on the runtime host."
  };
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
  const runtime = getCodexRuntimeStatus();

  if (!runtime.available) {
    return {
      stdout: "",
      stderr: runtime.message,
      exitCode: -1,
      timedOut: false
    };
  }
  
  try {
    const stdout = execFileSync(runtime.bin, ["exec", prompt.slice(0, 8000)], {
      cwd: options?.workdir ?? process.cwd(),
      timeout: timeoutMs,
      maxBuffer: 10 * 1024 * 1024,
      encoding: "utf-8",
      env: { ...process.env, ...(options?.config ?? {}) }
    });
    return { stdout: stdout || "", stderr: "", exitCode: 0, timedOut: false };
  } catch (err: unknown) {
    return {
      stdout: (err as { stdout?: string }).stdout || "",
      stderr: (err as { stderr?: string; message?: string }).stderr || (err as { message?: string }).message || "",
      exitCode: (err as { status?: number }).status || -1,
      timedOut: !!(err as { killed?: boolean }).killed
    };
  }
}
