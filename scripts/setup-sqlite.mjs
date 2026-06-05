import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";

const dbPath = join(process.cwd(), "prisma", "dev.db");
mkdirSync(dirname(dbPath), { recursive: true });

const schema = `
PRAGMA foreign_keys=OFF;

DROP TABLE IF EXISTS "WorkflowEvent";
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
  "scope" TEXT,
  "acceptanceCriteria" TEXT,
  "codexPrompt" TEXT,
  "resultSummary" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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

CREATE INDEX "Requirement_projectId_idx" ON "Requirement"("projectId");
CREATE INDEX "DesignDocument_projectId_idx" ON "DesignDocument"("projectId");
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");
CREATE INDEX "Prompt_projectId_idx" ON "Prompt"("projectId");
CREATE INDEX "Review_projectId_idx" ON "Review"("projectId");
CREATE INDEX "Review_taskId_idx" ON "Review"("taskId");
CREATE INDEX "WorkflowEvent_projectId_idx" ON "WorkflowEvent"("projectId");

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
