# Weather App Backend

NestJS API for place search, weather forecasts, and outdoor activity scoring. It uses PostgreSQL through Prisma and fetches weather/place data from Open-Meteo.

## From The Root README

Back to the [root README](../../README.md).

## Requirements

- Node.js 20+
- pnpm 9

Install dependencies from the repository root:

```bash
pnpm install
```

## Environment Setup

Create a `.env` file for the backend application from the example file:

```bash
cp .env.example .env
```

Update `.env` and set the `DATABASE_URL` variable to your PostgreSQL connection string.

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

## API

GraphQL queries:

- `searchPlaces(name: String!, count: Int)`
- `getPlaceDetails(name: String!)`

REST endpoints:

- `GET /place/search?name={name}&count={count}`
- `GET /place/details?place={name}`
