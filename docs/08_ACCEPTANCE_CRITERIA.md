# AI DevOS MVP Acceptance Criteria

## Functional

- Dashboard `/` shows total projects, Ready for Codex tasks, in-progress tasks, blocked projects, core projects, and recent tasks.
- Projects `/projects` lists project name, category, priority, stage, GitHub repository, next action, and task count.
- Project detail `/projects/[id]` shows lifecycle summary, requirements, tasks, current goal, current task, and next action.
- Task center `/tasks` groups tasks by status.
- Prompt center `/prompts` lists GPT planning, Codex execution, review, and system prompts.
- Agent center `/agents` shows GPT, Codex, and human responsibilities.
- Workflow `/workflows` shows Idea to Done lifecycle.
- Settings `/settings` shows MVP configuration placeholders.
- API routes support project CRUD plus project requirements, designs, tasks, reviews, workflows, global tasks, task status updates, and prompts.

## Technical

- `npm run prisma:generate` succeeds.
- `npm run db:push && npm run db:seed` creates a local SQLite database and seed records.
- `npm run verify` succeeds.
- Browser smoke test confirms `/`, `/projects`, and `/tasks` render expected seeded content.
- API smoke test confirms `/api/projects` and `/api/tasks` return seeded JSON.

## Current Result

Passed locally on Next.js 15.5.19.
