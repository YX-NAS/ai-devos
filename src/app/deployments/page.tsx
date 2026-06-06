import { PageTitle } from "@/components/common/page-title";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { listDeployments } from "@/features/deployments/deployment-service";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DeploymentsPage() {
  const deployments = await listDeployments();

  return (
    <div className="space-y-6">
      <PageTitle title="Deployments" description="查看所有项目的生产部署记录和回滚历史。" />

      {deployments.length === 0 ? (
        <EmptyState title="暂无部署记录" description="在项目详情页或通过 API 创建部署记录。" />
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-white">
          <div className="divide-y divide-zinc-200">
            {deployments.map((deployment) => (
              <div key={deployment.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    {deployment.project ? (
                      <Link
                        href={`/projects/${deployment.project.id}`}
                        className="text-sm font-medium text-zinc-950 hover:text-zinc-600"
                      >
                        {deployment.project.name}
                      </Link>
                    ) : (
                      <p className="text-sm font-medium text-zinc-950">Unknown project</p>
                    )}
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <span>{deployment.environment}</span>
                      {deployment.version ? <span>v{deployment.version}</span> : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge value={deployment.status} label={deployment.status} />
                    {deployment.url ? (
                      <a
                        href={deployment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-zinc-500 hover:text-zinc-700"
                      >
                        Visit
                      </a>
                    ) : null}
                  </div>
                </div>
                {deployment.commitSha ? (
                  <p className="mt-2 font-mono text-xs text-zinc-400">
                    {deployment.commitSha}
                  </p>
                ) : null}
                {deployment.notes ? (
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {deployment.notes}
                  </p>
                ) : null}
                {deployment.task ? (
                  <Link
                    href={`/tasks/${deployment.task.id}`}
                    className="mt-2 inline-block text-xs font-medium text-zinc-500 hover:text-zinc-700"
                  >
                    Task: {deployment.task.title}
                  </Link>
                ) : null}
                <p className="mt-2 text-xs text-zinc-400">
                  {deployment.createdAt.toLocaleString("zh-CN")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
