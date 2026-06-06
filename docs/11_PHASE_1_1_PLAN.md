# AI DevOS 1.1 Planning and Evaluation

## Version Goal

AI DevOS `1.1.0` will move the product from an MVP project console toward a practical AI development operating environment.

Primary goals:

1. Add ChatGPT and Codex configuration binding.
2. Add task templates for Codex-ready task creation.
3. Create a desktop application package.

## Scope Summary

### Feature 1: ChatGPT and Codex Configuration Binding

Purpose:

- Store ChatGPT planning preferences.
- Store Codex execution preferences.
- Bind project/task workflows to configured GPT and Codex profiles.
- Make handoff from GPT planning to Codex execution more structured.

MVP for 1.1:

- Add `IntegrationProfile` or `AgentConfig` model.
- Support ChatGPT profile fields.
- Support Codex profile fields.
- Allow a project to select default ChatGPT and Codex profiles.
- Allow task templates to use the selected Codex profile.
- Show configuration status in Settings and Project detail.

Out of scope for 1.1:

- Direct ChatGPT API execution inside the app.
- Direct Codex remote execution inside the app.
- OAuth login with OpenAI.
- Secret vault or enterprise key management.

### Feature 2: Task Template for Codex Execution

Purpose:

- Standardize task creation.
- Ensure every Codex-ready task contains enough execution context.
- Reduce back-and-forth between GPT planning and Codex implementation.

Default template fields:

```text
目标
范围
相关文件
验收标准
是否需要 commit
是否需要 push
是否需要部署
```

Recommended English labels:

```text
Goal
Scope
Relevant files
Acceptance criteria
Commit required
Push required
Deployment required
```

MVP for 1.1:

- Add task template constants.
- Add default task template UI.
- Add structured fields to task creation/editing.
- Generate Codex Prompt from template fields.
- Store the generated prompt in `Task.codexPrompt`.

### Feature 3: Desktop Application

Purpose:

- Provide a local desktop entry point for AI DevOS.
- Make the app feel like a daily operating console rather than only a browser page.
- Prepare for future local file system and Codex workflow integration.

Recommended evaluation:

| Option | Pros | Cons | Recommendation |
|---|---|---|---|
| Tauri | Small app size, good native shell, Rust backend available | Requires Rust toolchain | Recommended |
| Electron | Mature ecosystem, easy Next.js integration | Large bundle size | Backup option |
| PWA | Easiest to ship | Not a real desktop app, limited native capability | Good interim enhancement |

Recommendation:

- Use Tauri for the 1.1 desktop app.
- Keep Next.js as the frontend.
- Package AI DevOS as a local desktop shell pointing to a local Next server or static build where possible.

## Architecture Evaluation

### Current Architecture

```text
Next.js App Router
  -> Server Components / Pages
  -> Route Handlers
  -> Prisma Client
  -> SQLite
```

### 1.1 Target Architecture

```text
AI DevOS Web App
  -> Settings
    -> ChatGPT Profile
    -> Codex Profile
  -> Project
    -> Default GPT/Codex config
  -> Task
    -> Task template
    -> Generated Codex Prompt

Desktop App
  -> Tauri shell
  -> Embedded/local AI DevOS web UI
  -> Future local workflow hooks
```

## Data Model Proposal

### AgentConfig

```prisma
enum AgentProvider {
  CHATGPT
  CODEX
  OPENAI_API
  LOCAL
}

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
}
```

### Project Config Binding

Option A: add nullable relation fields to `Project`.

```prisma
model Project {
  defaultGptConfigId   String?
  defaultCodexConfigId String?
}
```

Option B: create a binding table.

```prisma
model ProjectAgentBinding {
  id        String @id @default(cuid())
  projectId String
  configId  String
  purpose   String
}
```

Recommendation:

- Use Option B for flexibility.
- It allows multiple bindings per project and future agent expansion.

### Task Template Fields

For 1.1, keep existing `Task` fields and add structured fields only if needed.

Recommended minimal change:

```prisma
model Task {
  goal               String?
  relatedFiles       String?
  requiresCommit     Boolean @default(false)
  requiresPush       Boolean @default(false)
  requiresDeployment Boolean @default(false)
}
```

Mapping:

- `goal`: 目标 / Goal
- `scope`: 范围 / Scope, already exists
- `relatedFiles`: 相关文件 / Relevant files
- `acceptanceCriteria`: 验收标准 / Acceptance criteria, already exists
- `requiresCommit`: 是否需要 commit / Commit required
- `requiresPush`: 是否需要 push / Push required
- `requiresDeployment`: 是否需要部署 / Deployment required

## API Proposal

### Agent Config APIs

```http
GET /api/agent-configs
POST /api/agent-configs
GET /api/agent-configs/:id
PATCH /api/agent-configs/:id
DELETE /api/agent-configs/:id
```

### Project Binding APIs

```http
GET /api/projects/:id/agent-bindings
POST /api/projects/:id/agent-bindings
DELETE /api/projects/:id/agent-bindings/:bindingId
```

### Task Template APIs

```http
GET /api/task-template
POST /api/projects/:projectId/tasks
PATCH /api/tasks/:id
```

## UI Proposal

### Settings

Add tabs:

- General
- ChatGPT
- Codex
- Desktop

ChatGPT configuration fields:

- Profile name
- Model
- Planning strategy
- Default output language
- PRD template preference
- Technical design template preference

Codex configuration fields:

- Profile name
- Execution mode
- Commit policy
- Push policy
- Deployment policy
- Review policy

### Project Detail

Add configuration summary:

- Default ChatGPT profile
- Default Codex profile
- Task template status

### Task Creation

Use the default task template fields:

- 目标 / Goal
- 范围 / Scope
- 相关文件 / Relevant files
- 验收标准 / Acceptance criteria
- 是否需要 commit / Commit required
- 是否需要 push / Push required
- 是否需要部署 / Deployment required

Add button:

```text
Generate Codex Prompt
```

## Desktop App Plan

### Recommended Stack

- Tauri 2
- Next.js frontend
- Local SQLite database
- Optional local Next server for development mode

### Phase 1.1 Desktop MVP

Deliverables:

- Add Tauri project scaffold.
- Add desktop app icon placeholder.
- Add desktop build scripts.
- Run AI DevOS in a desktop shell.
- Document local desktop build steps.

Scripts proposal:

```json
{
  "desktop:dev": "tauri dev",
  "desktop:build": "tauri build"
}
```

### Risks

- Tauri requires Rust setup.
- Next.js server features may require a local server strategy.
- SQLite file path differs between web, local dev, and desktop.

### Mitigation

- Start with Tauri shell pointing to local dev server.
- Then evaluate production packaging mode.
- Keep database path configurable by environment.

## Development Plan

### Milestone 1: Version 1.1 Design Foundation

Tasks:

1. Add design docs.
2. Add Prisma model proposal.
3. Add UI wireframe notes.
4. Add acceptance criteria.

Acceptance:

- Docs are clear enough for Codex implementation.
- Scope is split into manageable tasks.

### Milestone 2: Agent Configuration

Tasks:

1. Add Prisma models.
2. Add seed data for default ChatGPT and Codex profiles.
3. Add service layer.
4. Add API routes.
5. Add Settings UI.

Acceptance:

- User can view and create ChatGPT/Codex configs.
- Project can bind to default configs.

### Milestone 3: Task Template

Tasks:

1. Add task template constants.
2. Extend task schema.
3. Update task creation UI.
4. Add prompt generation.
5. Update task board/detail display.

Acceptance:

- A task can be created from the default template.
- Codex Prompt is generated from structured fields.

### Milestone 4: Desktop MVP

Tasks:

1. Add Tauri scaffold.
2. Add desktop dev/build scripts.
3. Configure app metadata.
4. Verify desktop shell opens AI DevOS.
5. Document desktop build steps.

Acceptance:

- `desktop:dev` can launch the app.
- Desktop build path is documented.

## Acceptance Criteria for 1.1

- `npm run verify` passes.
- User can configure ChatGPT profile.
- User can configure Codex profile.
- Project can show or bind agent profiles.
- Task creation uses the default template fields.
- Codex Prompt can be generated from task template fields.
- Desktop app scaffold exists.
- Desktop app can be launched in development mode.
- Documentation explains setup and usage in Chinese and English.

## Recommended Implementation Order

1. Task template
2. Agent configuration data model
3. Settings UI for ChatGPT/Codex
4. Project binding
5. Desktop scaffold

Reason:

- Task template gives immediate workflow value.
- Agent config depends on clear execution policy fields.
- Desktop packaging is more complex and should follow the web workflow stabilization.
