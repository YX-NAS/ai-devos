"use client";

import { Code, Bug, Wrench, FileText, Zap, Plus } from "lucide-react";

export interface PromptTemplate {
  id: string;
  icon: "code" | "bug" | "wrench" | "file" | "zap" | "plus";
  label: string;
  goal: string;
  scope: string;
}

const iconMap = {
  code: Code, bug: Bug, wrench: Wrench, file: FileText, zap: Zap, plus: Plus
};

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: "feature",
    icon: "plus",
    label: "新功能开发",
    goal: "为 [项目名称] 添加 [功能描述]，包含前端页面、后端API和数据库模型",
    scope: "前端页面 + 后端API + 数据库，不涉及第三方服务集成"
  },
  {
    id: "bugfix",
    icon: "bug",
    label: "Bug 修复",
    goal: "修复 [项目名称] 的 [Bug描述]，确保回归测试通过",
    scope: "定位根因 + 修复代码 + 添加测试，不涉及架构变更"
  },
  {
    id: "refactor",
    icon: "wrench",
    label: "代码重构",
    goal: "重构 [项目名称] 的 [模块名称]，改善代码结构和可维护性",
    scope: "保持现有功能不变，只改善代码质量和性能"
  },
  {
    id: "docs",
    icon: "file",
    label: "文档编写",
    goal: "为 [项目名称] 编写 [文档类型]，包含使用说明和API参考",
    scope: "项目内已有的代码和功能，不新增代码"
  },
  {
    id: "optimize",
    icon: "zap",
    label: "性能优化",
    goal: "优化 [项目名称] 的 [性能瓶颈]，提升响应速度和资源利用率",
    scope: "分析瓶颈 + 实施优化 + 基准测试对比"
  },
  {
    id: "custom",
    icon: "code",
    label: "自定义",
    goal: "",
    scope: ""
  }
];

export function PromptTemplates({
  onSelect
}: {
  onSelect: (template: PromptTemplate) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-zinc-500">模板</p>
      <div className="grid grid-cols-3 gap-2">
        {PROMPT_TEMPLATES.map((t) => {
          const Icon = iconMap[t.icon];
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t)}
              className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-2 text-xs font-medium text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
