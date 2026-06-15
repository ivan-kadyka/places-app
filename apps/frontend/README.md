# Weather App Frontend

Next.js frontend for the weather app. It is part of the pnpm/Turborepo workspace and runs on port 3000.

## From The Root README

Back to the [root README](../../README.md).

## Requirements

- Node.js 18+
- pnpm 9

## Run With Docker Compose

From the repository root, start the full stack:

```bash
docker compose -f 'docker-compose.yml' up -d --build
```

Open the frontend at `http://localhost:3000`.

## Run Locally

From the repository root, install dependencies:

```bash
pnpm install
```

Start the frontend in development mode:

```bash
pnpm --filter frontend dev
```

Build:

```bash
pnpm --filter frontend build
```

Start the production build:

```bash
pnpm --filter frontend start
```

Run linting:

```bash
pnpm --filter frontend lint
```

Run type checks:

```bash
pnpm --filter frontend check-types
```

## Workspace Commands

You can also run the common commands from the repository root:

```bash
pnpm dev
pnpm build
pnpm test
```

Note: the frontend package does not currently define its own `test` script, so `pnpm test` runs tests for workspace packages that provide one.
