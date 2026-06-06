# AI DevOS 1.2 Progress and Low-Codex-Budget Workflow / AI DevOS 1.2 进度与省 Codex 额度流程

## Current Status / 当前状态

- Branch: `codex/ai-devos-1.2`
- Production version: `1.1.0`
- Development version: `1.2.0` in progress
- Current focus: use ChatGPT for planning and handoff, then let Codex do only scoped implementation.

- 分支：`codex/ai-devos-1.2`
- 线上版本：`1.1.0`
- 开发版本：`1.2.0` 进行中
- 当前重点：由 ChatGPT 完成规划和交接包，Codex 只做边界清晰的工程执行。

## Completed in This Increment / 本增量已完成

1. Added ChatGPT handoff fields to tasks:
   - `planningSummary`
   - `implementationPlan`
   - `codexBudgetNotes`
2. Added these fields to the Codex task template form.
3. Added the fields to generated Codex prompts.
4. Added low-budget execution rules to generated prompts.
5. Added SQLite bootstrap and migration support.
6. Added project detail display for ChatGPT handoff notes.

1. 为任务新增 ChatGPT 交接字段：
   - `planningSummary`
   - `implementationPlan`
   - `codexBudgetNotes`
2. 将字段接入 Codex 任务模板表单。
3. 将字段接入自动生成的 Codex Prompt。
4. 在生成的 Prompt 中加入低额度执行规则。
5. 同步 SQLite 初始化和升级迁移。
6. 在项目详情页展示 ChatGPT 交接说明。

## Why This Reduces Codex Usage / 为什么能减少 Codex 消耗

Codex spends more quota when it must discover requirements, inspect broad code areas, compare architectural options, and ask repeated clarification questions.

Codex 额度消耗通常来自：重新理解需求、大范围阅读代码、比较架构方案、反复追问上下文。

The new workflow moves that work to ChatGPT first:

新流程把这些工作前置给 ChatGPT：

1. ChatGPT clarifies goal and scope.
2. ChatGPT identifies relevant files.
3. ChatGPT proposes implementation steps.
4. ChatGPT defines what Codex should not explore.
5. Codex receives a focused prompt and executes.

1. ChatGPT 先澄清目标和范围。
2. ChatGPT 先定位相关文件。
3. ChatGPT 先给出建议实现步骤。
4. ChatGPT 先说明 Codex 不需要探索的边界。
5. Codex 收到聚焦 Prompt 后直接执行。

## Recommended Operating Procedure / 推荐操作流程

### Step 1: Ask ChatGPT to Plan / 第一步：让 ChatGPT 规划

Use this prompt:

使用这个 Prompt：

```text
请作为 AI DevOS 的 ChatGPT 规划助手，先不要写代码。
请基于以下目标输出可交给 Codex 的低额度执行包：

目标：
范围：
已有上下文：

请输出：
1. ChatGPT 规划摘要
2. 建议实现步骤
3. 相关文件
4. 验收标准
5. Codex 省额度说明：哪些文件优先看，哪些方向不要重新探索，遇到缺口时如何最短反馈
```

### Step 2: Create AI DevOS Task / 第二步：创建 AI DevOS 任务

Fill in:

填写：

- Goal / 目标
- Scope / 范围
- ChatGPT planning summary / ChatGPT 规划摘要
- Suggested implementation plan / 建议实现步骤
- Codex budget notes / Codex 省额度说明
- Related files / 相关文件
- Acceptance criteria / 验收标准
- Commit / push / deployment flags

### Step 3: Send Generated Prompt to Codex / 第三步：把生成 Prompt 交给 Codex

Use the generated Codex Prompt without adding broad extra context unless necessary.

除非必要，不要再额外塞入大量宽泛上下文，直接使用生成的 Codex Prompt。

### Step 4: Review and Feed Back / 第四步：验收和反馈

After Codex finishes:

Codex 完成后：

1. Run validation.
2. Record result summary.
3. If output is incomplete, ask ChatGPT to rewrite only the missing handoff section.
4. Send a short follow-up to Codex.

1. 运行验证。
2. 记录执行结果。
3. 如果输出不完整，让 ChatGPT 只重写缺失的交接部分。
4. 给 Codex 一个短追问任务。

## Progress Checklist / 进度清单

- [x] Create `1.2.0` branch.
- [x] Add low-Codex-budget handoff fields.
- [x] Add handoff fields to task template form.
- [x] Add handoff fields to generated Codex Prompt.
- [x] Add project detail handoff display.
- [ ] Add task detail/edit page.
- [ ] Add prompt copy button.
- [ ] Add execution result fields.
- [ ] Add login protection.
- [ ] Add Settings management UI.
- [ ] Add deployment records.
- [ ] Deploy `1.2.0`.

## Next Development Step / 下一步开发

Build the task detail and edit flow:

开发任务详情与编辑流程：

1. `/tasks/[id]` detail page.
2. Edit task handoff fields.
3. One-click copy generated Codex Prompt.
4. Save Codex execution result.
5. Move task to review.
