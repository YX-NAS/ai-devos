import Link from "next/link";
import { EmptyState } from "@/components/common/empty-state";
import { PageTitle } from "@/components/common/page-title";
import { StatusBadge } from "@/components/common/status-badge";
import { listRunners } from "@/features/runners/runner-service";

export const dynamic = "force-dynamic";

function formatDate(date?: Date | null) {
  if (!date) {
    return "Never";
  }

  return date.toLocaleString("zh-CN");
}

function formatList(value?: string | null) {
  return (value ?? "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function RunnersPage() {
  const runners = await listRunners();

  return (
    <div className="space-y-6">
      <PageTitle
        title="Runners"
        description="配置多台本地主机作为 Codex 执行节点，按项目范围和并发数领取 READY_FOR_CODEX 任务。"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">Step 1</p>
          <p className="mt-2 text-sm font-medium text-zinc-950">复制配置</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            从 `runner.config.example.json` 创建每台主机自己的 `runner.config.json`。
          </p>
        </div>
        <div className="border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">Step 2</p>
          <p className="mt-2 text-sm font-medium text-zinc-950">设置账号</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            本机设置 `AI_DEVOS_ADMIN_PASSWORD`，Codex 在本机登录并配置 `codexBin`。
          </p>
        </div>
        <div className="border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">Step 3</p>
          <p className="mt-2 text-sm font-medium text-zinc-950">启动 Runner</p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            运行 `npm run runner:codex`，每台主机用唯一 `hostId` 和项目范围并行工作。
          </p>
        </div>
      </div>

      {runners.length === 0 ? (
        <EmptyState title="暂无本地执行节点" description="启动本地 runner 后，这里会显示主机状态和任务记录。" />
      ) : (
        <div className="space-y-4">
          {runners.map((runner) => {
            const capabilities = formatList(runner.capabilities);
            const projectScopes = formatList(runner.projectScopes);

            return (
              <section key={runner.id} className="border border-zinc-200 bg-white">
                <div className="flex flex-col gap-4 border-b border-zinc-200 p-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-semibold text-zinc-950">{runner.name}</h2>
                      <StatusBadge
                        value={runner.isActive ? "active" : "disabled"}
                        label={runner.isActive ? "Active" : "Disabled"}
                      />
                    </div>
                    <p className="mt-1 font-mono text-xs text-zinc-500">{runner.hostId}</p>
                    {runner.description ? (
                      <p className="mt-3 text-sm leading-6 text-zinc-600">{runner.description}</p>
                    ) : null}
                  </div>
                  <div className="grid gap-2 text-sm text-zinc-600 sm:grid-cols-2 md:min-w-80">
                    <div>
                      <span className="text-zinc-400">Last seen</span>
                      <p className="font-medium text-zinc-900">{formatDate(runner.lastSeenAt)}</p>
                    </div>
                    <div>
                      <span className="text-zinc-400">Concurrency</span>
                      <p className="font-medium text-zinc-900">{runner.maxConcurrency}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-5 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">
                      Project scopes
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {projectScopes.length > 0 ? (
                        projectScopes.map((scope) => (
                          <span key={scope} className="border border-zinc-200 px-2 py-1 text-xs text-zinc-600">
                            {scope}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-zinc-500">All projects</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">
                      Capabilities
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {capabilities.length > 0 ? (
                        capabilities.map((capability) => (
                          <span
                            key={capability}
                            className="border border-zinc-200 px-2 py-1 text-xs text-zinc-600"
                          >
                            {capability}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-zinc-500">Not set</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-200 p-5">
                  <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">Recent tasks</p>
                  {runner.tasks.length === 0 ? (
                    <p className="mt-2 text-sm text-zinc-500">No recent assigned tasks.</p>
                  ) : (
                    <div className="mt-3 divide-y divide-zinc-100">
                      {runner.tasks.map((task) => (
                        <div key={task.id} className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <Link
                              href={`/tasks/${task.id}`}
                              className="text-sm font-medium text-zinc-950 hover:text-zinc-600"
                            >
                              {task.title}
                            </Link>
                            <p className="mt-1 text-xs text-zinc-500">{task.project.name}</p>
                          </div>
                          <StatusBadge value={task.status} label={task.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
