import { notFound } from "next/navigation";
import { PageTitle } from "@/components/common/page-title";
import { getProject } from "@/features/projects/project-service";

export const dynamic = "force-dynamic";

export default async function ProjectReviewsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <PageTitle title={`${project.name} Reviews`} description="项目验收记录、风险等级和任务复盘。" />
      <div className="grid gap-4">
        {project.reviews.map((review) => (
          <article key={review.id} className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold text-zinc-950">{review.title}</h2>
              <span className="rounded-md border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600">
                risk: {review.riskLevel ?? "unknown"}
              </span>
            </div>
            {review.task ? <p className="mt-2 text-sm text-zinc-500">Task: {review.task.title}</p> : null}
            {review.checklist ? <p className="mt-4 text-sm leading-6 text-zinc-600">{review.checklist}</p> : null}
            {review.result ? <p className="mt-3 text-sm font-medium text-zinc-800">Result: {review.result}</p> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
