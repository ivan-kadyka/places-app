FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9.0.0

COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/ ./packages/

RUN pnpm install --frozen-lockfile

COPY apps/backend/ ./apps/backend/

WORKDIR /app/apps/backend
RUN pnpm run db:generate
RUN pnpm run build

# ---

FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm@9.0.0

COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/ ./packages/

RUN pnpm install --prod --frozen-lockfile

# Install prisma into an isolated directory so it doesn't conflict with prod deps
RUN npm install --prefix /prisma-cli prisma@7.8.0

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

WORKDIR /app/apps/backend

COPY --from=builder /app/apps/backend/prisma.config.ts ./prisma.config.ts

EXPOSE 8000

CMD ["sh", "-c", "NODE_PATH=/prisma-cli/node_modules /prisma-cli/node_modules/.bin/prisma migrate deploy --config=./prisma.config.ts && node dist/src/main.js"]