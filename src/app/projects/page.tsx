import Link from "next/link";
import { Plus } from "lucide-react";
import { PageTitle } from "@/components/common/page-title";
import { ProjectTable } from "@/features/projects/project-table";
import { listProjects } from "@/features/projects/project-service";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="space-y-6">
      <PageTitle
        title="Projects"
        description="集中管理 AI 项目的分类、优先级、阶段、GitHub 仓库和下一步动作。"
        action={
          <Link href="/projects/new" className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New
          </Link>
        }
      />
      <ProjectTable projects={projects} />
    </div>
  );
}
