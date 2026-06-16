# ─── Stage 1: deps ────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/ ./packages/

RUN pnpm install --frozen-lockfile

# ─── Stage 2: builder ─────────────────────────────────────────────────────────
FROM deps AS builder

COPY apps/backend/ ./apps/backend/

WORKDIR /app/apps/backend

# Step 3 from article: generate prisma client at build time (no DB needed)
RUN pnpm run db:generate

# Step 4: build the app
RUN pnpm run build

# ─── Stage 3: runner ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache tini

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/ ./packages/

RUN pnpm install --frozen-lockfile --prod

# Copy build output and prisma schema from builder
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=builder /app/apps/backend/prisma.config.ts ./apps/backend/prisma.config.ts

WORKDIR /app/apps/backend

EXPOSE 8000

# Step 5 from article: migrate deploy + start via a single npm script, not shell &&
CMD ["node", "dist/src/main.js"]