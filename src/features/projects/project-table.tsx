import Link from "next/link";
import type { Project, ProjectCategory, ProjectStage } from "@prisma/client";
import { projectCategoryLabels, projectStageLabels } from "@/lib/constants";
import { StatusBadge } from "@/components/common/status-badge";

type ProjectRow = Project & {
  _count?: {
    tasks: number;
    requirements: number;
    designs: number;
    reviews: number;
    workflows: number;
  };
};

export function ProjectTable({ projects }: { projects: ProjectRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase tracking-normal text-zinc-500">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium">Stage</th>
            <th className="px-4 py-3 font-medium">GitHub</th>
            <th className="px-4 py-3 font-medium">Next Action</th>
            <th className="px-4 py-3 font-medium">Tasks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-zinc-50">
              <td className="px-4 py-4">
                <Link href={`/projects/${project.id}`} className="font-medium text-zinc-950">
                  {project.name}
                </Link>
                <p className="mt-1 line-clamp-1 text-xs text-zinc-500">{project.description}</p>
              </td>
              <td className="px-4 py-4 text-zinc-700">
                {projectCategoryLabels[project.category as ProjectCategory]}
              </td>
              <td className="px-4 py-4">
                <StatusBadge value={project.priority} />
              </td>
              <td className="px-4 py-4">
                <StatusBadge
                  value={project.stage}
                  label={projectStageLabels[project.stage as ProjectStage]}
                />
              </td>
              <td className="px-4 py-4">
                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-700 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-950"
                  >
                    {project.repoName ?? "repo"}
                  </a>
                ) : (
                  <span className="text-zinc-400">-</span>
                )}
              </td>
              <td className="max-w-xs px-4 py-4 text-zinc-600">{project.nextAction ?? "-"}</td>
              <td className="px-4 py-4 text-zinc-700">{project._count?.tasks ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
