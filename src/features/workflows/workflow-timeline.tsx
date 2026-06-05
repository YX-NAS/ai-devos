import { workflowStages, projectStageLabels } from "@/lib/constants";

export function WorkflowTimeline() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6">
      <div className="grid gap-3 md:grid-cols-7">
        {workflowStages.map((stage, index) => (
          <div key={stage} className="relative">
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 text-center">
              <span className="text-xs font-medium text-zinc-500">Step {index + 1}</span>
              <p className="mt-2 text-sm font-semibold text-zinc-950">
                {projectStageLabels[stage]}
              </p>
            </div>
            {index < workflowStages.length - 1 ? (
              <div className="hidden md:absolute md:left-full md:top-1/2 md:block md:h-px md:w-3 md:bg-zinc-300" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
