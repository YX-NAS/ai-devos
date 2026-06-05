import { PageTitle } from "@/components/common/page-title";
import { WorkflowTimeline } from "@/features/workflows/workflow-timeline";

export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Workflows" description="标准流程从 Idea 到 Done，帮助项目在规划、实现、评审之间有序流转。" />
      <WorkflowTimeline />
    </div>
  );
}
