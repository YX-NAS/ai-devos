import { notFound } from "next/navigation";
import { PageTitle } from "@/components/common/page-title";
import { EmptyState } from "@/components/common/empty-state";
import { StatusBadge } from "@/components/common/status-badge";
import { ProjectActions } from "./project-actions";
import { getProject } from "@/features/projects/project-service";
import { projectCategoryLabels, projectStageLabels, taskStatusLabels } from "@/lib/constants";

export const dynamic = "force-dynamic";

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title={project.name}
        description={`${project.repoName ?? "No repo"} · ${projectCategoryLabels[project.category]}`}
      />
      

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <StatusBadge value={project.priority} />
          <StatusBadge value={project.stage} label={projectStageLabels[project.stage]} />
        </div>
        <ProjectActions project={project} />
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-zinc-950">当前目标</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">{project.currentGoal ?? "未设置"}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-zinc-950">当前任务</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            {project.tasks.find((task) => task.status !== "DONE")?.title ?? "暂无任务"}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-zinc-950">下一步动作</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">{project.nextAction ?? "未设置"}</p>
        </div>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-5 py-4">
          <h2 className="font-semibold text-zinc-950">Agent Config Binding</h2>
          <p className="mt-1 text-sm text-zinc-500">项目默认 ChatGPT / Codex 配置，API Key 可选且不在当前页面明文保存。</p>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2">
          {project.agentBindings.length > 0 ? (
            project.agentBindings.map((binding) => (
              <div key={binding.id} className="rounded-md border border-zinc-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-zinc-950">{binding.purpose}</p>
                  <StatusBadge value={binding.config.role} label={binding.config.provider} />
                </div>
                <p className="mt-2 text-sm text-zinc-700">{binding.config.name}</p>
                {binding.config.strategy ? (
                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-zinc-500">
                    {binding.config.strategy}
                  </p>
                ) : null}
              </div>
            ))
          ) : (
            <EmptyState title="暂无 Agent 绑定" description="可在 Settings 创建默认 ChatGPT/Codex 配置后绑定项目。" />
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="font-semibold text-zinc-950">Requirements</h2>
          </div>
          <div className="divide-y divide-zinc-200">
            {project.requirements.map((item) => (
              <div key={item.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-zinc-950">{item.title}</p>
                  <StatusBadge value={item.priority} />
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{item.description}</p>
              </div>
            ))}
            {project.requirements.length === 0 ? <div className="p-5"><EmptyState title="暂无需求" /></div> : null}
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="font-semibold text-zinc-950">Tasks</h2>
          </div>
          <div className="divide-y divide-zinc-200">
            {project.tasks.map((task) => (
              <div key={task.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-zinc-950">{task.title}</p>
                  <StatusBadge value={task.status} label={taskStatusLabels[task.status]} />
                </div>
                {task.acceptanceCriteria ? (
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{task.acceptanceCriteria}</p>
                ) : null}
                {task.planningSummary || task.implementationPlan || task.codexBudgetNotes ? (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs font-medium text-zinc-500">
                      ChatGPT Handoff
                    </summary>
                    <div className="mt-2 space-y-2 rounded-md bg-zinc-50 p-3 text-xs leading-5 text-zinc-700">
                      {task.planningSummary ? (
                        <p><span className="font-semibold">规划摘要：</span>{task.planningSummary}</p>
                      ) : null}
                      {task.implementationPlan ? (
                        <p><span className="font-semibold">实现步骤：</span>{task.implementationPlan}</p>
                      ) : null}
                      {task.codexBudgetNotes ? (
                        <p><span className="font-semibold">省额度说明：</span>{task.codexBudgetNotes}</p>
                      ) : null}
                    </div>
                  </details>
                ) : null}
                {task.codexPrompt ? (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs font-medium text-zinc-500">Codex Prompt</summary>
                    <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-zinc-50 p-3 text-xs leading-5 text-zinc-700">
                      {task.codexPrompt}
                    </pre>
                  </details>
                ) : null}
              </div>
            ))}
            {project.tasks.length === 0 ? <div className="p-5"><EmptyState title="暂无任务" /></div> : null}
          </div>
        </div>
      </section>
    </div>
  );
}
