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
  const blocks: { title: string; block: string }[] = [];
  
  // Strategy 1: ### 任务 N: title (Chinese)
  let headerRegex = /###\s*任务\s*(\d+)[:：]\s*(.+)/g;
  let matches = [...text.matchAll(headerRegex)];
  if (matches.length > 0) {
    for (const m of matches) {
      const headerPos = text.indexOf(m[0]);
      const after = text.slice(headerPos + m[0].length);
      const next = after.search(/\n###\s*任务|\n##\s|\n---/);
      blocks.push({ title: m[2].trim(), block: next >= 0 ? after.slice(0, next) : after });
    }
  }
  
  // Strategy 2: ### Task N: or ### N. title (English)
  if (blocks.length === 0) {
    headerRegex = /###\s*(?:Task\s*)?(\d+)[.:)]\s*(.+)/gi;
    matches = [...text.matchAll(headerRegex)];
    for (const m of matches) {
      const headerPos = text.indexOf(m[0]);
      const after = text.slice(headerPos + m[0].length);
      const next = after.search(/\n###\s|\n##\s|\n---/);
      blocks.push({ title: m[2].trim(), block: next >= 0 ? after.slice(0, next) : after });
    }
  }
  
  // Strategy 3: **任务 N**: or **Task N**: (bold markdown)
  if (blocks.length === 0) {
    headerRegex = /\*\*(?:Task\s*|任务\s*)?(\d+)\*\*[：:]\s*(.+)/gi;
    matches = [...text.matchAll(headerRegex)];
    for (const m of matches) {
      const headerPos = text.indexOf(m[0]);
      const after = text.slice(headerPos + m[0].length);
      const next = after.search(/\n\*\*(?:Task|任务)|\n##|\n---/);
      blocks.push({ title: m[2].trim(), block: next >= 0 ? after.slice(0, next) : after });
    }
  }
  
  // Strategy 4: Numbered list with **Title** (e.g., 1. **Feature X**)
  if (blocks.length === 0) {
    headerRegex = /^\d+[.)]\s*\*\*(.+?)\*\*/gm;
    matches = [...text.matchAll(headerRegex)];
    for (const m of matches) {
      const headerPos = text.indexOf(m[0]);
      const after = text.slice(headerPos + m[0].length);
      const next = after.search(/\n\d+[.)]\s*\*\*|\n##|\n---/);
      blocks.push({ title: m[1].trim(), block: next >= 0 ? after.slice(0, next) : after });
    }
  }

  // Build tasks from extracted blocks
  for (const { title, block } of blocks) {
    tasks.push({
      title,
      description: extractField(block, "描述") || extractField(block, "description") || extractField(block, "说明") || title,
      goal: extractField(block, "目标") || extractField(block, "goal") || "",
      scope: extractField(block, "范围") || extractField(block, "scope") || extractField(block, "改动范围") || "",
      implementationPlan: extractField(block, "实现步骤") || extractField(block, "步骤") || extractField(block, "steps") || "",
      relatedFiles: extractField(block, "相关文件") || extractField(block, "files") || extractField(block, "涉及文件") || "",
      acceptanceCriteria: extractField(block, "验收标准") || extractField(block, "acceptance") || extractField(block, "验收条件") || "",
      requiresCommit: extractYesNo(block, "需要commit") || extractYesNo(block, "commit"),
      requiresPush: extractYesNo(block, "需要push") || extractYesNo(block, "push"),
      requiresDeployment: extractYesNo(block, "需要部署") || extractYesNo(block, "deploy") || extractYesNo(block, "部署"),
      codexPrompt: ""
    });
  }

  return tasks;
}function extractField(block: string, field: string): string {
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
