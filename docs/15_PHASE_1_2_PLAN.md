# AI DevOS 1.2.0 Design and Development Plan / AI DevOS 1.2.0 设计及开发方案

## 1. Goal / 目标

AI DevOS `1.2.0` focuses on moving from a project/task operating console to an executable development workflow hub.

AI DevOS `1.2.0` 的重点是从“项目与任务管理控制台”升级为“可执行的开发工作流中枢”。

Primary goals:

核心目标：

1. Securely configure ChatGPT, Codex, OpenAI API, GitHub, and deployment credentials.
2. Add complete CRUD and workflow actions for projects, requirements, designs, tasks, prompts, reviews, and deployment records.
3. Make Codex task execution more operational: copy prompt, record result, mark review, and track commit/push/deploy requirements.
4. Prepare production-grade desktop app packaging and persistent database migration.
5. Improve production operations on the Singapore server with backup, upgrade, rollback, and monitoring.

1. 安全配置 ChatGPT、Codex、OpenAI API、GitHub 和部署凭据。
2. 补全项目、需求、设计、任务、Prompt、Review、部署记录的增删改查和状态流转。
3. 让 Codex 任务执行更闭环：复制 Prompt、记录结果、进入 Review、跟踪 commit/push/deploy 要求。
4. 推进桌面应用生产打包和持久化数据库迁移。
5. 完善新加坡服务器生产运维：备份、升级、回滚和监控。

## 2. Version Scope / 版本范围

### In Scope / 本阶段范围

- Settings UI for Agent profiles.
- Project-level ChatGPT/Codex binding management UI.
- Task detail page and task edit page.
- Codex prompt copy button.
- Task execution result fields and review handoff.
- Deployment record model and page.
- Basic authentication gate.
- Persistent database evaluation and migration plan.
- Desktop app production packaging decision.
- Docker deploy scripts and rollback documentation.

- Agent Profiles 的 Settings 管理页面。
- 项目级 ChatGPT/Codex 绑定管理 UI。
- 任务详情页和任务编辑页。
- Codex Prompt 一键复制。
- 任务执行结果字段和 Review 交接。
- 部署记录模型与页面。
- 基础登录保护。
- 持久化数据库评估和迁移方案。
- 桌面应用生产打包方案决策。
- Docker 部署脚本和回滚说明。

### Out of Scope / 暂不纳入

- Fully autonomous Codex execution inside the browser.
- Multi-tenant SaaS billing.
- Complex RBAC permission matrix.
- Real-time collaboration.
- Enterprise SSO.

- 浏览器内全自动 Codex 执行。
- 多租户 SaaS 计费。
- 复杂 RBAC 权限矩阵。
- 实时协作。
- 企业 SSO。

## 3. Current Baseline / 当前基线

`1.1.0` already provides:

`1.1.0` 已具备：

- Project/task dashboard.
- ChatGPT/Codex profile data model.
- Project agent binding data model.
- Codex task template.
- Automatic Codex prompt generation.
- Docker deployment at `https://codex.5176nas.site`.
- Tauri desktop scaffold.

## 4. Key Decisions / 关键决策

### 4.1 Credentials and API Keys / 凭据与 API Key

Recommended approach:

推荐方案：

- Do not store plaintext API keys in SQLite.
- Store only references in `AgentConfig.apiKeyRef`.
- Use `.env` or server secret files for production.
- Add UI help text explaining where each secret should be configured.
- Add API connectivity test endpoints that only return status, never secret values.

- 不在 SQLite 中保存明文 API Key。
- `AgentConfig.apiKeyRef` 只保存引用名。
- 生产环境使用 `.env` 或服务器 secret 文件。
- UI 中明确说明每个密钥应配置在哪里。
- 增加 API 连通性测试接口，只返回状态，不返回密钥值。

Suggested environment variables:

建议环境变量：

```env
OPENAI_API_KEY=
GITHUB_TOKEN=
DEPLOY_SSH_HOST=
DEPLOY_SSH_USER=
DEPLOY_SSH_KEY_PATH=
AI_DEVOS_ADMIN_PASSWORD=
```

### 4.2 Authentication / 登录保护

Recommended first step:

首阶段推荐：

- Add a single admin password gate.
- Use signed session cookie.
- Keep it simple for the private NAS/server use case.
- Upgrade later to OAuth or multi-user accounts.

- 增加单管理员密码入口。
- 使用签名 session cookie。
- 针对私有 NAS/服务器使用场景保持简单。
- 后续再升级 OAuth 或多用户账户。

### 4.3 Database / 数据库

Recommended short-term:

短期推荐：

- Keep SQLite for Singapore Docker deployment.
- Add automated daily backups.
- Add migration scripts and backup-before-upgrade procedure.

- 新加坡 Docker 部署继续使用 SQLite。
- 增加每日自动备份。
- 增加迁移脚本和升级前备份流程。

Recommended medium-term:

中期推荐：

- Evaluate PostgreSQL if multiple users, long-term audit logs, or integrations increase write volume.
- Candidate options: local Postgres container, Neon, Supabase, or managed database.

- 如果多用户、审计日志或集成写入量上升，评估 PostgreSQL。
- 候选方案：本地 Postgres 容器、Neon、Supabase 或托管数据库。

### 4.4 Desktop App / 桌面应用

Options:

方案：

| Option | Pros | Cons | Recommendation |
|---|---|---|---|
| Cloud-first Tauri shell | Fastest, simple, uses existing domain | Requires internet | Use for `1.2.0` production preview |
| Bundled local Next server | Works offline, local data | More packaging complexity | Evaluate after auth and database work |
| Static export | Simple desktop package | App Router dynamic APIs are limited | Not recommended now |

Recommended `1.2.0` path:

`1.2.0` 推荐路径：

- Package Tauri desktop app as a cloud-first shell pointing to `https://codex.5176nas.site`.
- Keep local `desktop:dev` for development.
- Document macOS build requirements and signing limitations.

- 将 Tauri 桌面应用先封装为云端优先壳，默认打开 `https://codex.5176nas.site`。
- 保留本地 `desktop:dev` 用于开发。
- 文档说明 macOS 构建依赖和签名限制。

## 5. Data Model Additions / 数据模型新增

### 5.1 DeploymentRecord

```prisma
model DeploymentRecord {
  id          String   @id @default(cuid())
  projectId   String
  taskId      String?
  environment String
  version     String?
  status      String
  url         String?
  commitSha   String?
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
```

Purpose:

用途：

- Record production deployments.
- Link deployment to Codex task and commit.
- Support rollback history.

- 记录生产部署。
- 将部署与 Codex 任务、commit 关联。
- 支持回滚历史。

### 5.2 Task Execution Fields

Suggested additions:

建议新增：

```prisma
model Task {
  executionResult String?
  commitSha       String?
  pullRequestUrl  String?
  deployedUrl     String?
  reviewedAt      DateTime?
}
```

## 6. Page Design / 页面设计

### 6.1 Settings

Add:

新增：

- Agent profile create/edit form.
- API key reference field.
- Connection test button.
- GitHub token reference.
- Deployment server reference.

### 6.2 Project Detail

Add:

新增：

- Editable agent binding section.
- Current deployment status.
- Latest commit/deployment record.
- Quick links to repo, PR, and production URL.

### 6.3 Task Detail

Add:

新增：

- Full task template fields.
- Copy Codex Prompt button.
- Execution result textarea.
- Commit SHA field.
- PR URL field.
- Deployment required workflow hint.
- Move to Review / Mark Done actions.

### 6.4 Deployments

New page:

新增页面：

- `/deployments`
- `/projects/[id]/deployments`

Features:

功能：

- Deployment timeline.
- Environment filter.
- Status filter.
- Commit/version links.
- Rollback notes.

## 7. API Design / API 设计

### Agent Config

Existing:

已有：

- `GET /api/agent-configs`
- `POST /api/agent-configs`
- `GET /api/agent-configs/[id]`
- `PATCH /api/agent-configs/[id]`
- `DELETE /api/agent-configs/[id]`

Add:

新增：

- `POST /api/agent-configs/[id]/test`

### Task Execution

Add:

新增：

- `GET /api/tasks/[id]`
- `PATCH /api/tasks/[id]`
- `POST /api/tasks/[id]/copy-prompt-event`
- `POST /api/tasks/[id]/submit-result`
- `POST /api/tasks/[id]/move-to-review`

### Deployments

Add:

新增：

- `GET /api/deployments`
- `POST /api/projects/[id]/deployments`
- `GET /api/projects/[id]/deployments`
- `PATCH /api/deployments/[id]`

### Auth

Add:

新增：

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`

## 8. Development Milestones / 开发里程碑

### Milestone 1: Security and Settings / 安全与配置

Tasks:

任务：

1. Add admin password login.
2. Add protected route middleware.
3. Add Settings forms for AgentConfig.
4. Add profile connection test API.
5. Add documentation for API key references.

Acceptance:

验收：

- Unauthenticated users are redirected to login.
- Settings can create and edit ChatGPT/Codex profiles.
- Secret values are never rendered back to the UI.

### Milestone 2: Task Execution Loop / 任务执行闭环

Tasks:

任务：

1. Add task detail page.
2. Add task edit form.
3. Add copy Codex Prompt button.
4. Add execution result and commit/PR fields.
5. Add move-to-review action.

Acceptance:

验收：

- A task can move from template creation to Codex execution to review.
- Generated prompt can be copied in one click.
- Execution result can be saved.

### Milestone 3: Deployment Records / 部署记录

Tasks:

任务：

1. Add `DeploymentRecord` model.
2. Add deployment pages.
3. Link deployment to task/project.
4. Add production deployment runbook.

Acceptance:

验收：

- Deployment history is visible per project.
- Latest production deployment can be identified.
- Rollback instructions are documented.

### Milestone 4: Desktop Production Preview / 桌面生产预览

Tasks:

任务：

1. Update Tauri config for cloud-first production shell.
2. Add desktop icon assets.
3. Add macOS build instructions.
4. Build and test desktop app on a machine with Rust installed.

Acceptance:

验收：

- `npm run desktop:dev` still works.
- Desktop production window opens `https://codex.5176nas.site`.
- Build limitations are documented.

## 9. Risks / 风险

| Risk | Impact | Mitigation |
|---|---|---|
| API keys leaked through UI or logs | High | Store only references, mask values, never return secrets |
| SQLite corruption or data loss | High | Daily backup, backup before upgrade, restore test |
| Desktop packaging complexity | Medium | Ship cloud-first shell first |
| Auth implementation blocks automation | Medium | Keep simple admin session and document API usage |
| Singapore 2C4G server resource pressure | Medium | Keep one container, prune Docker cache, monitor disk |
| npm audit breaking upgrades | Medium | Track separately, avoid force upgrades during release |

## 10. Recommended Priority / 推荐优先级

1. Basic auth and secret reference management.
2. Settings UI for ChatGPT/Codex profiles.
3. Task detail/edit and copy prompt.
4. Execution result and review handoff.
5. Deployment records.
6. Desktop cloud-first production preview.
7. Backup and rollback automation.

## 11. Acceptance Criteria / 验收标准

`1.2.0` can be accepted when:

`1.2.0` 验收条件：

1. Login protects the production site.
2. Settings can manage ChatGPT and Codex profiles.
3. Projects can manage their ChatGPT/Codex binding in UI.
4. Task detail page supports full template editing.
5. Codex Prompt can be copied in one click.
6. Execution result, commit SHA, PR URL, and deployed URL can be recorded.
7. Deployment history is visible.
8. Docker production deployment is updated and verified.
9. Backup and rollback instructions are documented.
10. Desktop production preview is documented or packaged.

## 12. Delivery Plan / 交付计划

Suggested sequence:

建议顺序：

1. Create branch `codex/ai-devos-1.2`.
2. Implement Milestone 1 and run `npm run verify`.
3. Deploy to Singapore server for auth smoke test.
4. Implement Milestone 2 and run task workflow smoke test.
5. Implement Milestone 3 and deploy again.
6. Implement Milestone 4 after Rust/Tauri build environment is ready.
7. Tag `v1.2.0`.

## 13. Open Questions / 待确认问题

1. Should production auth use a single admin password first, or GitHub OAuth?
2. Should desktop production open the cloud domain or run a local bundled server?
3. Should deployment records be manually entered first, or automatically created by deploy scripts?
4. Should SQLite remain the production database through `1.2.0`, or should PostgreSQL migration start now?
5. Should GitHub integration use a personal token, GitHub App, or GitHub CLI on the server?
