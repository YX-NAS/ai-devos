import { prisma } from "@/lib/prisma";
import { ensureDatabase } from "@/lib/bootstrap-db";
import type { Prisma } from "@prisma/client";

const DEFAULT_RUNNER_NAME = "Local Codex Runner";

function normalizeList(value?: string | null) {
  return (value ?? "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function taskMatchesRunnerScope(
  task: { projectId: string; project: { slug: string; name: string } },
  projectScopes?: string | null
) {
  const scopes = normalizeList(projectScopes).map((scope) => scope.toLowerCase());
  if (scopes.length === 0) {
    return true;
  }

  return scopes.includes(task.projectId.toLowerCase())
    || scopes.includes(task.project.slug.toLowerCase())
    || scopes.includes(task.project.name.toLowerCase());
}

export async function listRunners() {
  await ensureDatabase();
  return prisma.runner.findMany({
    orderBy: [{ isActive: "desc" }, { lastSeenAt: "desc" }, { updatedAt: "desc" }],
    include: {
      tasks: {
        where: { status: { in: ["READY_FOR_CODEX", "IN_PROGRESS", "REVIEW", "BLOCKED"] } },
        orderBy: { updatedAt: "desc" },
        take: 8,
        include: { project: true }
      }
    }
  });
}

export async function getRunner(id: string) {
  await ensureDatabase();
  return prisma.runner.findUnique({
    where: { id },
    include: { tasks: { include: { project: true }, orderBy: { updatedAt: "desc" }, take: 20 } }
  });
}

export async function createRunner(data: Prisma.RunnerCreateInput) {
  await ensureDatabase();
  return prisma.runner.create({ data });
}

export async function updateRunner(id: string, data: Prisma.RunnerUpdateInput) {
  await ensureDatabase();
  return prisma.runner.update({ where: { id }, data });
}

export async function deleteRunner(id: string) {
  await ensureDatabase();
  return prisma.runner.delete({ where: { id } });
}

export async function heartbeatRunner(data: {
  hostId: string;
  name?: string | null;
  description?: string | null;
  baseUrl?: string | null;
  capabilities?: string | null;
  projectScopes?: string | null;
  maxConcurrency?: number;
  isActive?: boolean;
}) {
  await ensureDatabase();
  const now = new Date();

  return prisma.runner.upsert({
    where: { hostId: data.hostId },
    update: {
      name: data.name ?? undefined,
      description: data.description,
      baseUrl: data.baseUrl,
      capabilities: data.capabilities,
      projectScopes: data.projectScopes,
      maxConcurrency: data.maxConcurrency ?? undefined,
      isActive: data.isActive ?? true,
      lastSeenAt: now
    },
    create: {
      hostId: data.hostId,
      name: data.name ?? DEFAULT_RUNNER_NAME,
      description: data.description,
      baseUrl: data.baseUrl,
      capabilities: data.capabilities,
      projectScopes: data.projectScopes,
      maxConcurrency: data.maxConcurrency ?? 1,
      isActive: data.isActive ?? true,
      lastSeenAt: now
    }
  });
}

export async function getNextTaskForRunner(hostId: string) {
  await ensureDatabase();
  const runner = await prisma.runner.findUnique({ where: { hostId } });
  if (!runner || !runner.isActive) {
    return null;
  }

  const activeCount = await prisma.task.count({
    where: { runnerId: runner.id, status: "IN_PROGRESS" }
  });
  if (activeCount >= runner.maxConcurrency) {
    return null;
  }

  const tasks = await prisma.task.findMany({
    where: {
      status: "READY_FOR_CODEX",
      OR: [{ runnerId: null }, { runnerId: runner.id }]
    },
    include: { project: true },
    orderBy: [{ priority: "asc" }, { updatedAt: "asc" }],
    take: 50
  });

  return tasks.find((task) => taskMatchesRunnerScope(task, runner.projectScopes)) ?? null;
}

export async function claimTaskForRunner(taskId: string, hostId: string) {
  await ensureDatabase();
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const runner = await tx.runner.findUnique({ where: { hostId } });
    if (!runner || !runner.isActive) {
      return { ok: false as const, error: "Runner is not registered or active." };
    }

    const activeCount = await tx.task.count({
      where: { runnerId: runner.id, status: "IN_PROGRESS" }
    });
    if (activeCount >= runner.maxConcurrency) {
      return { ok: false as const, error: "Runner concurrency limit reached." };
    }

    const task = await tx.task.findUnique({ where: { id: taskId }, include: { project: true } });
    if (!task) {
      return { ok: false as const, error: "Task not found." };
    }
    if (task.status !== "READY_FOR_CODEX") {
      return { ok: false as const, error: "Task is not ready for Codex." };
    }
    if (task.runnerId && task.runnerId !== runner.id) {
      return { ok: false as const, error: "Task is already assigned to another runner." };
    }
    if (!taskMatchesRunnerScope(task, runner.projectScopes)) {
      return { ok: false as const, error: "Task is outside this runner project scope." };
    }

    const claimedTask = await tx.task.update({
      where: { id: taskId },
      data: {
        runnerId: runner.id,
        claimedAt: now,
        startedAt: now,
        completedAt: null,
        status: "IN_PROGRESS"
      },
      include: { project: true, runner: true }
    });

    await tx.runner.update({
      where: { id: runner.id },
      data: { lastSeenAt: now }
    });

    return { ok: true as const, task: claimedTask };
  });
}

export async function completeRunnerTask(
  taskId: string,
  hostId: string,
  data: {
    executionResult?: string | null;
    resultSummary?: string | null;
    commitSha?: string | null;
    pullRequestUrl?: string | null;
    deployedUrl?: string | null;
    status: "REVIEW" | "DONE";
  }
) {
  await ensureDatabase();
  const runner = await prisma.runner.findUnique({ where: { hostId } });
  if (!runner) {
    return { ok: false as const, error: "Runner is not registered." };
  }

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.runnerId !== runner.id) {
    return { ok: false as const, error: "Task is not assigned to this runner." };
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      executionResult: data.executionResult,
      resultSummary: data.resultSummary ?? data.executionResult?.slice(0, 500),
      commitSha: data.commitSha,
      pullRequestUrl: data.pullRequestUrl,
      deployedUrl: data.deployedUrl,
      completedAt: new Date(),
      status: data.status
    },
    include: { project: true, runner: true }
  });

  await prisma.runner.update({ where: { id: runner.id }, data: { lastSeenAt: new Date() } });
  return { ok: true as const, task: updatedTask };
}

export async function failRunnerTask(
  taskId: string,
  hostId: string,
  data: { error: string; resultSummary?: string | null }
) {
  await ensureDatabase();
  const runner = await prisma.runner.findUnique({ where: { hostId } });
  if (!runner) {
    return { ok: false as const, error: "Runner is not registered." };
  }

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.runnerId !== runner.id) {
    return { ok: false as const, error: "Task is not assigned to this runner." };
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      executionResult: data.error,
      resultSummary: data.resultSummary ?? "Local runner execution failed.",
      completedAt: new Date(),
      status: "BLOCKED"
    },
    include: { project: true, runner: true }
  });

  await prisma.runner.update({ where: { id: runner.id }, data: { lastSeenAt: new Date() } });
  return { ok: true as const, task: updatedTask };
}
