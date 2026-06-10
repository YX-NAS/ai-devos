import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";

const dbPath = join(process.cwd(), "prisma", "dev.db");
mkdirSync(dirname(dbPath), { recursive: true });

const schema = `
PRAGMA foreign_keys=OFF;

DROP TABLE IF EXISTS "WorkflowEvent";
DROP TABLE IF EXISTS "ProjectAgentBinding";
DROP TABLE IF EXISTS "AgentConfig";
DROP TABLE IF EXISTS "Runner";
DROP TABLE IF EXISTS "Review";
DROP TABLE IF EXISTS "Prompt";
DROP TABLE IF EXISTS "Task";
DROP TABLE IF EXISTS "DesignDocument";
DROP TABLE IF EXISTS "Requirement";
DROP TABLE IF EXISTS "Project";

CREATE TABLE "Project" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "repoName" TEXT,
  "repoUrl" TEXT,
  "category" TEXT NOT NULL DEFAULT 'AI_PRODUCT',
  "priority" TEXT NOT NULL DEFAULT 'P2',
  "stage" TEXT NOT NULL DEFAULT 'IDEA',
  "owner" TEXT,
  "currentGoal" TEXT,
  "nextAction" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Requirement" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "priority" TEXT NOT NULL DEFAULT 'P2',
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Requirement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "DesignDocument" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "DesignDocument_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Task" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'TODO',
  "priority" TEXT NOT NULL DEFAULT 'P2',
  "epic" TEXT,
  "story" TEXT,
  "goal" TEXT,
  "scope" TEXT,
  "planningSummary" TEXT,
  "implementationPlan" TEXT,
  "codexBudgetNotes" TEXT,
  "relatedFiles" TEXT,
  "acceptanceCriteria" TEXT,
  "requiresCommit" BOOLEAN NOT NULL DEFAULT false,
  "requiresPush" BOOLEAN NOT NULL DEFAULT false,
  "requiresDeployment" BOOLEAN NOT NULL DEFAULT false,
  "codexPrompt" TEXT,
  "resultSummary" TEXT,
  "executionResult" TEXT,
  "commitSha" TEXT,
  "pullRequestUrl" TEXT,
  "deployedUrl" TEXT,
  "runnerId" TEXT,
  "claimedAt" DATETIME,
  "startedAt" DATETIME,
  "completedAt" DATETIME,
  "reviewedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Runner" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "hostId" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "baseUrl" TEXT,
  "capabilities" TEXT,
  "projectScopes" TEXT,
  "maxConcurrency" INTEGER NOT NULL DEFAULT 1,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "lastSeenAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Prompt" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT,
  "title" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'GPT_PLANNING',
  "content" TEXT NOT NULL,
  "tags" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Prompt_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Review" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "taskId" TEXT,
  "title" TEXT NOT NULL,
  "checklist" TEXT,
  "result" TEXT,
  "riskLevel" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Review_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Review_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "WorkflowEvent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "agentType" TEXT NOT NULL,
  "fromStage" TEXT,
  "toStage" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WorkflowEvent_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "AgentConfig" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "model" TEXT,
  "endpoint" TEXT,
  "apiKeyRef" TEXT,
  "strategy" TEXT,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "ProjectAgentBinding" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "projectId" TEXT NOT NULL,
  "configId" TEXT NOT NULL,
  "purpose" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProjectAgentBinding_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ProjectAgentBinding_configId_fkey" FOREIGN KEY ("configId") REFERENCES "AgentConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Requirement_projectId_idx" ON "Requirement"("projectId");
CREATE INDEX "DesignDocument_projectId_idx" ON "DesignDocument"("projectId");
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");
CREATE INDEX "Task_runnerId_idx" ON "Task"("runnerId");
CREATE INDEX "Runner_hostId_idx" ON "Runner"("hostId");
CREATE INDEX "Prompt_projectId_idx" ON "Prompt"("projectId");
CREATE INDEX "Review_projectId_idx" ON "Review"("projectId");
CREATE INDEX "Review_taskId_idx" ON "Review"("taskId");
CREATE INDEX "WorkflowEvent_projectId_idx" ON "WorkflowEvent"("projectId");
CREATE INDEX "ProjectAgentBinding_projectId_idx" ON "ProjectAgentBinding"("projectId");
CREATE INDEX "ProjectAgentBinding_configId_idx" ON "ProjectAgentBinding"("configId");

PRAGMA foreign_keys=ON;
`;

const schemaPath = join(process.cwd(), "prisma", "init.sql");
writeFileSync(schemaPath, schema);

const result = spawnSync("sqlite3", [dbPath, `.read ${schemaPath}`], {
  stdio: "inherit"
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(`SQLite schema created at ${dbPath}`);
