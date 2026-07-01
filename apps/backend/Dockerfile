FROM node:20-alpine AS deps

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/ ./packages/

RUN pnpm install --frozen-lockfile --filter backend...

FROM deps AS builder

COPY apps/backend/ ./apps/backend/

WORKDIR /app/apps/backend

RUN pnpm run db:generate
RUN pnpm run build

FROM node:20-alpine AS runner

RUN apk add --no-cache tini

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/ ./packages/

RUN pnpm install --frozen-lockfile --prod --filter backend...

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma/migrations ./apps/backend/prisma/migrations
COPY --from=builder /app/apps/backend/prisma/schema.prisma ./apps/backend/prisma/schema.prisma
COPY --from=builder /app/apps/backend/prisma.config.ts ./apps/backend/prisma.config.ts

WORKDIR /app/apps/backend

ENV NODE_ENV=production

EXPOSE 8000

ENTRYPOINT ["tini", "--"]
CMD ["pnpm", "run", "start:migrate:prod"]
