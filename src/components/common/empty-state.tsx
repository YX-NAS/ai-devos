type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
      <p className="text-sm font-medium text-zinc-900">{title}</p>
      {description ? <p className="mt-2 text-sm text-zinc-500">{description}</p> : null}
    </div>
  );
}
