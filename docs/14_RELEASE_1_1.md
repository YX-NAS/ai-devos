# AI DevOS 1.1.0 Release / AI DevOS 1.1.0 发布说明

## Summary / 摘要

AI DevOS `1.1.0` adds the next-phase operating features on top of `1.0.0`: ChatGPT/Codex configuration binding, Codex task templates, automatic Codex prompt generation, and a Tauri desktop app scaffold.

AI DevOS `1.1.0` 在 `1.0.0` 基础上加入下一阶段能力：ChatGPT/Codex 配置绑定、Codex 任务模板、自动生成 Codex Prompt，以及 Tauri 桌面应用脚手架。

## New Features / 新功能

### 1. ChatGPT and Codex Config Binding / ChatGPT 与 Codex 配置绑定

- Added `AgentConfig` for ChatGPT, Codex, OpenAI API, and local agent profiles.
- Added project-level `ProjectAgentBinding`.
- Default profiles are created automatically:
  - `Default ChatGPT Planning`
  - `Default Codex Execution`
- Project detail pages show the current planning and execution bindings.
- Settings page lists ChatGPT and Codex profiles.

- 新增 `AgentConfig`，用于记录 ChatGPT、Codex、OpenAI API、本地 Agent 的配置档案。
- 新增项目级 `ProjectAgentBinding`。
- 系统自动创建默认配置：
  - `Default ChatGPT Planning`
  - `Default Codex Execution`
- 项目详情页展示当前规划与执行绑定。
- Settings 页面展示 ChatGPT 与 Codex Profiles。

### 2. Codex Task Template / Codex 任务模板

New task fields:

新增任务字段：

| Field | 中文 |
|---|---|
| `goal` | 目标 |
| `scope` | 范围 |
| `relatedFiles` | 相关文件 |
| `acceptanceCriteria` | 验收标准 |
| `requiresCommit` | 是否需要 commit |
| `requiresPush` | 是否需要 push |
| `requiresDeployment` | 是否需要部署 |

When a task is created from the template and no custom `codexPrompt` is provided, AI DevOS generates a Codex-ready prompt automatically.

当使用模板创建任务且没有手动提供 `codexPrompt` 时，AI DevOS 会自动生成可交给 Codex 执行的 Prompt。

### 3. Desktop App Scaffold / 桌面应用脚手架

- Added Tauri v2 scaffold under `src-tauri/`.
- Added npm scripts:
  - `npm run desktop:dev`
  - `npm run desktop:build`
- Current desktop scope is a development shell that opens AI DevOS through the local Next.js app.

- 新增 `src-tauri/` Tauri v2 桌面应用脚手架。
- 新增 npm 脚本：
  - `npm run desktop:dev`
  - `npm run desktop:build`
- 当前桌面版本范围是开发壳：通过本地 Next.js 应用打开 AI DevOS。

## Usage Steps / 使用步骤

### Create a Codex Task / 创建 Codex 任务

1. Open `Projects`.
2. Select a project.
3. Open the project `Tasks` page.
4. Fill in:
   - Goal / 目标
   - Scope / 范围
   - Related files / 相关文件
   - Acceptance criteria / 验收标准
   - Commit / Push / Deployment flags
5. Click `Create Codex Task`.
6. Open the project detail page and expand `Codex Prompt` to copy or review the generated execution prompt.

1. 打开 `Projects`。
2. 选择项目。
3. 进入项目 `Tasks` 页面。
4. 填写：
   - 目标
   - 范围
   - 相关文件
   - 验收标准
   - 是否需要 commit / push / 部署
5. 点击 `Create Codex Task`。
6. 回到项目详情页，展开 `Codex Prompt` 查看或复制自动生成的执行 Prompt。

### Configure ChatGPT and Codex Profiles / 配置 ChatGPT 与 Codex Profiles

1. Open `Settings`.
2. Review `ChatGPT Profiles` and `Codex Profiles`.
3. Use API endpoints to create or update profiles when needed:

```bash
curl -X POST http://127.0.0.1:3000/api/agent-configs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Codex Profile",
    "provider": "CODEX",
    "role": "CODEX",
    "model": "Codex",
    "strategy": "Read code first, implement, verify, commit and deploy when required."
  }'
```

1. 打开 `Settings`。
2. 查看 `ChatGPT Profiles` 和 `Codex Profiles`。
3. 如需新增或更新 Profile，可使用 API。

### Start Desktop Dev App / 启动桌面开发应用

Requirements:

依赖：

- Node.js
- npm
- Rust
- Tauri system dependencies for your OS

Command:

命令：

```bash
npm install
npm run desktop:dev
```

The command starts the Next.js dev server and opens AI DevOS in a desktop window.

该命令会启动 Next.js 开发服务，并在桌面窗口中打开 AI DevOS。

## Validation / 验收

Validated commands:

已验证命令：

```bash
npm run prisma:generate
npm run verify
```

## Notes / 注意事项

- `apiKeyRef` is a reference field, not a plaintext secret store. Store real API keys in environment variables or a dedicated secret manager.
- OpenAI API Key is optional for the current product flow. ChatGPT/Codex profile binding can work as an operating configuration without calling OpenAI API directly.
- Production desktop packaging needs a follow-up decision: static export, bundled local server, or cloud-first desktop shell.

- `apiKeyRef` 是引用字段，不是明文密钥存储。真实 API Key 应放在环境变量或专用密钥管理系统。
- 当前产品流程不强制使用 OpenAI API Key。ChatGPT/Codex 绑定可以作为操作配置记录，不直接调用 OpenAI API。
- 生产桌面打包需要后续确定方案：静态导出、内置本地服务，或云端优先桌面壳。
