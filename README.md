# AI DevOS

AI DevOS is a GPT-planned and Codex-executed development operating system for managing AI projects, requirements, technical design, Codex prompts, task execution, and review workflows.

## Tech Stack

- Next.js 15 App Router
- TypeScript
- TailwindCSS
- Prisma Client
- SQLite

## Getting Started

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run db:push
npm run db:seed
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Usage

AI DevOS is organized around a simple operating flow:

```text
Project -> Requirement -> Design -> Task -> Codex Prompt -> Review -> Done
```

Use the Dashboard to understand global status, Projects to manage each AI project, Tasks to hand executable work to Codex, Prompts to save reusable GPT/Codex instructions, and Reviews to record acceptance results.

For a detailed bilingual step-by-step guide, including tool configuration, GPT planning, Codex execution, Vercel deployment notes, API examples, validation commands, and troubleshooting, see [docs/USER_GUIDE.md](docs/USER_GUIDE.md).

## Versions

- `1.0.0`: packaged MVP release. See [docs/10_RELEASE_1_0.md](docs/10_RELEASE_1_0.md).
- `1.1.0`: planned next phase for ChatGPT/Codex configuration binding, Codex task templates, and desktop app scaffold. See [docs/11_PHASE_1_1_PLAN.md](docs/11_PHASE_1_1_PLAN.md) and [docs/12_PHASE_1_1_DEVELOPMENT_DESIGN.md](docs/12_PHASE_1_1_DEVELOPMENT_DESIGN.md).

## Cloud Deployment

The Vercel deployment is suitable for MVP demos and workflow validation. The current cloud setup uses a temporary SQLite database path and auto-seeds demo data when needed. For long-term production use, replace SQLite with a persistent database such as Vercel Postgres, Neon, Supabase, or Turso.

## Scripts

```bash
npm run dev
npm run verify
npm run db:push
npm run db:seed
```

`npm run verify` runs lint and production build.

## MVP Scope

- Dashboard with project/task status summary
- Project list, detail, and create page
- Task board across all projects
- Prompt center
- Agent responsibility center
- Workflow timeline
- Settings placeholder
- REST APIs for projects, requirements, designs, tasks, prompts, reviews, and workflow events
- Seed data for AI DevOS and sample related work

## Notes

This project includes `scripts/setup-sqlite.mjs` as a local SQLite schema initializer. It keeps setup deterministic in this workspace while preserving the Prisma schema as the source data model contract.
