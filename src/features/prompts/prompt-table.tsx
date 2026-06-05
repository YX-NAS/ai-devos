import type { Prompt, Project } from "@prisma/client";
import { promptTypeLabels } from "@/lib/constants";
import { StatusBadge } from "@/components/common/status-badge";

type PromptWithProject = Prompt & { project?: Project | null };

export function PromptTable({ prompts }: { prompts: PromptWithProject[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {prompts.map((prompt) => (
        <article key={prompt.id} className="rounded-lg border border-zinc-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-zinc-950">{prompt.title}</h2>
              <p className="mt-1 text-xs text-zinc-500">{prompt.project?.name ?? "Global"}</p>
            </div>
            <StatusBadge value={prompt.type} label={promptTypeLabels[prompt.type]} />
          </div>
          <p className="mt-4 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-zinc-600">
            {prompt.content}
          </p>
          {prompt.tags ? (
            <p className="mt-4 text-xs font-medium text-zinc-500">{prompt.tags}</p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
