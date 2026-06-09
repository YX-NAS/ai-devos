import { generateCodexPrompt } from "@/features/task-templates/codex-prompt-generator";

export interface ParsedPlan {
  projectName: string;
  planningSummary: string;
  codexBudgetNotes: string;
  tasks: ParsedTask[];
}

export interface ParsedTask {
  title: string;
  description: string;
  goal: string;
  scope: string;
  implementationPlan: string;
  relatedFiles: string;
  acceptanceCriteria: string;
  requiresCommit: boolean;
  requiresPush: boolean;
  requiresDeployment: boolean;
  codexPrompt: string;
}

export function parsePlanningOutput(rawOutput: string): ParsedPlan {
  const projectName = extractSection(rawOutput, "项目名称", "") || "Codex Auto-Plan";
  const planningSummary = extractSection(rawOutput, "规划摘要", "") || "";
  const codexBudgetNotes = extractSection(rawOutput, "Codex 省额度说明", "") || extractSection(rawOutput, "省额度说明", "") || "";

  const tasks = extractTasks(rawOutput);

  return {
    projectName,
    planningSummary,
    codexBudgetNotes,
    tasks: tasks.map((t) => {
      const codexPrompt = generateCodexPrompt({
        title: t.title,
        goal: t.goal,
        scope: t.scope,
        planningSummary,
        implementationPlan: t.implementationPlan,
        codexBudgetNotes,
        relatedFiles: t.relatedFiles,
        acceptanceCriteria: t.acceptanceCriteria,
        requiresCommit: t.requiresCommit,
        requiresPush: t.requiresPush,
        requiresDeployment: t.requiresDeployment
      });

      return { ...t, codexPrompt };
    })
  };
}

function extractSection(text: string, heading: string, fallback: string): string {
  const patterns = [
    new RegExp(`##\\s+${heading}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, "i"),
    new RegExp(`#\\s+${heading}\\s*\\n([\\s\\S]*?)(?=\\n#\\s|$)`, "i"),
    new RegExp(`${heading}[：:]\\s*([\\s\\S]*?)(?=\\n##|\\n#|$)`, "i")
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return fallback;
}

function extractTasks(text: string): ParsedTask[] {
  const tasks: ParsedTask[] = [];
  const taskRegex = /###\s*任务\s*(\d+)[:：]\s*(.+?)(?=\n###\s*任务|\n##\s|$)/g;

  let match;
  while ((match = taskRegex.exec(text)) !== null) {
    const block = match[2] || "";
    const titleMatch = block.match(/^(.+)/);
    const title = titleMatch?.[1]?.trim() || `Task ${match[1]}`;

    tasks.push({
      title,
      description: extractField(block, "描述") || title,
      goal: extractField(block, "目标") || "",
      scope: extractField(block, "范围") || extractField(block, "改动范围") || "",
      implementationPlan: extractField(block, "实现步骤") || extractField(block, "步骤") || "",
      relatedFiles: extractField(block, "相关文件") || extractField(block, "涉及文件") || "",
      acceptanceCriteria: extractField(block, "验收标准") || extractField(block, "验收条件") || extractField(block, "完成标准") || "",
      requiresCommit: extractYesNo(block, "需要commit") || extractYesNo(block, "commit"),
      requiresPush: extractYesNo(block, "需要push") || extractYesNo(block, "push"),
      requiresDeployment: extractYesNo(block, "需要部署") || extractYesNo(block, "部署"),
      codexPrompt: "" // Will be filled later
    });
  }

  return tasks;
}

function extractField(block: string, field: string): string {
  const patterns = [
    new RegExp(`-\\s*${field}[：:]\\s*(.+)`, "i"),
    new RegExp(`${field}[：:]\\s*(.+)`, "i"),
    new RegExp(`\\*\\*${field}\\*\\*[：:]?\\s*(.+)`, "i")
  ];

  for (const pattern of patterns) {
    const match = block.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return "";
}

function extractYesNo(block: string, field: string): boolean {
  const value = extractField(block, field).toLowerCase();
  return value.includes("是") || value.includes("yes") || value.includes("true") || value.includes("1");
}
