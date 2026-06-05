import { PageTitle } from "@/components/common/page-title";
import { ProjectForm } from "@/features/projects/project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="New Project" description="创建一个新的 AI 项目，并纳入 GPT 规划 + Codex 执行流。" />
      <ProjectForm />
    </div>
  );
}
