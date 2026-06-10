import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { hostname } from "node:os";

const args = new Set(process.argv.slice(2));
const once = args.has("--once");
const dryRun = args.has("--dry-run");
const configPath = resolve(process.env.AI_DEVOS_RUNNER_CONFIG || "runner.config.json");

function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

function readConfig() {
  if (!existsSync(configPath)) {
    throw new Error(`Runner config not found: ${configPath}`);
  }

  const config = JSON.parse(readFileSync(configPath, "utf-8"));
  return {
    serverUrl: String(config.serverUrl || "http://127.0.0.1:3000").replace(/\/$/, ""),
    hostId: String(config.hostId || hostname()),
    name: String(config.name || `Codex Runner ${hostname()}`),
    description: config.description || null,
    baseUrl: config.baseUrl || null,
    capabilities: Array.isArray(config.capabilities)
      ? config.capabilities.join(",")
      : config.capabilities || "codex",
    projectScopes: Array.isArray(config.projectScopes)
      ? config.projectScopes.join(",")
      : config.projectScopes || "",
    maxConcurrency: Number(config.maxConcurrency || 1),
    codexBin: String(config.codexBin || process.env.CODEX_BIN || "codex"),
    pollIntervalSeconds: Number(config.pollIntervalSeconds || 20),
    workdir: config.workdir || process.cwd(),
    projectWorkdirs: config.projectWorkdirs || {}
  };
}

function getCookie(setCookieHeaders) {
  if (!setCookieHeaders) {
    return "";
  }

  const raw = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
  return raw
    .map((entry) => String(entry).split(";")[0])
    .filter(Boolean)
    .join("; ");
}

async function api(path, options = {}, cookie = "") {
  const response = await fetch(`${runnerConfig.serverUrl}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(cookie ? { cookie } : {}),
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path} failed: ${response.status} ${text}`);
  }

  return { body, response };
}

async function login() {
  const password = process.env.AI_DEVOS_ADMIN_PASSWORD;
  if (!password) {
    throw new Error("AI_DEVOS_ADMIN_PASSWORD is required for runner login.");
  }

  const { response } = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ password })
  });
  const setCookie = response.headers.get("set-cookie");
  const cookie = getCookie(setCookie);
  if (!cookie) {
    throw new Error("Login succeeded but no session cookie was returned.");
  }
  return cookie;
}

async function heartbeat(cookie) {
  const { body } = await api(
    "/api/runners/heartbeat",
    {
      method: "POST",
      body: JSON.stringify({
        hostId: runnerConfig.hostId,
        name: runnerConfig.name,
        description: runnerConfig.description,
        baseUrl: runnerConfig.baseUrl,
        capabilities: runnerConfig.capabilities,
        projectScopes: runnerConfig.projectScopes,
        maxConcurrency: runnerConfig.maxConcurrency,
        isActive: true
      })
    },
    cookie
  );
  return body;
}

async function getNextTask(cookie) {
  const path = `/api/runners/tasks/next?hostId=${encodeURIComponent(runnerConfig.hostId)}`;
  const { body } = await api(path, {}, cookie);
  return body.task;
}

async function claimTask(taskId, cookie) {
  const { body } = await api(
    `/api/runners/tasks/${taskId}/claim`,
    {
      method: "POST",
      body: JSON.stringify({ hostId: runnerConfig.hostId })
    },
    cookie
  );
  return body;
}

async function completeTask(taskId, result, cookie) {
  await api(
    `/api/runners/tasks/${taskId}/complete`,
    {
      method: "POST",
      body: JSON.stringify({
        hostId: runnerConfig.hostId,
        executionResult: result,
        resultSummary: result.slice(0, 500),
        status: "REVIEW"
      })
    },
    cookie
  );
}

async function failTask(taskId, error, cookie) {
  await api(
    `/api/runners/tasks/${taskId}/fail`,
    {
      method: "POST",
      body: JSON.stringify({
        hostId: runnerConfig.hostId,
        error,
        resultSummary: "Local Codex runner failed. Check executionResult for details."
      })
    },
    cookie
  );
}

function resolveWorkdir(task) {
  const projectSlug = task?.project?.slug;
  return (projectSlug && runnerConfig.projectWorkdirs[projectSlug]) || runnerConfig.workdir;
}

function runCodex(task) {
  const prompt = task.codexPrompt || task.description || task.title;
  const workdir = resolveWorkdir(task);
  const banner = [
    `AI DevOS Task: ${task.title}`,
    `Project: ${task.project?.name || task.projectId}`,
    `Task ID: ${task.id}`,
    "",
    prompt
  ].join("\n");

  if (dryRun) {
    return `Dry run on ${runnerConfig.hostId}. Would execute in ${workdir}:\n\n${banner}`;
  }

  return execFileSync(runnerConfig.codexBin, ["exec", banner.slice(0, 12000)], {
    cwd: workdir,
    timeout: 30 * 60 * 1000,
    maxBuffer: 20 * 1024 * 1024,
    encoding: "utf-8",
    env: { ...process.env, CODEX_BIN: runnerConfig.codexBin }
  });
}

async function processOnce(cookie) {
  await heartbeat(cookie);
  const nextTask = await getNextTask(cookie);

  if (!nextTask) {
    console.log(`[${new Date().toISOString()}] no assignable task`);
    return;
  }

  const task = await claimTask(nextTask.id, cookie);
  console.log(`[${new Date().toISOString()}] claimed ${task.id}: ${task.title}`);

  try {
    const output = runCodex(task);
    await completeTask(task.id, output || "Codex completed without output.", cookie);
    console.log(`[${new Date().toISOString()}] completed ${task.id}`);
  } catch (error) {
    const message = `${error?.message || error}\n${error?.stdout || ""}\n${error?.stderr || ""}`.trim();
    await failTask(task.id, message, cookie);
    console.error(`[${new Date().toISOString()}] failed ${task.id}: ${message}`);
  }
}

const runnerConfig = readConfig();
const cookie = await login();
console.log(`[${new Date().toISOString()}] runner ${runnerConfig.hostId} connected to ${runnerConfig.serverUrl}`);

do {
  await processOnce(cookie);
  if (!once) {
    await sleep(runnerConfig.pollIntervalSeconds * 1000);
  }
} while (!once);
