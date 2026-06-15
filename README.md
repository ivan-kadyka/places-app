# Weather App

Monorepo for a weather recommendation app. The project contains a NestJS backend, a Next.js frontend, and shared workspace packages managed with pnpm and Turborepo.

## Apps

- [Backend](apps/backend/README.md) - NestJS API, Prisma, PostgreSQL, weather data, place search, and activity scoring.
- [Frontend](apps/frontend/README.md) - Next.js UI served on port 3000.

## Requirements

- Node.js 18+
- pnpm 9
- Docker and Docker Compose, if running the full stack in containers

Install dependencies from the repository root:

```bash
pnpm install
```

## Run With Docker Compose

From the repository root:

```bash
docker compose -f 'docker-compose.yml' up -d --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Swagger docs: `http://localhost:8000/api`
- GraphQL playground: `http://localhost:8000/graphql`
- Prisma Studio: `http://localhost:5555`

Stop the stack:

```bash
docker compose -f 'docker-compose.yml' down
```

## Run Locally

Run commands from the repository root.

Build all apps and packages:

```bash
pnpm build
```

Run all apps in development mode:

```bash
pnpm dev
```

Run tests:

```bash
pnpm test
```

## Useful Commands

Run one app only:

```bash
pnpm --filter backend dev
pnpm --filter frontend dev
```

Build one app only:

```bash
pnpm --filter backend build
pnpm --filter frontend build
```

Run backend tests only:

```bash
pnpm --filter backend test
```
