# Places App

A full-stack places recommendation application built as a **[Turborepo](https://turbo.build/repo) monorepo** using **TypeScript**.

The project consists of:

- **Backend:** [NestJS](https://nestjs.com/) REST API and GraphQL server running on [Node.js](https://nodejs.org/)
- **Frontend:** [Next.js](https://nextjs.org/) application
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Architecture:** Shared packages and applications managed with [Turborepo](https://turbo.build/repo)

The application analyzes places and weather forecasts and provides activity recommendations based on upcoming conditions.

## Apps

- [Backend](apps/backend/README.md) - NestJS API, Prisma, PostgreSQL, weather data, place search, and activity scoring.
- [Frontend](apps/frontend/README.md) - Next.js UI served on port 3000.

## Requirements

- Node.js 20+
- pnpm 9
- Docker and Docker Compose, if running the full stack in containers

Install dependencies from the repository root:

```bash
pnpm install
```

## Environment Setup

Create a `.env` file for the backend application from the example file:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Update `apps/backend/.env` and set the `DATABASE_URL` variable to your PostgreSQL connection string.

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
