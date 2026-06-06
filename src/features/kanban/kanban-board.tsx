"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import type { Task, Project, TaskStatus } from "@prisma/client";
import { taskStatusLabels } from "@/lib/constants";
import { StatusBadge } from "@/components/common/status-badge";

type TaskWithProject = Task & { project?: Project };

const COLUMNS: TaskStatus[] = [
  "TODO", "RESEARCH", "DESIGN", "READY_FOR_CODEX",
  "IN_PROGRESS", "REVIEW", "DONE", "BLOCKED"
];

function KanbanCard({ task, isOverlay }: { task: TaskWithProject; isOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `task-${task.id}`,
    data: { task, type: "task" }
  });

  const style = transform ? {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : "auto",
    position: "relative" as const
  } : undefined;

  return (
    <article
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`rounded-md border border-zinc-200 bg-white p-3 cursor-grab active:cursor-grabbing hover:border-zinc-300 hover:shadow-sm transition-shadow ${isOverlay ? "shadow-lg ring-1 ring-zinc-300" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/tasks/${task.id}`}
          className="text-sm font-medium leading-5 text-zinc-950 hover:text-zinc-600"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {task.title}
        </Link>
        <StatusBadge value={task.priority} className="shrink-0" />
      </div>
      {task.description ? (
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">
          {task.description}
        </p>
      ) : null}
      {task.project ? (
        <p className="mt-2 text-xs font-medium text-zinc-400">{task.project.name}</p>
      ) : null}
    </article>
  );
}

function KanbanColumn({ status, tasks }: { status: TaskStatus; tasks: TaskWithProject[] }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
    data: { status, type: "column" }
  });

  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-52 flex-col rounded-lg border transition-colors ${isOver ? "border-zinc-400 bg-zinc-100" : "border-zinc-200 bg-white"}`}
    >
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-900">{taskStatusLabels[status]}</h2>
        <span className="text-xs text-zinc-500">{tasks.length}</span>
      </div>
      <div className="flex-1 space-y-3 p-3">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <p className="py-8 text-center text-xs text-zinc-400">Drop tasks here</p>
        )}
      </div>
    </section>
  );
}

export function KanbanBoard({ tasks }: { tasks: TaskWithProject[] }) {
  const router = useRouter();
  const [activeTask, setActiveTask] = useState<TaskWithProject | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => `task-${t.id}` === event.active.id);
    if (task) setActiveTask(task);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const taskId = String(active.id).replace("task-", "");
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    let newStatus: TaskStatus | null = null;

    if (String(over.id).startsWith("column-")) {
      newStatus = String(over.id).replace("column-", "") as TaskStatus;
    } else if (String(over.id).startsWith("task-")) {
      const overTask = tasks.find((t) => `task-${t.id}` === over.id);
      if (overTask) newStatus = overTask.status;
    }

    if (newStatus && newStatus !== task.status) {
      await fetch(`/api/tasks/${task.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      router.refresh();
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 xl:grid-cols-4">
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.status === status)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <KanbanCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
