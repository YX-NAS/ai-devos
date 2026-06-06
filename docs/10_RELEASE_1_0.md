# AI DevOS 1.0 Release Package

## Release Positioning

AI DevOS `1.0.0` is the first packaged MVP release. It provides a usable AI project operating console for managing projects, requirements, designs, Codex tasks, prompts, reviews, workflows, and Vercel deployment.

## Release Scope

### Product

- Dashboard for global project status
- Project list and project detail views
- New project creation
- Task board grouped by status
- Prompt center
- Agent responsibility center
- Workflow lifecycle view
- Settings placeholder
- Bilingual detailed user guide

### Engineering

- Next.js 15 App Router
- TypeScript
- TailwindCSS
- Prisma Client
- SQLite local setup
- Vercel deployment configuration
- Runtime database bootstrap for MVP cloud demos
- REST APIs for projects, requirements, designs, tasks, prompts, reviews, and workflow events

### Documentation

- README
- Acceptance criteria
- Detailed bilingual user guide
- Release package notes

## Acceptance Result

Validated locally with:

```bash
npm run verify
```

Expected result:

- ESLint passes
- Production build passes
- App routes and API routes compile successfully

## Deployment Status

Cloud deployment is handled through Vercel connected to GitHub.

Important note: the current Vercel MVP uses temporary SQLite storage at `/tmp`. This is acceptable for demos and workflow validation, but not for long-term production data.

## Version Tag

Release tag:

```text
v1.0.0
```

## Known Limitations

- Cloud data is not yet backed by a persistent database.
- Project editing is limited.
- Requirements, designs, tasks, prompts, and reviews do not yet have full CRUD UI coverage.
- ChatGPT and Codex are not yet configured as first-class bound integrations.
- Desktop app packaging is not yet available.

These limitations define the main direction for `1.1.0`.
