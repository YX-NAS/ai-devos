import { notFound } from "next/navigation";
import { PageTitle } from "@/components/common/page-title";
import { StatusBadge } from "@/components/common/status-badge";
import { getProject } from "@/features/projects/project-service";

export const dynamic = "force-dynamic";

export default async function ProjectRequirementsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <PageTitle title={`${project.name} Requirements`} description="项目需求池，记录优先级、状态与验收上下文。" />
      <div className="grid gap-4">
        {project.requirements.map((item) => (
          <article key={item.id} className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold text-zinc-950">{item.title}</h2>
              <StatusBadge value={item.priority} />
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-600">{item.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
