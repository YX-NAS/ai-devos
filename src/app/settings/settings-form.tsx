"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Pencil, X } from "lucide-react";
import type { AgentConfig } from "@prisma/client";

const AGENT_PROVIDER_OPTIONS = [
  { value: "CHATGPT", label: "ChatGPT" },
  { value: "CODEX", label: "Codex" },
  { value: "OPENAI_API", label: "OpenAI API" },
  { value: "LOCAL", label: "Local" }
] as const;

const AGENT_ROLE_OPTIONS = [
  { value: "GPT", label: "GPT" },
  { value: "CODEX", label: "Codex" }
] as const;

const AUTH_MODE_OPTIONS = [
  { value: "API_KEY", label: "API Key" },
  { value: "ACCOUNT_LOGIN", label: "账号登录" }
] as const;

function AuthModeSelector({
  value,
  name,
  onChange,
  provider
}: {
  value: string;
  name: string;
  onChange: (val: string) => void;
  provider: string;
}) {
  const isAccountLogin = value === "ACCOUNT_LOGIN";
  return (
    <div>
      <label className="block space-y-1.5 text-sm font-medium text-zinc-700">
        授权模式
        <div className="mt-1.5 flex gap-1 rounded-md border border-zinc-300 bg-zinc-100 p-0.5">
          {AUTH_MODE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex-1 rounded-sm px-3 py-1.5 text-xs font-medium transition-colors ${
                value === opt.value
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input type="hidden" name={name} value={value} />
      </label>
      {isAccountLogin && provider === "CHATGPT" && (
        <div className="mt-2 rounded-md bg-blue-50 p-2 text-xs text-blue-700">
          <p className="font-medium">账号登录说明：</p>
          <p className="mt-1">ChatGPT 通过浏览器登录，无需在此配置。使用 Quick Plan 时点击 &quot;Generate Prompt&quot; 生成任务描述，然后 <a href="https://chatgpt.com" target="_blank" className="underline">打开 ChatGPT</a> 粘贴即可。</p>
        </div>
      )}
      {isAccountLogin && provider === "CODEX" && (
        <div className="mt-2 rounded-md bg-emerald-50 p-2 text-xs text-emerald-700">
          <p className="font-medium">账号登录说明：</p>
          <p className="mt-1">Codex 使用桌面应用或 CLI 登录，无需在此配置。登录状态由 Codex Desktop 管理，AI DevOS 通过本地 CLI 调用 Codex。</p>
        </div>
      )}
      {!isAccountLogin && (
        <div className="mt-2 rounded-md bg-amber-50 p-2 text-xs text-amber-700">
          <p className="font-medium">API Key 说明：</p>
          <p className="mt-1">在下方填入 API Key 的引用名（非实际 Key 值）。真实 Key 通过服务器 .env 文件注入，不保存在数据库中。</p>
        </div>
      )}
    </div>
  );
}

export function CreateProfileForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<string>("ACCOUNT_LOGIN");

  async function onSubmit(formData: FormData) {
    setIsSaving(true);
    setError(null);

    const payload = {
      name: formData.get("name"),
      provider: formData.get("provider"),
      role: formData.get("role"),
      model: formData.get("model") || null,
      authMode: formData.get("authMode"),
      apiKeyRef: authMode === "API_KEY" ? (formData.get("apiKeyRef") || null) : null,
      strategy: formData.get("strategy") || null,
      isDefault: formData.get("isDefault") === "on"
    };

    const response = await fetch("/api/agent-configs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setIsSaving(false);
      setError("创建失败，请检查字段。");
      return;
    }

    router.refresh();
    setIsOpen(false);
    setIsSaving(false);
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Profile
      </button>
    );
  }

  return (
    <form action={onSubmit} className="rounded-md border border-zinc-300 bg-zinc-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-zinc-950">New Agent Profile</h3>
        <button type="button" onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-600">
          <X className="h-4 w-4" />
        </button>
      </div>
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 mb-3">{error}</p> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Name
          <input name="name" required className="h-9 w-full rounded-md border border-zinc-300 px-2.5 text-sm" />
        </label>
        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Provider
          <select name="provider" required defaultValue="CHATGPT" className="h-9 w-full rounded-md border border-zinc-300 px-2.5 text-sm">
            {AGENT_PROVIDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Role
          <select name="role" required defaultValue="GPT" className="h-9 w-full rounded-md border border-zinc-300 px-2.5 text-sm">
            {AGENT_ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Model
          <input name="model" placeholder="ChatGPT / gpt-5" className="h-9 w-full rounded-md border border-zinc-300 px-2.5 text-sm" />
        </label>
      </div>
      <div className="mt-3">
        <AuthModeSelector name="authMode" value={authMode} onChange={setAuthMode} provider="CHATGPT" />
      </div>
      {authMode === "API_KEY" ? (
        <div className="mt-3 space-y-2">
          <label className="block space-y-1 text-sm font-medium text-zinc-700">
            API Key Reference
            <input name="apiKeyRef" placeholder="OPENAI_API_KEY (填写引用名，不要填真实Key)" className="h-9 w-full rounded-md border border-zinc-300 px-2.5 text-sm" />
          </label>
          <p className="text-xs text-red-600">⚠ 不要在此填入真实 API Key！只填引用名（如 OPENAI_API_KEY），真实 Key 通过服务器 .env 注入。</p>
        </div>
      ) : null}
      <label className="mt-3 block space-y-1 text-sm font-medium text-zinc-700">
        Strategy
        <textarea name="strategy" rows={2} className="w-full rounded-md border border-zinc-300 px-2.5 py-1.5 text-sm" />
      </label>
      <div className="mt-3 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input name="isDefault" type="checkbox" />
          Set as default
        </label>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex h-8 items-center rounded-md bg-zinc-950 px-3 text-xs font-medium text-white disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Create"}
        </button>
      </div>
    </form>
  );
}

export function EditProfileButton({ config }: { config: AgentConfig }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<string>(config.authMode ?? "ACCOUNT_LOGIN");

  async function onSubmit(formData: FormData) {
    setIsSaving(true);
    setError(null);

    const payload = {
      name: formData.get("name"),
      provider: formData.get("provider"),
      role: formData.get("role"),
      model: formData.get("model") || null,
      authMode: formData.get("authMode"),
      apiKeyRef: authMode === "API_KEY" ? (formData.get("apiKeyRef") || null) : null,
      strategy: formData.get("strategy") || null,
      isDefault: formData.get("isDefault") === "on"
    };

    const response = await fetch(`/api/agent-configs/${config.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setIsSaving(false);
      setError("更新失败，请重试。");
      return;
    }

    router.refresh();
    setIsOpen(false);
    setIsSaving(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setAuthMode(config.authMode ?? "ACCOUNT_LOGIN");
          setIsOpen(true);
        }}
        className="inline-flex h-7 items-center gap-1 rounded-md border border-zinc-200 px-2 text-xs text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
      >
        <Pencil className="h-3 w-3" />
        Edit
      </button>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-lg rounded-lg border border-zinc-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-950">Edit: {config.name}</h3>
              <button type="button" onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form action={onSubmit} className="space-y-3">
              {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
              <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-1 text-sm font-medium text-zinc-700">
                  Name
                  <input name="name" required defaultValue={config.name} className="h-9 w-full rounded-md border border-zinc-300 px-2.5 text-sm" />
                </label>
                <label className="space-y-1 text-sm font-medium text-zinc-700">
                  Provider
                  <select name="provider" required defaultValue={config.provider} className="h-9 w-full rounded-md border border-zinc-300 px-2.5 text-sm">
                    {AGENT_PROVIDER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1 text-sm font-medium text-zinc-700">
                  Role
                  <select name="role" required defaultValue={config.role} className="h-9 w-full rounded-md border border-zinc-300 px-2.5 text-sm">
                    {AGENT_ROLE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1 text-sm font-medium text-zinc-700">
                  Model
                  <input name="model" defaultValue={config.model ?? ""} className="h-9 w-full rounded-md border border-zinc-300 px-2.5 text-sm" />
                </label>
              </div>
              <AuthModeSelector name="authMode" value={authMode} onChange={setAuthMode} provider="CHATGPT" />
              <AuthModeSelector name="authMode" value={authMode} onChange={setAuthMode} provider={config.provider} />
              {authMode === "API_KEY" ? (
                <div className="space-y-2">
                  <label className="block space-y-1 text-sm font-medium text-zinc-700">
                    API Key Ref
                    <input name="apiKeyRef" defaultValue={config.apiKeyRef ?? ""} className="h-9 w-full rounded-md border border-zinc-300 px-2.5 text-sm" />
                  </label>
                  <p className="text-xs text-red-600">⚠ 不要在此填入真实 API Key！</p>
                </div>
              ) : null}
              <label className="block space-y-1 text-sm font-medium text-zinc-700">
                Strategy
                <textarea name="strategy" rows={2} defaultValue={config.strategy ?? ""} className="w-full rounded-md border border-zinc-300 px-2.5 py-1.5 text-sm" />
              </label>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-zinc-700">
                  <input name="isDefault" type="checkbox" defaultChecked={config.isDefault} />
                  Set as default
                </label>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex h-8 items-center rounded-md bg-zinc-950 px-3 text-xs font-medium text-white disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
