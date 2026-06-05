import Link from "next/link";
import { Plus, Search } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/95 px-4 backdrop-blur md:px-8">
      <div className="flex min-w-0 items-center gap-3 lg:hidden">
        <Link href="/" className="text-base font-semibold text-zinc-950">
          AI DevOS
        </Link>
      </div>
      <div className="hidden min-w-0 items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 md:flex md:w-80">
        <Search className="h-4 w-4" aria-hidden="true" />
        <span>Search projects, tasks, prompts</span>
      </div>
      <Link
        href="/projects/new"
        className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        New Project
      </Link>
    </header>
  );
}
