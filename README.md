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
