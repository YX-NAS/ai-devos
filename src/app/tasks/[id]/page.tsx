import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { PageTitle } from "@/components/common/page-title";
import { StatusBadge } from "@/components/common/status-badge";
import { getTask, updateTaskStatus } from "@/features/tasks/task-service";
import { taskStatusLabels } from "@/lib/constants";
import type { TaskStatus } from "@prisma/client";
import { CopyPromptButton } from "./copy-prompt-button";
import { TaskEditForm } from "./task-edit-form";

export const dynamic = "force-dynamic";

type TaskDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;
  const task = await getTask(id);

  if (!task) {
    notFound();
  }

  async function handleStatusChange(formData: FormData) {
    "use server";
    const status = formData.get("status") as TaskStatus;
    await updateTaskStatus(id, status);
    redirect(`/tasks/${id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <PageTitle title={task.title} description={task.description ?? ""} />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge value={task.status} label={taskStatusLabels[task.status]} />
            <StatusBadge value={task.priority} />
            {task.project ? (
              <Link
                href={`/projects/${task.project.id}`}
                className="text-sm font-medium text-zinc-500 hover:text-zinc-700"
              >
                {task.project.name}
              </Link>
            ) : null}
          </div>
        </div>
        <form action={handleStatusChange} className="flex items-center gap-2">
          <select
            name="status"
            defaultValue={task.status}
            className="h-9 rounded-md border border-zinc-300 px-3 text-sm"
          >
            {Object.entries(taskStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="inline-flex h-9 items-center rounded-md bg-zinc-950 px-3 text-sm font-medium text-white"
          >
            Update
          </button>
        </form>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-zinc-950">目标</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{task.goal ?? "未设置"}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-zinc-950">范围</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{task.scope ?? "未设置"}</p>
        </div>
      </section>

      {task.planningSummary || task.implementationPlan || task.codexBudgetNotes ? (
        <section className="rounded-lg border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="font-semibold text-zinc-950">ChatGPT Handoff</h2>
          </div>
          <div className="space-y-4 p-5">
            {task.planningSummary ? (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">规划摘要</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-700">{task.planningSummary}</p>
              </div>
            ) : null}
            {task.implementationPlan ? (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">实现步骤</h3>
                <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">{task.implementationPlan}</pre>
              </div>
            ) : null}
            {task.codexBudgetNotes ? (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">省额度说明</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-700">{task.codexBudgetNotes}</p>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {task.codexPrompt ? (
        <section className="rounded-lg border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
            <h2 className="font-semibold text-zinc-950">Codex Prompt</h2>
            <CopyPromptButton prompt={task.codexPrompt} />
          </div>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap p-5 text-sm leading-6 text-zinc-700">
            {task.codexPrompt}
          </pre>
        </section>
      ) : null}

      <section className="rounded-lg border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-5 py-4">
          <h2 className="font-semibold text-zinc-950">执行结果</h2>
        </div>
        <div className="p-5">
          <TaskEditForm taskId={task.id} task={task} />
        </div>
      </section>

      {task.relatedFiles ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-zinc-950">相关文件</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{task.relatedFiles}</p>
        </div>
      ) : null}

      {task.acceptanceCriteria ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-zinc-950">验收标准</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{task.acceptanceCriteria}</p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
        {task.requiresCommit ? <span className="rounded-md bg-zinc-100 px-2 py-1">需要 commit</span> : null}
        {task.requiresPush ? <span className="rounded-md bg-zinc-100 px-2 py-1">需要 push</span> : null}
        {task.requiresDeployment ? <span className="rounded-md bg-zinc-100 px-2 py-1">需要部署</span> : null}
      </div>

      {task.reviews.length > 0 ? (
        <section className="rounded-lg border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="font-semibold text-zinc-950">Reviews</h2>
          </div>
          <div className="divide-y divide-zinc-200">
            {task.reviews.map((review) => (
              <div key={review.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-zinc-950">{review.title}</p>
                  {review.result ? <StatusBadge value={review.result} /> : null}
                </div>
                {review.riskLevel ? (
                  <p className="mt-1 text-xs text-zinc-500">Risk: {review.riskLevel}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
