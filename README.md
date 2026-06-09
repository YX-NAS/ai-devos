# AI DevOS

> ChatGPT 规划 + Codex 执行的 AI 开发总控台  
> Production: `https://codex.5176nas.site`

AI DevOS is a development operating system that orchestrates ChatGPT for planning and Codex for execution. It auto-decomposes goals into executable tasks, tracks progress on a drag-and-drop Kanban board, records deployment history, and secures the entire workflow behind admin authentication.

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | Prisma + SQLite |
| Charts | Recharts |
| Drag & Drop | dnd-kit |
| Deployment | Docker + Nginx |

## Quick Start

```bash
npm install
cp .env.example .env
echo "AI_DEVOS_ADMIN_PASSWORD=your-password" >> .env
npm run prisma:generate
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), log in with your admin password.

## Core Features

### ChatGPT → Codex Automated Pipeline
1. Input a goal on the Dashboard Quick Plan
2. Generate a structured planning prompt
3. Copy → paste to ChatGPT → get response back
4. Paste ChatGPT response → AI DevOS auto-parses into tasks
5. Each task pre-loaded with Codex execution prompt
6. One-click "Execute with Codex" on any task (Mac with Codex CLI)

### Drag-and-Drop Kanban Board
8-column task board (TODO → RESEARCH → DESIGN → READY_FOR_CODEX → IN_PROGRESS → REVIEW → DONE → BLOCKED). Drag cards between columns to update status instantly.

### Dashboard Charts
Bar chart (tasks by status) + donut chart (status distribution) powered by Recharts.

### Project Management
- Create, edit, and delete projects
- Auto-bind default ChatGPT/Codex agent configs
- Track requirements, designs, tasks, reviews per project
- Deployment records with environment, version, commit SHA

### Settings & Security
- Agent profile management (ChatGPT / Codex / OpenAI API / Local)
- Auth mode: API Key or Account Login
- Security headers (CSP, X-Frame-Options, X-Content-Type-Options)
- Login rate limiting (5 attempts/minute)
- Timing-safe password comparison
- apiKeyRef masking in API responses

### Prompt Templates
6 preset templates (Feature, Bug Fix, Refactor, Docs, Performance, Custom) — one-click fill goal and scope fields.

## Usage Flow

```text
Dashboard Quick Plan → Generate Prompt → ChatGPT Plans → Parse Response
    → Auto-create Tasks → Kanban Board → Execute with Codex → Record Results
```

See [docs/17_USER_GUIDE_V2.md](docs/17_USER_GUIDE_V2.md) for the full bilingual step-by-step guide.

## Docker Deployment

```bash
docker compose up -d --build
```

Default host port: `3121`

Persistence: SQLite database mounted at `./docker-data/ai-devos.db`

### Deploy to Production

```bash
ssh root@your-server
cd /srv/apps/ai-devos
git pull origin codex/ai-devos-1.2
AI_DEVOS_ADMIN_PASSWORD=your-password docker compose up -d --build
```

### Backup & Restore

```bash
# Backup
cp docker-data/ai-devos.db docker-data/ai-devos.db.$(date +%Y%m%d-%H%M).bak

# Restore
docker compose down
cp docker-data/ai-devos.db.BACKUP docker-data/ai-devos.db
docker compose up -d
```

## Scripts

```bash
npm run dev          # Start dev server
npm run verify       # Lint + production build (runs before every git push)
npm run db:push      # Initialize SQLite schema
npm run db:seed      # Seed demo data
npm run docker:up    # Docker Compose up with build
npm run docker:logs  # Follow Docker logs
```

## Versions

| Version | Highlights |
|---|---|
| `v1.0.0` | MVP: Project/Task/Prompt management, REST APIs |
| `v1.1.0` | ChatGPT/Codex binding, task templates, Codex prompt generator |
| `v1.2.0` | Auth gate, task detail/edit, copy prompt, deployment records, settings UI |
| `v1.3.0` | Auto-pipeline (ChatGPT+Codex), Kanban board, Dashboard charts, prompt templates, security hardening |

## API Reference

All endpoints protected by session cookie auth.

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/projects` | List projects |
| PATCH | `/api/projects/[id]` | Update project |
| DELETE | `/api/projects/[id]` | Delete project |
| GET/POST | `/api/tasks` | List/Create tasks |
| PATCH | `/api/tasks/[id]` | Update task |
| PATCH | `/api/tasks/[id]/status` | Update task status |
| POST | `/api/codex/plan` | Auto-plan with Codex |
| POST | `/api/codex/parse-chatgpt` | Parse ChatGPT output → tasks |
| POST | `/api/codex/execute/[id]` | Execute task with Codex |
| GET | `/api/deployments` | List deployment records |
| GET/POST/PATCH | `/api/agent-configs` | Agent config CRUD |

## Architecture

```
┌─────────┐     ┌──────────┐     ┌───────┐
│ ChatGPT │────▶│AI DevOS  │────▶│ Codex │
│ (Plan)  │     │(Pipeline)│     │(Exec) │
└─────────┘     └──────────┘     └───────┘
                     │
              ┌──────▼──────┐
              │   SQLite    │
              │ (Persistence)│
              └─────────────┘
```

## Notes

- API keys are NEVER stored in the database — only reference names
- `npm run verify` runs automatically before every `git push` via pre-push hook
- The `codex exec` CLI integration works on macOS where Codex Desktop is installed
- For the Singapore production server, the admin password is injected via environment variable
