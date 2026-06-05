import type { ReactNode } from "react";

type PageTitleProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageTitle({ title, description, action }: PageTitleProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-zinc-950 md:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
