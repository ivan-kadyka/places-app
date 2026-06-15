# Weather App Backend

NestJS API for place search, weather forecasts, and outdoor activity scoring. It uses PostgreSQL through Prisma and fetches weather/place data from Open-Meteo.

## From The Root README

Back to the [root README](../../README.md).

## Requirements

- Node.js 18+
- pnpm 9
- PostgreSQL, or the Docker Compose stack from the repository root

## Environment

Create a local environment file:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Default local values:

```bash
DATABASE_URL="postgresql://weather:weather@localhost:5432/weather_app?schema=public"
PORT=8000
WEATHER_CACHE_TTL_HOURS=6
```

## Run With Docker Compose

From the repository root, start the full stack:

```bash
docker compose -f 'docker-compose.yml' up -d --build
```

The backend runs at `http://localhost:8000`.

Useful URLs:

- Swagger docs: `http://localhost:8000/api`
- GraphQL playground: `http://localhost:8000/graphql`
- Prisma Studio: `http://localhost:5555`

## Run Locally

From the repository root, install dependencies:

```bash
pnpm install
```

Start PostgreSQL first. You can use the root Docker Compose stack, or provide your own PostgreSQL instance that matches `DATABASE_URL`.

Generate Prisma client and run migrations:

```bash
pnpm --filter backend db:generate
pnpm --filter backend db:migrate
```

Run the backend in development mode:

```bash
pnpm --filter backend dev
```

Build:

```bash
pnpm --filter backend build
```

Test:

```bash
pnpm --filter backend test
```

## API

REST endpoints:

- `GET /place/search?name={name}&count={count}`
- `GET /place/details?place={name}`

GraphQL queries:

- `searchPlaces(name: String!, count: Int)`
- `getPlaceDetails(name: String!)`

## Scripts

| Command | Description |
| --- | --- |
| `pnpm --filter backend dev` | Start NestJS in watch mode |
| `pnpm --filter backend build` | Generate Prisma artifacts, run deployed migrations, and compile |
| `pnpm --filter backend test` | Run unit tests |
| `pnpm --filter backend test:e2e` | Run e2e tests |
| `pnpm --filter backend db:generate` | Generate Prisma client |
| `pnpm --filter backend db:migrate` | Run Prisma migrations locally |
| `pnpm --filter backend db:push` | Push schema changes without a migration |
