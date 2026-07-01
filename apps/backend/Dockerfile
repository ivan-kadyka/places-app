# ---------- build ----------
FROM node:20-alpine AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/ ./packages/

RUN pnpm install --frozen-lockfile --filter backend...

COPY apps/backend/ ./apps/backend/

RUN pnpm --filter backend run db:generate \
 && pnpm --filter backend run build

# Produce a self-contained, flat, production-only node_modules (no pnpm store,
# no symlinks, no dev deps) for just the backend package.
RUN pnpm --filter backend deploy --prod /app/out

# The generated Prisma client ships a WASM query compiler for every database.
# This is a Postgres-only service, so drop the unused engines (~56MB).
RUN find /app/out/node_modules/@prisma/client/runtime -type f \
      \( -name '*mysql*' -o -name '*sqlite*' -o -name '*sqlserver*' -o -name '*cockroachdb*' \) \
      -delete

# ---------- runner ----------
FROM node:20-alpine AS runner

RUN apk add --no-cache tini

WORKDIR /app/apps/backend

ENV NODE_ENV=production

COPY --from=build /app/out/node_modules ./node_modules
COPY --from=build /app/out/package.json ./package.json
COPY --from=build /app/apps/backend/dist ./dist
COPY --from=build /app/apps/backend/prisma ./prisma
COPY --from=build /app/apps/backend/prisma.config.ts ./prisma.config.ts

EXPOSE 8000

ENTRYPOINT ["tini", "--"]
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy --config=./prisma.config.ts && node dist/src/main.js"]
