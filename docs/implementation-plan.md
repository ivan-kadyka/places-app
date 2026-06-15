# Places App Implementation Plan

## Goal

Build a full-stack **places + weather + activity scoring app** in a Turborepo monorepo with **REST + GraphQL APIs**, PostgreSQL (Prisma), and a Next.js frontend.

---

## Context

- **Monorepo:** Turborepo + pnpm
- **Backend:** NestJS (`apps/backend`)
- **Frontend:** Next.js (`apps/frontend`)
- **DB:** PostgreSQL via Prisma
- **Infra:** Docker + docker-compose

---

## Milestones

### 1. Monorepo Setup

- Init Turborepo structure
- Add backend + frontend apps
- Configure scripts (dev, build, lint, test)

**Result:** Working full-stack workspace

---

### 2. Prisma + Database

- Setup Prisma in backend
- Connect PostgreSQL
- Enable migrations + client generation

**Result:** Ready-to-use DB layer with clean, testable persistence architecture

---

### 3. Core Schema Design

- `Place`
- `WeatherDayForecast` (1:N)

Includes:

- coordinates, metadata, timestamps
- daily weather metrics (temp, wind, rain, conditions)
- indexes + constraints
- Introduce **Unit of Work + Repository pattern** for data access abstraction and transaction control

**Result:** Stable core data model

---

### 4. Domain Contracts

Define interfaces:

- `IPlaceService`
- `IWeatherService`
- `IActivityScoreService`
- `IPlaceSearchService`
- `IDBContext`

**Result:** Clean architecture boundaries

---

### 5. AI Draft Implementation

- Generate initial repositories + services
- Implement search, weather, scoring flows
- Add DTO mapping + basic tests

**Result:** First working system draft

---

### 6. Cleanup Pass

- Remove duplication
- Normalize naming
- Fix DI + structure
- Improve errors + validation

**Result:** Improved codebase shape

---

### 7. REST API

- `GET /places/search`
- `GET /places/:id/details`
- Swagger/OpenAPI
- E2E tests

**Result:** Public REST API

---

### 8. GraphQL API

- NestJS GraphQL setup
- Queries for search + details
- Reuse domain services

**Result:** Parallel GraphQL interface

### 9. Cleanup

- Improve naming and structure
- Improve all implementations + validation

**Result:** Production-ready codebase shape

---

### 10. Testing

**Unit:**

- services, scoring, weather, search

**E2E:**

- REST + GraphQL flows
- DB integration cases

**Result:** Reliable test coverage

---

### 11. Docker Setup

- Backend + frontend Dockerfiles
- PostgreSQL service
- docker-compose orchestration

**Result:** One-command full stack

---

### 12. Documentation

- Root README (setup + architecture)
- Backend README (API + Prisma + env)
- Mermaid diagrams:
  - system architecture
  - DB schema
  - API flows

**Result:** Fully self-explanatory repo

### 13. Frontend (Web UI) - \*Extra

- Create simple **Next.js UI** in `apps/frontend`
- Basic functionality:
  - place search box
  - place details view
- Call backend via GraphQL
- Display:
  - place list
  - place activity scores
- Minimal styling (focus on functionality)

---

## Execution Flow

1. Monorepo init
2. Database setup
3. Prisma schema stabilization
4. Domain interfaces
5. Draft implementation
6. Clean up
7. REST API
8. GraphQL API
9. Clean up
10. Tests
11. Docker
12. Docs
13. Web UI

---

## Definition of Done

- `pnpm install` works
- `pnpm build` passes
- `pnpm test` passes
- Full local stack via Docker
- REST + GraphQL both working
- Docs explain everything clearly
