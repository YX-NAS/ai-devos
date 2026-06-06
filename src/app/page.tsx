import Link from "next/link";
import { ArrowRight, Blocks, CircleDot, GitPullRequest, ShieldAlert } from "lucide-react";
import { PageTitle } from "@/components/common/page-title";
import { ProjectCard } from "@/features/projects/project-card";
import { getDashboardData } from "@/features/projects/project-service";
import { StatusBadge } from "@/components/common/status-badge";
import { taskStatusLabels } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { DashboardCharts } from "@/features/charts/dashboard-charts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { projects, tasks, stats } = await getDashboardData();
  const statCards = [
    { label: "项目总数", value: stats.totalProjects, icon: Blocks },
    { label: "Ready for Codex", value: stats.readyForCodex, icon: GitPullRequest },
    { label: "进行中", value: stats.inProgress, icon: CircleDot },
    { label: "阻塞", value: stats.blocked, icon: ShieldAlert }
  ];

  return (
    <div className="space-y-8">
      <PageTitle
        title="AI DevOS Dashboard"
        description="GPT 规划 + Codex 执行的 AI 开发总控台，集中管理项目、需求、任务、Prompt 和验收流程。"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-lg border border-zinc-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-500">{card.label}</p>
                <Icon className="h-4 w-4 text-zinc-500" aria-hidden="true" />
              </div>
              <p className="mt-4 text-3xl font-semibold text-zinc-950">{card.value}</p>
            </div>
          );
        })}
      </section>

      <section>
        <DashboardCharts tasks={tasks} />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-950">核心项目列表</h2>
          <Link href="/projects" className="flex items-center gap-1 text-sm font-medium text-zinc-700">
            View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.slice(0, 4).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-zinc-950">最近任务</h2>
        </div>
        <div className="divide-y divide-zinc-200">
          {tasks.map((task) => (
            <div key={task.id} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium text-zinc-950">{task.title}</p>
                <p className="mt-1 text-sm text-zinc-500">
                  {task.project.name} · 更新于 {formatDate(task.updatedAt)}
                </p>
              </div>
              <StatusBadge value={task.status} label={taskStatusLabels[task.status]} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
