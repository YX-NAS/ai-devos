import type { LucideIcon } from "lucide-react";

type AgentCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  capabilities: string[];
};

export function AgentCard({ title, description, icon: Icon, capabilities }: AgentCardProps) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-100 text-zinc-800">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-semibold text-zinc-950">{title}</h2>
          <p className="text-sm text-zinc-500">{description}</p>
        </div>
      </div>
      <ul className="mt-5 space-y-2 text-sm text-zinc-700">
        {capabilities.map((capability) => (
          <li key={capability} className="rounded-md border border-zinc-200 px-3 py-2">
            {capability}
          </li>
        ))}
      </ul>
    </article>
  );
}
