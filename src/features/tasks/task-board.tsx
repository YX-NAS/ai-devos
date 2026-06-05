import type { Task, Project, TaskStatus } from "@prisma/client";
import { taskStatusLabels } from "@/lib/constants";
import { StatusBadge } from "@/components/common/status-badge";

type TaskWithProject = Task & { project?: Project };

const columns: TaskStatus[] = [
  "TODO",
  "RESEARCH",
  "DESIGN",
  "READY_FOR_CODEX",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
  "BLOCKED"
];

export function TaskBoard({ tasks }: { tasks: TaskWithProject[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {columns.map((status) => {
        const columnTasks = tasks.filter((task) => task.status === status);
        return (
          <section key={status} className="min-h-52 rounded-lg border border-zinc-200 bg-white">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-zinc-900">{taskStatusLabels[status]}</h2>
              <span className="text-xs text-zinc-500">{columnTasks.length}</span>
            </div>
            <div className="space-y-3 p-3">
              {columnTasks.map((task) => (
                <article key={task.id} className="rounded-md border border-zinc-200 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium leading-5 text-zinc-950">{task.title}</h3>
                    <StatusBadge value={task.priority} className="shrink-0" />
                  </div>
                  {task.description ? (
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">
                      {task.description}
                    </p>
                  ) : null}
                  {task.project ? (
                    <p className="mt-3 text-xs font-medium text-zinc-600">{task.project.name}</p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
