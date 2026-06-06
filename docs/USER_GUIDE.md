# AI DevOS 使用说明

AI DevOS 是一个 AI 项目开发总控台，用来把 GPT 的规划工作和 Codex 的工程执行串成一个可追踪、可验收的流程。

## 适用场景

- 同时管理多个 AI 项目
- 把需求、技术设计、任务拆分和 Codex Prompt 放在一个地方
- 跟踪项目从 Idea 到 Done 的生命周期
- 记录 Review、风险和下一步动作
- 为 GPT 规划和 Codex 执行建立固定交接格式

## 基本概念

### Project

Project 是 AI DevOS 的核心对象。每个项目包含名称、分类、优先级、阶段、GitHub 仓库、当前目标和下一步动作。

推荐用法：

- 一个 GitHub 仓库对应一个 Project
- 一个产品、工具、自动化系统或内容项目对应一个 Project
- 项目名称保持清晰，slug 使用小写英文和短横线

### Requirement

Requirement 用来记录项目需求。它适合保存 GPT 输出的产品需求、功能范围和用户故事。

推荐用法：

- P0：MVP 必须完成
- P1：第一版重要能力
- P2：可排期增强项
- P3：想法池

### Design

Design 用来沉淀技术设计、页面原型、API 方案、数据模型和架构说明。

推荐用法：

- 在交给 Codex 前，把核心技术约束写清楚
- 每轮大改版保留一个新的设计版本
- 把设计文档作为任务拆分的依据

### Task

Task 是 Codex 执行的最小工作单元。每个任务应尽量包含范围、验收标准和可直接复制给 Codex 的 Prompt。

任务状态含义：

- TODO：待整理或待开始
- RESEARCH：需要调研
- DESIGN：需要补设计
- READY_FOR_CODEX：已经可以交给 Codex
- IN_PROGRESS：执行中
- REVIEW：等待验收
- DONE：已完成
- BLOCKED：阻塞

### Prompt

Prompt 中心用于保存 GPT 规划 Prompt、Codex 执行 Prompt、Review Prompt 和系统级规则。

推荐用法：

- GPT_PLANNING：需求分析、调研、设计、拆任务
- CODEX_EXECUTION：代码实现、测试、提交、部署
- REVIEW：验收、复盘、风险检查
- SYSTEM：长期规则和协作规范

### Review

Review 用来记录验收结果、检查清单和风险等级。它是从 Codex 执行回到人工决策的重要节点。

### Workflow

Workflow 展示项目从 Idea 到 Done 的标准流转路径：

```text
Idea -> Research -> Design -> Ready for Codex -> In Codex -> Review -> Done
```

## 页面使用方法

### Dashboard

Dashboard 是全局概览页，用来快速判断当前所有项目的状态。

重点关注：

- 项目总数
- Ready for Codex 任务数量
- 进行中任务数量
- 阻塞项目数量
- 最近任务

每天开始工作时，建议先看 Dashboard，再决定今天推进哪个项目。

### Projects

Projects 页面用于管理所有项目。

使用步骤：

1. 点击 `New Project`
2. 填写项目名称、slug、分类、优先级和阶段
3. 添加 GitHub 仓库地址
4. 写清当前目标和下一步动作
5. 保存后进入项目详情页

项目阶段建议：

- 新想法：IDEA
- 需要调研：RESEARCH
- 正在设计：DESIGN
- 可以交给 Codex：READY_FOR_CODEX
- Codex 正在执行：IN_CODEX
- 等待人工验收：REVIEW
- 已完成：DONE
- 卡住：BLOCKED

### Project Detail

项目详情页是单个项目的工作台。

重点查看：

- 当前目标
- 当前任务
- 下一步动作
- Requirements
- Tasks

推荐节奏：

1. 先确认当前目标是否仍然正确
2. 查看当前未完成任务
3. 根据任务验收标准交给 Codex
4. Codex 完成后进入 Review
5. 验收通过后更新项目阶段和下一步动作

### Tasks

Tasks 页面是所有项目的任务看板。

推荐用法：

- 每天优先查看 READY_FOR_CODEX
- 把可以执行的任务交给 Codex
- 把完成后的任务移动到 REVIEW
- 人工验收后移动到 DONE
- 遇到缺资料、缺权限、技术不可行时移动到 BLOCKED

一个好的 Codex 任务应该包含：

- 明确目标
- 具体范围
- 相关文件或页面
- 验收标准
- 是否需要提交、推送或部署

### Prompts

Prompts 页面用于沉淀可复用 Prompt。

推荐保存这些内容：

- 项目初始化 Prompt
- 功能开发 Prompt
- Bug fix Prompt
- Review Prompt
- 发布前检查 Prompt
- 长期协作规则

Prompt 命名建议：

```text
项目名 + 场景 + Agent
```

示例：

```text
AI DevOS 初始化 Codex Prompt
AI DevOS Review Prompt
OpenMAIC 需求拆分 GPT Prompt
```

### Agents

Agents 页面展示 GPT、Codex 和 Human 的分工。

推荐分工：

- GPT：调研、规划、设计、拆任务
- Codex：实现、测试、提交、部署
- Human：决策、验收、发布、风险判断

### Workflows

Workflows 页面展示标准生命周期。它适合在项目混乱时重新对齐阶段。

如果项目卡住，先判断它卡在哪个阶段：

- 不知道做什么：回到 RESEARCH
- 知道做什么但不清楚怎么做：回到 DESIGN
- 已经清楚怎么做：进入 READY_FOR_CODEX
- 已完成但不放心：进入 REVIEW

### Settings

Settings 页面目前是 MVP 占位，用来展示默认分类、默认优先级、GitHub 账号和 Codex 使用策略。后续可扩展为可编辑配置。

## 推荐工作流

### 从一个新想法开始

1. 在 Projects 创建项目
2. 阶段设为 IDEA
3. 把想法交给 GPT 做调研和需求分析
4. 将 GPT 输出整理成 Requirements
5. 让 GPT 继续生成技术设计，保存到 Designs
6. 把设计拆成 Tasks
7. 给可执行任务补上 Codex Prompt
8. 把任务状态改为 READY_FOR_CODEX

### 交给 Codex 执行

1. 打开 Tasks 页面
2. 找到 READY_FOR_CODEX 任务
3. 复制任务目标、范围、验收标准和 Codex Prompt
4. 交给 Codex 执行
5. Codex 完成后记录结果摘要
6. 将任务移动到 REVIEW

### 人工验收

1. 根据 acceptanceCriteria 检查功能
2. 跑必要测试或构建
3. 检查页面和 API 是否符合预期
4. 记录 Review
5. 验收通过后移动到 DONE
6. 更新项目 nextAction

### 发布项目

1. 确认所有 P0 任务为 DONE
2. 确认没有 BLOCKED 任务
3. 跑最终验证命令
4. 推送 GitHub
5. 部署到 Vercel 或其他平台
6. 在 Review 中记录发布结果

## 云端使用注意事项

当前 MVP 的云端部署使用临时 SQLite 演示数据：

- 线上页面可用于浏览、演示和流程验证
- 云端 Serverless 环境的 `/tmp` 数据可能随实例重启而重置
- 长期生产使用建议接入持久化数据库，例如 Vercel Postgres、Neon、Supabase 或 Turso

因此，当前云端版本适合：

- 展示 MVP
- 验证页面和流程
- 体验项目/任务/Prompt 管理结构

不建议直接把它作为长期生产数据源，除非已经替换为持久化数据库。

## 本地开发

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run db:push
npm run db:seed
npm run dev
```

访问：

```text
http://127.0.0.1:3000
```

验证：

```bash
npm run verify
```

## 下一步建议

- 增加项目编辑能力
- 增加需求、设计、任务、Prompt 的创建和编辑表单
- 接入持久化云数据库
- 增加登录和权限控制
- 增加 GitHub PR / Issue 集成
- 增加 Codex Prompt 一键复制
- 增加 Review 清单模板
