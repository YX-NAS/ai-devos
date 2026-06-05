import { notFound } from "next/navigation";
import { PageTitle } from "@/components/common/page-title";
import { getProject } from "@/features/projects/project-service";

export const dynamic = "force-dynamic";

export default async function ProjectDesignsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <PageTitle title={`${project.name} Designs`} description="项目技术设计、产品设计与版本记录。" />
      <div className="grid gap-4">
        {project.designs.map((design) => (
          <article key={design.id} className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold text-zinc-950">{design.title}</h2>
              <span className="text-xs font-medium text-zinc-500">{design.type} · v{design.version}</span>
            </div>
            <pre className="mt-4 whitespace-pre-wrap rounded-md bg-zinc-50 p-4 text-sm leading-6 text-zinc-700">
              {design.content}
            </pre>
          </article>
        ))}
      </div>
    </div>
  );
}
