# AI DevOS 1.1 Design and Development Plan

## Objective

Build `1.1.0` on top of the packaged `1.0.0` release.

Main deliverables:

1. ChatGPT and Codex configuration binding
2. Codex task template
3. Desktop app scaffold

## Product Requirements

### PRD 1: ChatGPT and Codex Configuration Binding

User story:

As an AI DevOS user, I want to define how GPT plans and how Codex executes, so each project can use consistent AI collaboration rules.

Functional requirements:

- Create ChatGPT profile.
- Create Codex profile.
- View all profiles in Settings.
- Mark one profile as default.
- Bind profiles to projects.
- Display bound profiles on project detail.

Fields:

ChatGPT profile:

- Name
- Model
- Planning language
- Output format
- PRD style
- Technical design style
- Task breakdown style

Codex profile:

- Name
- Execution mode
- Commit policy
- Push policy
- Deployment policy
- Test policy
- Review summary policy

### PRD 2: Codex Task Template

User story:

As an AI DevOS user, I want every Codex task to use a fixed template, so Codex receives clear implementation instructions.

Default fields:

```text
目标
范围
相关文件
验收标准
是否需要 commit
是否需要 push
是否需要部署
```

Functional requirements:

- Task form shows all template fields.
- Boolean fields use switches or checkboxes.
- User can generate Codex Prompt.
- Generated prompt is saved to the task.
- Existing task board still works.

Generated prompt format:

```text
请根据以下任务进行开发，直到验收通过，可以交付。

目标：
范围：
相关文件：
验收标准：
是否需要 commit：
是否需要 push：
是否需要部署：

执行要求：
1. 先阅读相关代码和上下文
2. 按现有技术栈实现
3. 保持改动范围聚焦
4. 运行必要验证
5. 输出执行摘要
```

### PRD 3: Desktop App

User story:

As an AI DevOS user, I want to open AI DevOS from my desktop, so it becomes a daily operating console instead of only a browser tab.

Functional requirements:

- Desktop app scaffold exists.
- App name is `AI DevOS`.
- Desktop development command exists.
- Desktop build command exists.
- Desktop setup is documented.

Non-goals for 1.1:

- Auto-update
- Native menu customization
- System tray
- Deep OS integration
- Local Codex automation

## Technical Design

### Data Model Changes

Add enum:

```prisma
enum AgentProvider {
  CHATGPT
  CODEX
  OPENAI_API
  LOCAL
}
```

Add model:

```prisma
model AgentConfig {
  id          String        @id @default(cuid())
  name        String
  provider    AgentProvider
  role        AgentType
  model       String?
  endpoint    String?
  apiKeyRef   String?
  strategy    String?
  isDefault   Boolean       @default(false)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  bindings ProjectAgentBinding[]
}
```

Add binding:

```prisma
model ProjectAgentBinding {
  id        String      @id @default(cuid())
  projectId String
  configId  String
  purpose   String
  createdAt DateTime    @default(now())

  project Project     @relation(fields: [projectId], references: [id], onDelete: Cascade)
  config  AgentConfig @relation(fields: [configId], references: [id], onDelete: Cascade)
}
```

Extend Task:

```prisma
model Task {
  goal               String?
  relatedFiles       String?
  requiresCommit     Boolean @default(false)
  requiresPush       Boolean @default(false)
  requiresDeployment Boolean @default(false)
}
```

### File Structure

Recommended files:

```text
src/features/agent-configs/
  agent-config-service.ts
  agent-config-form.tsx
  agent-config-table.tsx

src/features/task-templates/
  task-template.ts
  codex-prompt-generator.ts
  task-template-form.tsx

src/app/api/agent-configs/
  route.ts

src/app/api/agent-configs/[id]/
  route.ts

src/app/api/projects/[id]/agent-bindings/
  route.ts

src/app/settings/
  page.tsx

src-tauri/
  tauri.conf.json
  src/
```

### Services

Agent config service:

- `listAgentConfigs()`
- `createAgentConfig(data)`
- `updateAgentConfig(id, data)`
- `deleteAgentConfig(id)`
- `setDefaultAgentConfig(id)`

Project binding service:

- `listProjectAgentBindings(projectId)`
- `createProjectAgentBinding(projectId, configId, purpose)`
- `deleteProjectAgentBinding(bindingId)`

Task template service:

- `generateCodexPrompt(taskTemplateFields)`
- `validateTaskTemplateFields(data)`

### UI Design

Settings page:

```text
Settings
  Tabs:
    General
    ChatGPT
    Codex
    Desktop
```

Task form:

```text
Task
  Title
  Goal
  Scope
  Relevant files
  Acceptance criteria
  Commit required
  Push required
  Deployment required
  Generate Codex Prompt
```

Project detail:

```text
Project Config
  ChatGPT: Default Planning Profile
  Codex: Default Execution Profile
```

## Development Tasks for Codex

### Task 1: Add Task Template Foundation

Goal:

Implement the default Codex task template fields and prompt generator.

Scope:

- Extend Prisma Task model.
- Update SQLite setup script.
- Add validators.
- Add prompt generator.
- Update task form or create first task template form.

Relevant files:

- `prisma/schema.prisma`
- `scripts/setup-sqlite.mjs`
- `src/lib/validators.ts`
- `src/features/tasks/`
- `src/features/task-templates/`

Acceptance criteria:

- Task model supports all template fields.
- Prompt generator outputs the required Chinese template.
- `npm run verify` passes.

Commit required: yes

Push required: yes

Deployment required: yes

### Task 2: Add Agent Config Data Model and API

Goal:

Add ChatGPT and Codex configuration storage.

Scope:

- Add Prisma models.
- Update SQLite setup script.
- Add service layer.
- Add API routes.
- Add seed defaults.

Relevant files:

- `prisma/schema.prisma`
- `scripts/setup-sqlite.mjs`
- `prisma/seed.ts`
- `src/features/agent-configs/`
- `src/app/api/agent-configs/`

Acceptance criteria:

- Default ChatGPT and Codex profiles exist after seed.
- API can list and create profiles.
- `npm run verify` passes.

Commit required: yes

Push required: yes

Deployment required: yes

### Task 3: Add Settings UI for ChatGPT and Codex

Goal:

Let users view and manage ChatGPT/Codex profiles.

Scope:

- Add Settings tabs.
- Add profile list.
- Add creation form.
- Add default profile indication.

Relevant files:

- `src/app/settings/page.tsx`
- `src/features/agent-configs/`
- `src/components/common/`

Acceptance criteria:

- Settings shows ChatGPT and Codex sections.
- Default profiles are visible.
- UI remains responsive.
- `npm run verify` passes.

Commit required: yes

Push required: yes

Deployment required: yes

### Task 4: Add Project Agent Binding

Goal:

Allow projects to bind default ChatGPT and Codex profiles.

Scope:

- Add project binding API.
- Show profile bindings on project detail.
- Provide simple binding UI or default display.

Relevant files:

- `src/features/projects/`
- `src/features/agent-configs/`
- `src/app/projects/[id]/page.tsx`
- `src/app/api/projects/[id]/agent-bindings/`

Acceptance criteria:

- Project detail shows ChatGPT/Codex profile status.
- Binding data can be read through API.
- `npm run verify` passes.

Commit required: yes

Push required: yes

Deployment required: yes

### Task 5: Add Desktop App Scaffold

Goal:

Create a Tauri-based desktop app scaffold for AI DevOS.

Scope:

- Add Tauri dependencies.
- Add `src-tauri`.
- Add desktop scripts.
- Configure app name and metadata.
- Document desktop setup.

Relevant files:

- `package.json`
- `src-tauri/`
- `docs/USER_GUIDE.md`
- `README.md`

Acceptance criteria:

- Desktop scaffold exists.
- `desktop:dev` command is documented.
- If Rust/Tauri is installed, desktop app can be launched.
- Web `npm run verify` still passes.

Commit required: yes

Push required: yes

Deployment required: no

## Risk Assessment

### Data Persistence Risk

Risk:

Vercel temporary SQLite is not persistent.

Impact:

Agent configs and task templates may reset in cloud demo mode.

Mitigation:

Treat 1.1 cloud deployment as workflow demo unless persistent database is added.

### Desktop Packaging Risk

Risk:

Tauri setup requires Rust and platform-specific dependencies.

Impact:

Desktop build may not work on every machine immediately.

Mitigation:

Ship scaffold and documented setup in 1.1. Treat signed production installers as future work.

### Scope Risk

Risk:

Agent binding, task templates, and desktop packaging can become too large for one release.

Mitigation:

Implement task templates first, then agent configs, then desktop scaffold.

## 1.1 Delivery Checklist

- [ ] Package 1.0 as release baseline.
- [ ] Add task template fields.
- [ ] Add Codex prompt generator.
- [ ] Add ChatGPT/Codex config model.
- [ ] Add config APIs.
- [ ] Add Settings UI.
- [ ] Add project binding.
- [ ] Add desktop scaffold.
- [ ] Update bilingual guide.
- [ ] Run `npm run verify`.
- [ ] Commit, tag, and push `v1.1.0`.
