import type { AgentConfig, ProjectAgentBinding, Project } from "@prisma/client";
import type { ReactNode } from "react";
import { StatusBadge } from "@/components/common/status-badge";

type AgentConfigWithBindings = AgentConfig & {
  bindings?: Array<ProjectAgentBinding & { project?: Project }>;
};

export function AgentConfigTable({ configs, renderAction }: { configs: AgentConfigWithBindings[]; renderAction?: (config: AgentConfigWithBindings) => ReactNode }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {configs.map((config) => (
        <article key={config.id} className="rounded-lg border border-zinc-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-zinc-950">{config.name}</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {config.provider} · {config.role} · {config.model ?? "No model"} · {config.authMode === "ACCOUNT_LOGIN" ? "账号登录" : "API Key"}
              </p>
            </div>
            {config.isDefault ? <StatusBadge value="DONE" label="Default" /> : null}
          </div>
          {config.strategy ? (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-600">
              {config.strategy}
            </p>
          ) : null}
          {renderAction ? (
            <div className="mt-4">{renderAction(config)}</div>
          ) : null}
          <div className="mt-4 text-xs text-zinc-500">
            Bound projects: {config.bindings?.length ?? 0}
          </div>
        </article>
      ))}
    </div>
  );
}
