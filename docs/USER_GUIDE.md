# AI DevOS Detailed User Guide / AI DevOS 详细使用说明

AI DevOS is a development operating system for AI projects. It helps you turn GPT planning into Codex execution, then track implementation, review, and delivery in one workflow.

AI DevOS 是一个 AI 项目开发总控台。它帮助你把 GPT 的规划转化为 Codex 的工程执行，并把实现、验收、交付统一纳入一个可追踪流程。

## 1. What AI DevOS Does / AI DevOS 用来做什么

### 中文

AI DevOS 适合用来管理以下内容：

- AI 项目列表
- 项目需求
- 技术设计
- Codex 执行任务
- GPT / Codex Prompt
- Review 验收记录
- 项目生命周期状态

它的核心目标是让每个项目都能回答这几个问题：

- 当前项目处于哪个阶段？
- 当前最重要的目标是什么？
- 下一步应该做什么？
- 哪些任务可以交给 Codex？
- Codex 完成后如何验收？

### English

AI DevOS helps you manage:

- AI project portfolio
- Requirements
- Technical designs
- Codex execution tasks
- GPT / Codex prompts
- Review records
- Project lifecycle status

Its core purpose is to make every project answerable:

- Which stage is the project in?
- What is the current goal?
- What is the next action?
- Which tasks are ready for Codex?
- How should Codex output be reviewed?

## 2. Core Workflow / 核心工作流

```text
Idea
  -> Research
  -> Design
  -> Ready for Codex
  -> In Codex
  -> Review
  -> Done
```

### 中文

推荐使用顺序：

1. 在 `Projects` 创建项目
2. 用 GPT 完成需求分析和技术设计
3. 把 GPT 输出整理为 `Requirements` 和 `Designs`
4. 把设计拆分成 `Tasks`
5. 给每个可执行任务补充 Codex Prompt
6. 将任务状态设置为 `READY_FOR_CODEX`
7. 把任务交给 Codex 执行
8. Codex 完成后进入 `REVIEW`
9. 人工验收通过后标记为 `DONE`

### English

Recommended flow:

1. Create a project in `Projects`
2. Use GPT for requirement analysis and technical design
3. Convert GPT output into `Requirements` and `Designs`
4. Break the design into `Tasks`
5. Add a Codex prompt for each executable task
6. Set executable tasks to `READY_FOR_CODEX`
7. Send the task to Codex
8. Move completed Codex work to `REVIEW`
9. Mark it as `DONE` after human acceptance

## 3. Tool Configuration / 工具配置

### 3.1 Required Tools / 必需工具

### 中文

本地开发建议准备：

- Node.js 20 或更高版本
- npm
- Git
- GitHub 账号
- Vercel 账号
- Codex
- GPT / ChatGPT

当前项目技术栈：

- Next.js 15
- TypeScript
- TailwindCSS
- Prisma
- SQLite

### English

Recommended local tools:

- Node.js 20 or later
- npm
- Git
- GitHub account
- Vercel account
- Codex
- GPT / ChatGPT

Current stack:

- Next.js 15
- TypeScript
- TailwindCSS
- Prisma
- SQLite

### 3.2 Local Environment / 本地环境配置

### 中文

在本地运行项目：

```bash
git clone https://github.com/YX-NAS/ai-devos.git
cd ai-devos
npm install
cp .env.example .env
npm run prisma:generate
npm run db:push
npm run db:seed
npm run dev
```

打开：

```text
http://127.0.0.1:3000
```

本地 `.env` 默认配置：

```env
DATABASE_URL="file:./dev.db"
```

### English

Run locally:

```bash
git clone https://github.com/YX-NAS/ai-devos.git
cd ai-devos
npm install
cp .env.example .env
npm run prisma:generate
npm run db:push
npm run db:seed
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

Default local `.env`:

```env
DATABASE_URL="file:./dev.db"
```

### 3.3 GitHub Configuration / GitHub 配置

### 中文

推荐仓库：

```text
https://github.com/YX-NAS/ai-devos.git
```

常用命令：

```bash
git status
git add .
git commit -m "your message"
git push
```

如果你要让 Codex 完成某个任务，建议在任务中说明：

- 目标
- 范围
- 相关文件
- 验收标准
- 是否需要 commit
- 是否需要 push
- 是否需要部署

### English

Repository:

```text
https://github.com/YX-NAS/ai-devos.git
```

Common commands:

```bash
git status
git add .
git commit -m "your message"
git push
```

When assigning work to Codex, include:

- Goal
- Scope
- Relevant files
- Acceptance criteria
- Whether to commit
- Whether to push
- Whether to deploy

### 3.4 Vercel Configuration / Vercel 配置

### 中文

当前项目已经支持 Vercel 部署。

Vercel 项目建议配置：

- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: 使用默认值
- Environment Variable:

```env
DATABASE_URL=file:/tmp/ai-devos.db
```

当前 `vercel.json` 已包含：

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "DATABASE_URL": "file:/tmp/ai-devos.db"
  }
}
```

注意：当前云端版本使用临时 SQLite 数据库，适合演示和流程验证。长期生产使用建议切换到持久化数据库。

### English

The project is already prepared for Vercel deployment.

Recommended Vercel settings:

- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: default
- Environment Variable:

```env
DATABASE_URL=file:/tmp/ai-devos.db
```

Current `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "DATABASE_URL": "file:/tmp/ai-devos.db"
  }
}
```

Note: the cloud MVP uses temporary SQLite storage. It is good for demos and workflow validation. For production, use a persistent database.

### 3.5 Recommended Production Database / 推荐生产数据库

### 中文

如果要长期保存真实项目数据，建议改用：

- Vercel Postgres
- Neon
- Supabase Postgres
- Turso

切换数据库时需要调整：

1. `prisma/schema.prisma` 的 datasource provider
2. Vercel 环境变量 `DATABASE_URL`
3. 数据迁移脚本
4. seed 策略

### English

For long-term real data, use:

- Vercel Postgres
- Neon
- Supabase Postgres
- Turso

When switching databases, update:

1. `prisma/schema.prisma` datasource provider
2. Vercel `DATABASE_URL`
3. Migration scripts
4. Seed strategy

## 4. First-Time Setup / 首次使用步骤

### 中文

第一次使用 AI DevOS 时，建议按以下步骤：

1. 打开云端部署地址或本地地址
2. 进入 `Dashboard`
3. 确认是否能看到默认项目 `AI DevOS`
4. 进入 `Projects`
5. 点击 `New Project`
6. 填写项目基础信息
7. 设置项目阶段为 `IDEA` 或 `DESIGN`
8. 保存项目
9. 回到 Dashboard 确认项目统计变化

### English

First-time usage:

1. Open the cloud deployment URL or local URL
2. Go to `Dashboard`
3. Confirm the default `AI DevOS` project is visible
4. Go to `Projects`
5. Click `New Project`
6. Fill in project metadata
7. Set project stage to `IDEA` or `DESIGN`
8. Save the project
9. Return to Dashboard and confirm stats updated

## 5. Page-by-Page Guide / 页面使用说明

### 5.1 Dashboard / 仪表盘

### 中文

用途：查看全局项目状态。

重点指标：

- 项目总数
- Ready for Codex 任务数
- 进行中任务数
- 阻塞项目数
- 最近任务

使用步骤：

1. 每天开始工作先打开 Dashboard
2. 查看是否有 `BLOCKED` 项目
3. 查看是否有 `READY_FOR_CODEX` 任务
4. 选择今天最重要的项目推进
5. 进入对应 Project 或 Tasks 页面执行下一步

### English

Purpose: global project status overview.

Key metrics:

- Total projects
- Ready for Codex tasks
- In-progress tasks
- Blocked projects
- Recent tasks

Steps:

1. Start your day from Dashboard
2. Check for `BLOCKED` projects
3. Check for `READY_FOR_CODEX` tasks
4. Pick the most important project for the day
5. Open the related Project or Tasks page

### 5.2 Projects / 项目列表

### 中文

用途：集中管理所有 AI 项目。

字段说明：

- Name：项目名称
- Category：项目分类
- Priority：优先级
- Stage：生命周期阶段
- GitHub：仓库地址
- Next Action：下一步动作
- Tasks：任务数量

创建项目步骤：

1. 点击 `New Project`
2. 输入项目名称
3. 输入 slug，例如 `ai-devos`
4. 选择分类
5. 选择优先级
6. 选择阶段
7. 填写 GitHub 仓库
8. 填写当前目标
9. 填写下一步动作
10. 点击保存

### English

Purpose: manage all AI projects.

Fields:

- Name: project name
- Category: project category
- Priority: priority
- Stage: lifecycle stage
- GitHub: repository URL
- Next Action: next action
- Tasks: task count

Create a project:

1. Click `New Project`
2. Enter project name
3. Enter slug, for example `ai-devos`
4. Select category
5. Select priority
6. Select stage
7. Add GitHub repository
8. Add current goal
9. Add next action
10. Save

### 5.3 Project Detail / 项目详情

### 中文

用途：管理单个项目的生命周期。

重点查看：

- 当前目标
- 当前任务
- 下一步动作
- Requirements
- Tasks

推荐执行步骤：

1. 打开项目详情
2. 确认当前目标是否准确
3. 查看任务是否足够清晰
4. 如果任务不清晰，回到 GPT 补需求和设计
5. 如果任务清晰，设置为 `READY_FOR_CODEX`
6. 交给 Codex 执行
7. Codex 完成后进入 Review

### English

Purpose: manage a single project lifecycle.

Focus areas:

- Current goal
- Current task
- Next action
- Requirements
- Tasks

Recommended steps:

1. Open project detail
2. Confirm the current goal
3. Check if tasks are clear
4. If tasks are unclear, go back to GPT for requirements and design
5. If tasks are clear, set them to `READY_FOR_CODEX`
6. Send them to Codex
7. Move Codex output to Review

### 5.4 Tasks / 任务中心

### 中文

用途：按照状态管理所有项目任务。

任务状态：

- `TODO`：待开始
- `RESEARCH`：需要调研
- `DESIGN`：需要设计
- `READY_FOR_CODEX`：可以交给 Codex
- `IN_PROGRESS`：执行中
- `REVIEW`：等待验收
- `DONE`：完成
- `BLOCKED`：阻塞

日常使用步骤：

1. 打开 `Tasks`
2. 优先查看 `READY_FOR_CODEX`
3. 选择一个 P0 或 P1 任务
4. 复制任务说明和 Codex Prompt
5. 交给 Codex 执行
6. 执行完成后检查结果
7. 将任务移动到 `REVIEW`
8. 人工验收后移动到 `DONE`

### English

Purpose: manage tasks by status.

Task statuses:

- `TODO`: not started
- `RESEARCH`: needs research
- `DESIGN`: needs design
- `READY_FOR_CODEX`: ready for Codex
- `IN_PROGRESS`: in progress
- `REVIEW`: waiting for review
- `DONE`: completed
- `BLOCKED`: blocked

Daily steps:

1. Open `Tasks`
2. Check `READY_FOR_CODEX`
3. Pick a P0 or P1 task
4. Copy task details and Codex prompt
5. Send it to Codex
6. Review the result
7. Move it to `REVIEW`
8. Move it to `DONE` after acceptance

### 5.5 Prompts / Prompt 中心

### 中文

用途：保存可复用的 GPT 和 Codex Prompt。

Prompt 类型：

- `GPT_PLANNING`：GPT 调研、规划、设计
- `CODEX_EXECUTION`：Codex 工程执行
- `REVIEW`：验收和复盘
- `SYSTEM`：长期系统规则

推荐模板：

```text
目标：
范围：
上下文：
相关文件：
验收标准：
需要提交：
需要推送：
需要部署：
```

### English

Purpose: save reusable GPT and Codex prompts.

Prompt types:

- `GPT_PLANNING`: GPT research, planning, design
- `CODEX_EXECUTION`: Codex implementation
- `REVIEW`: acceptance and retrospective
- `SYSTEM`: long-term system rules

Recommended template:

```text
Goal:
Scope:
Context:
Relevant files:
Acceptance criteria:
Commit required:
Push required:
Deploy required:
```

### 5.6 Agents / Agent 分工

### 中文

用途：明确 GPT、Codex、Human 的职责。

推荐分工：

- GPT：需求分析、调研、技术设计、任务拆分
- Codex：代码实现、测试、提交、修复、部署
- Human：目标决策、验收、优先级判断、发布确认

### English

Purpose: clarify responsibilities.

Recommended ownership:

- GPT: requirements, research, technical design, task breakdown
- Codex: implementation, tests, commits, fixes, deployment
- Human: decisions, acceptance, priority, release approval

### 5.7 Workflows / 工作流

### 中文

用途：帮助项目回到正确生命周期阶段。

当项目混乱时，用这个判断：

- 没想清楚做什么：`RESEARCH`
- 知道做什么但不知道怎么做：`DESIGN`
- 设计已经清楚：`READY_FOR_CODEX`
- Codex 正在执行：`IN_CODEX`
- 等验收：`REVIEW`
- 已验收：`DONE`

### English

Purpose: realign project lifecycle stage.

Use this when a project feels messy:

- Unclear what to build: `RESEARCH`
- Clear what, unclear how: `DESIGN`
- Design is clear: `READY_FOR_CODEX`
- Codex is working: `IN_CODEX`
- Waiting for acceptance: `REVIEW`
- Accepted: `DONE`

### 5.8 Settings / 设置

### 中文

用途：查看默认配置。MVP 阶段当前为只读占位。

后续可扩展：

- 默认项目分类
- 默认优先级
- GitHub 账号
- API 地址
- Codex 使用策略

### English

Purpose: view default settings. In the MVP, this page is a read-only placeholder.

Future extensions:

- Default project category
- Default priority
- GitHub account
- API endpoint
- Codex strategy

## 6. GPT Planning Procedure / GPT 规划步骤

### 中文

当你有一个新想法时，先让 GPT 做规划：

1. 描述项目目标
2. 说明用户是谁
3. 说明当前约束
4. 要求 GPT 输出 PRD
5. 要求 GPT 输出技术设计
6. 要求 GPT 拆分任务
7. 把输出写入 AI DevOS

推荐 GPT Prompt：

```text
请作为产品规划和技术架构助手，帮我把以下想法整理成可交给 Codex 执行的项目计划。

项目目标：
用户对象：
核心功能：
技术约束：
交付标准：

请输出：
1. PRD
2. 技术设计
3. 数据模型
4. 页面结构
5. API 设计
6. Codex 任务拆分
7. 每个任务的验收标准
```

### English

When you have a new idea, ask GPT to plan first:

1. Describe the project goal
2. Define the target users
3. Explain constraints
4. Ask GPT for a PRD
5. Ask GPT for technical design
6. Ask GPT to break down tasks
7. Save the output into AI DevOS

Recommended GPT prompt:

```text
Act as a product planning and technical architecture assistant. Turn the following idea into a project plan that Codex can execute.

Project goal:
Target users:
Core features:
Technical constraints:
Delivery standard:

Please output:
1. PRD
2. Technical design
3. Data model
4. Page structure
5. API design
6. Codex task breakdown
7. Acceptance criteria for each task
```

## 7. Codex Execution Procedure / Codex 执行步骤

### 中文

交给 Codex 前，任务必须足够清晰。

执行步骤：

1. 打开 AI DevOS 的 `Tasks`
2. 找到 `READY_FOR_CODEX` 任务
3. 复制任务标题、范围、验收标准和 Prompt
4. 在 Codex 中粘贴任务
5. 要求 Codex 实现、测试、提交
6. Codex 完成后检查结果
7. 把执行摘要写入任务
8. 创建 Review 记录

推荐 Codex Prompt：

```text
请根据以下任务进行开发，直到验收通过，可以交付。

项目：
任务：
范围：
相关文件：
技术约束：
验收标准：

要求：
1. 先阅读代码和上下文
2. 按现有技术栈实现
3. 保持改动范围聚焦
4. 运行必要测试
5. 说明验证结果
6. 提交并推送到 GitHub
7. 如需部署，请完成部署并给出访问地址
```

### English

Before sending a task to Codex, make sure it is clear enough.

Steps:

1. Open `Tasks` in AI DevOS
2. Find a `READY_FOR_CODEX` task
3. Copy title, scope, acceptance criteria, and prompt
4. Paste the task into Codex
5. Ask Codex to implement, test, and commit
6. Review Codex output
7. Save execution summary into the task
8. Create a Review record

Recommended Codex prompt:

```text
Please develop according to the following task until acceptance passes and the work is ready to deliver.

Project:
Task:
Scope:
Relevant files:
Technical constraints:
Acceptance criteria:

Requirements:
1. Read the code and context first
2. Implement using the existing stack
3. Keep changes focused
4. Run necessary tests
5. Explain validation results
6. Commit and push to GitHub
7. If deployment is required, deploy and provide the URL
```

## 8. Review Procedure / 验收步骤

### 中文

验收时按以下顺序：

1. 检查任务验收标准
2. 打开相关页面
3. 检查数据是否正确
4. 检查 API 是否返回预期结果
5. 运行测试或构建
6. 检查 GitHub 提交
7. 检查 Vercel 部署
8. 记录 Review 结果

验收记录建议包含：

- 验收时间
- 验收人
- 检查清单
- 测试结果
- 风险等级
- 是否通过
- 后续动作

### English

Review in this order:

1. Check task acceptance criteria
2. Open related pages
3. Check data correctness
4. Check API responses
5. Run tests or build
6. Check GitHub commits
7. Check Vercel deployment
8. Record Review result

Recommended Review record:

- Review time
- Reviewer
- Checklist
- Test result
- Risk level
- Pass or fail
- Follow-up actions

## 9. Daily Operating Routine / 每日使用流程

### 中文

每天建议这样使用：

1. 打开 Dashboard
2. 查看阻塞项目
3. 查看 Ready for Codex 任务
4. 选择一个 P0/P1 任务
5. 交给 Codex 执行
6. 验收结果
7. 更新项目下一步动作
8. 记录当天完成内容

每周建议这样复盘：

1. 查看所有 BLOCKED 项目
2. 查看所有 REVIEW 任务
3. 清理不再重要的 P2/P3 任务
4. 调整项目优先级
5. 更新下一周目标

### English

Daily routine:

1. Open Dashboard
2. Check blocked projects
3. Check Ready for Codex tasks
4. Pick one P0/P1 task
5. Send it to Codex
6. Review the result
7. Update next action
8. Record what was completed

Weekly review:

1. Review all BLOCKED projects
2. Review all REVIEW tasks
3. Clean up low-value P2/P3 tasks
4. Adjust project priorities
5. Update next week's goals

## 10. API Usage / API 使用

### 中文

常用 API：

```http
GET /api/projects
POST /api/projects
GET /api/projects/:id
PATCH /api/projects/:id
DELETE /api/projects/:id
GET /api/tasks
PATCH /api/tasks/:id/status
GET /api/prompts
POST /api/prompts
```

创建项目示例：

```bash
curl -X POST http://127.0.0.1:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Example AI Project",
    "slug": "example-ai-project",
    "description": "A sample AI project",
    "category": "AI_PRODUCT",
    "priority": "P1",
    "stage": "IDEA",
    "repoName": "YX-NAS/example-ai-project",
    "repoUrl": "https://github.com/YX-NAS/example-ai-project",
    "currentGoal": "Complete project planning",
    "nextAction": "Ask GPT to generate PRD"
  }'
```

### English

Common APIs:

```http
GET /api/projects
POST /api/projects
GET /api/projects/:id
PATCH /api/projects/:id
DELETE /api/projects/:id
GET /api/tasks
PATCH /api/tasks/:id/status
GET /api/prompts
POST /api/prompts
```

Create project example:

```bash
curl -X POST http://127.0.0.1:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Example AI Project",
    "slug": "example-ai-project",
    "description": "A sample AI project",
    "category": "AI_PRODUCT",
    "priority": "P1",
    "stage": "IDEA",
    "repoName": "YX-NAS/example-ai-project",
    "repoUrl": "https://github.com/YX-NAS/example-ai-project",
    "currentGoal": "Complete project planning",
    "nextAction": "Ask GPT to generate PRD"
  }'
```

## 11. Validation Commands / 验证命令

### 中文

本地验证：

```bash
npm run verify
```

单独运行：

```bash
npm run lint
npm run build
```

数据库初始化：

```bash
npm run prisma:generate
npm run db:push
npm run db:seed
```

### English

Local validation:

```bash
npm run verify
```

Run separately:

```bash
npm run lint
npm run build
```

Database setup:

```bash
npm run prisma:generate
npm run db:push
npm run db:seed
```

## 12. AI DevOS 1.1 Features / AI DevOS 1.1 功能

### 12.1 ChatGPT and Codex Profile Binding / ChatGPT 与 Codex 配置绑定

#### 中文

用途：

- ChatGPT Profile 用于记录需求分析、技术设计、任务拆分策略。
- Codex Profile 用于记录代码执行、验证、commit、push、部署策略。
- 当前版本默认创建两个 Profile：`Default ChatGPT Planning` 和 `Default Codex Execution`。
- `apiKeyRef` 只保存密钥引用名称，不保存明文 API Key。

查看步骤：

1. 打开 `Settings`。
2. 查看 `ChatGPT Profiles`。
3. 查看 `Codex Profiles`。
4. 打开项目详情页。
5. 查看 `Agent Config Binding` 区域，确认该项目绑定的规划与执行配置。

通过 API 新增 Profile：

```bash
curl -X POST http://127.0.0.1:3000/api/agent-configs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Team Codex Executor",
    "provider": "CODEX",
    "role": "CODEX",
    "model": "Codex",
    "strategy": "先阅读代码，按任务模板实现，运行验证；需要时 commit、push、deploy。"
  }'
```

绑定到项目：

```bash
curl -X POST http://127.0.0.1:3000/api/projects/PROJECT_ID/agent-bindings \
  -H "Content-Type: application/json" \
  -d '{
    "configId": "CONFIG_ID",
    "purpose": "EXECUTION"
  }'
```

#### English

Purpose:

- ChatGPT Profile records requirement analysis, technical design, and task breakdown strategy.
- Codex Profile records implementation, validation, commit, push, and deployment strategy.
- The current version creates two default profiles: `Default ChatGPT Planning` and `Default Codex Execution`.
- `apiKeyRef` stores a secret reference name only. It does not store plaintext API keys.

Steps:

1. Open `Settings`.
2. Review `ChatGPT Profiles`.
3. Review `Codex Profiles`.
4. Open a project detail page.
5. Check `Agent Config Binding` to confirm the planning and execution profiles for the project.

Create a profile with API:

```bash
curl -X POST http://127.0.0.1:3000/api/agent-configs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Team Codex Executor",
    "provider": "CODEX",
    "role": "CODEX",
    "model": "Codex",
    "strategy": "Read code first, implement from the task template, run validation, then commit, push, and deploy when required."
  }'
```

Bind it to a project:

```bash
curl -X POST http://127.0.0.1:3000/api/projects/PROJECT_ID/agent-bindings \
  -H "Content-Type: application/json" \
  -d '{
    "configId": "CONFIG_ID",
    "purpose": "EXECUTION"
  }'
```

### 12.2 Codex Task Template / Codex 任务模板

#### 中文

创建任务时默认使用任务模板，字段包括：

1. `目标`
2. `范围`
3. `相关文件`
4. `验收标准`
5. `是否需要 commit`
6. `是否需要 push`
7. `是否需要部署`

使用步骤：

1. 打开 `Projects`。
2. 进入某个项目。
3. 打开该项目的 `Tasks` 页面。
4. 在 `Codex Task Template` 表单中填写任务标题、目标、范围、相关文件和验收标准。
5. 勾选是否需要 `commit`、`push`、`部署`。
6. 点击 `Create Codex Task`。
7. 回到项目详情页，展开任务下方的 `Codex Prompt`。
8. 将生成的 Prompt 交给 Codex 执行。

#### English

New tasks use the Codex task template by default. Fields:

1. `Goal`
2. `Scope`
3. `Related files`
4. `Acceptance criteria`
5. `Commit required`
6. `Push required`
7. `Deployment required`

Steps:

1. Open `Projects`.
2. Open a project.
3. Open the project `Tasks` page.
4. Fill in the `Codex Task Template` form with title, goal, scope, related files, and acceptance criteria.
5. Select whether commit, push, and deployment are required.
6. Click `Create Codex Task`.
7. Return to the project detail page and expand `Codex Prompt`.
8. Send the generated prompt to Codex for execution.

### 12.3 Desktop App / 桌面应用

#### 中文

当前桌面应用是 Tauri 开发壳，适合本地日常使用和后续封装验证。

依赖：

1. Node.js
2. npm
3. Rust
4. 当前系统对应的 Tauri 依赖

启动：

```bash
npm install
npm run desktop:dev
```

构建桌面包：

```bash
npm run desktop:build
```

说明：当前生产桌面包仍需继续评估静态导出、内置本地 Next 服务或云端优先桌面壳方案。

#### English

The current desktop app is a Tauri development shell. It is suitable for local daily usage and future packaging validation.

Requirements:

1. Node.js
2. npm
3. Rust
4. OS-specific Tauri dependencies

Start:

```bash
npm install
npm run desktop:dev
```

Build desktop package:

```bash
npm run desktop:build
```

Note: production desktop packaging still needs a follow-up decision between static export, bundled local Next server, or cloud-first desktop shell.

## 13. Troubleshooting / 常见问题

### 中文

问题：页面没有数据。

处理：

```bash
npm run db:push
npm run db:seed
```

问题：Prisma Client 报错。

处理：

```bash
npm run prisma:generate
```

问题：Vercel 上数据重置。

原因：当前 MVP 使用 `/tmp` SQLite，Serverless 实例重启后可能重置。

处理：接入持久化数据库。

问题：构建失败。

处理：

```bash
npm install
npm run verify
```

### English

Issue: no data on pages.

Fix:

```bash
npm run db:push
npm run db:seed
```

Issue: Prisma Client error.

Fix:

```bash
npm run prisma:generate
```

Issue: data resets on Vercel.

Reason: the MVP uses `/tmp` SQLite. Serverless instances may reset.

Fix: connect a persistent database.

Issue: build fails.

Fix:

```bash
npm install
npm run verify
```

## 14. Recommended Next Improvements / 后续改进建议

### 中文

建议下一步：

1. 接入持久化数据库
2. 增加登录和权限
3. 增加项目编辑表单
4. 增加需求、设计、任务、Prompt 的增删改
5. 增加 Codex Prompt 一键复制
6. 接入 GitHub PR 和 Issue
7. 增加 Review 模板
8. 增加部署记录

### English

Recommended next steps:

1. Add persistent database
2. Add authentication and permissions
3. Add project edit form
4. Add CRUD for requirements, designs, tasks, and prompts
5. Add one-click Codex prompt copy
6. Integrate GitHub PRs and Issues
7. Add Review templates
8. Add deployment records
