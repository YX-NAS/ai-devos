import { notFound } from "next/navigation";
import { PageTitle } from "@/components/common/page-title";
import { EmptyState } from "@/components/common/empty-state";
import { StatusBadge } from "@/components/common/status-badge";
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
      <div className="flex flex-wrap gap-2">
        <StatusBadge value={project.priority} />
        <StatusBadge value={project.stage} label={projectStageLabels[project.stage]} />
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
              </div>
            ))}
            {project.tasks.length === 0 ? <div className="p-5"><EmptyState title="暂无任务" /></div> : null}
          </div>
        </div>
      </section>
    </div>
  );
}
