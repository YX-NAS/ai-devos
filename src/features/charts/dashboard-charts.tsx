"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import type { Task, Project, TaskStatus } from "@prisma/client";
import { taskStatusLabels } from "@/lib/constants";

const STATUS_COLORS: Record<TaskStatus, string> = {
  TODO: "#a1a1aa",
  RESEARCH: "#a78bfa",
  DESIGN: "#60a5fa",
  READY_FOR_CODEX: "#34d399",
  IN_PROGRESS: "#fbbf24",
  REVIEW: "#fb923c",
  DONE: "#22c55e",
  BLOCKED: "#ef4444"
};

const PIE_COLORS = [
  "#34d399", "#fbbf24", "#60a5fa", "#a78bfa",
  "#fb923c", "#a1a1aa", "#22c55e", "#ef4444"
];

export function DashboardCharts({
  tasks
}: {
  tasks: (Task & { project?: Project })[];
}) {
  const statusCounts: Record<string, number> = {};
  for (const task of tasks) {
    statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
  }

  const barData = Object.entries(taskStatusLabels).map(([status, label]) => ({
    name: label,
    count: statusCounts[status] || 0,
    fill: STATUS_COLORS[status as TaskStatus] || "#a1a1aa"
  }));

  const pieData = barData.filter((d) => d.count > 0);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-zinc-950">
          Tasks by Status
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 4, right: 4, bottom: 20, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#71717a" }}
                angle={-35}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis tick={{ fontSize: 11, fill: "#71717a" }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e4e4e7",
                  borderRadius: "6px",
                  fontSize: "12px"
                }}
              />
              <Bar dataKey="count" name="Tasks" radius={[3, 3, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-zinc-950">
          Status Distribution
        </h2>
        {pieData.length === 0 ? (
          <div className="flex h-72 items-center justify-center text-sm text-zinc-400">
            No tasks yet
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={40}
                  paddingAngle={3}
                  stroke="none"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e4e4e7",
                    borderRadius: "6px",
                    fontSize: "12px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
