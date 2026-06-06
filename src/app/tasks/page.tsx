import { PageTitle } from "@/components/common/page-title";
import { KanbanBoard } from "@/features/kanban/kanban-board";
import { listTasks } from "@/features/tasks/task-service";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const tasks = await listTasks();

  return (
    <div className="space-y-6">
      <PageTitle title="Tasks" description="统一查看全部项目的 Codex 任务状态和执行队列。" />
      <KanbanBoard tasks={tasks} />
    </div>
  );
}
