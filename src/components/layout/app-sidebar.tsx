import Link from "next/link";
import {
  Bot,
  ClipboardList,
  GitBranch,
  LayoutDashboard,
  PanelsTopLeft,
  Settings,
  Sparkles
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: PanelsTopLeft },
  { href: "/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/prompts", label: "Prompts", icon: Sparkles },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/workflows", label: "Workflows", icon: GitBranch },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white lg:block">
      <div className="flex h-16 items-center border-b border-zinc-200 px-6">
        <Link href="/" className="text-lg font-semibold tracking-normal text-zinc-950">
          AI DevOS
        </Link>
      </div>
      <nav className="space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
