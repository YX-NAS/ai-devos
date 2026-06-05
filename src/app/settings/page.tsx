import { PageTitle } from "@/components/common/page-title";

const settings = [
  ["默认项目分类", "AI_PRODUCT"],
  ["默认优先级", "P2"],
  ["默认阶段", "IDEA"],
  ["GitHub 账号", "YX-NAS"],
  ["New API 地址", "待配置"],
  ["Codex 使用策略", "按任务验收标准执行，完成后提交 PR"]
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Settings" description="MVP 阶段的系统参数占位，后续可接入持久化配置。" />
      <div className="rounded-lg border border-zinc-200 bg-white">
        {settings.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-2 border-b border-zinc-200 px-5 py-4 last:border-b-0 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-medium text-zinc-700">{label}</p>
            <p className="text-sm text-zinc-950">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
