import { notFound } from "next/navigation";
import { PageTitle } from "@/components/common/page-title";
import { TaskBoard } from "@/features/tasks/task-board";
import { getProject } from "@/features/projects/project-service";
import { TaskTemplateForm } from "@/features/task-templates/task-template-form";

export const dynamic = "force-dynamic";

export default async function ProjectTasksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <PageTitle title={`${project.name} Tasks`} description="当前项目的 Codex 执行任务看板。" />
      <TaskTemplateForm projectId={project.id} />
      <TaskBoard tasks={project.tasks.map((task) => ({ ...task, project }))} />
    </div>
  );
}
