import { cn } from "@/lib/utils";

const toneByValue: Record<string, string> = {
  P0: "border-red-200 bg-red-50 text-red-700",
  P1: "border-amber-200 bg-amber-50 text-amber-700",
  P2: "border-sky-200 bg-sky-50 text-sky-700",
  P3: "border-zinc-200 bg-zinc-50 text-zinc-600",
  READY_FOR_CODEX: "border-emerald-200 bg-emerald-50 text-emerald-700",
  IN_CODEX: "border-indigo-200 bg-indigo-50 text-indigo-700",
  IN_PROGRESS: "border-indigo-200 bg-indigo-50 text-indigo-700",
  REVIEW: "border-violet-200 bg-violet-50 text-violet-700",
  DONE: "border-green-200 bg-green-50 text-green-700",
  BLOCKED: "border-red-200 bg-red-50 text-red-700",
  DESIGN: "border-blue-200 bg-blue-50 text-blue-700"
};

type StatusBadgeProps = {
  value: string;
  label?: string;
  className?: string;
};

export function StatusBadge({ value, label = value, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-medium",
        toneByValue[value] ?? "border-zinc-200 bg-white text-zinc-700",
        className
      )}
    >
      {label}
    </span>
  );
}
