import Link from "next/link";
import type { Project } from "@prisma/client";
import { projectStageLabels } from "@/lib/constants";
import { StatusBadge } from "@/components/common/status-badge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="block rounded-lg border border-zinc-200 bg-white p-5 hover:border-zinc-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-zinc-950">{project.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">
            {project.description}
          </p>
        </div>
        <StatusBadge value={project.priority} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge value={project.stage} label={projectStageLabels[project.stage]} />
        {project.repoName ? (
          <span className="inline-flex h-7 items-center rounded-md border border-zinc-200 px-2.5 text-xs text-zinc-600">
            {project.repoName}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
