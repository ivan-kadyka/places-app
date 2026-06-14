FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9.0.0

# Copy workspace files
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./

# Copy package.json files
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/ ./packages/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy backend source code
COPY apps/backend/ ./apps/backend/

# Build backend
WORKDIR /app/apps/backend
RUN pnpm run db:generate
RUN pnpm run build

FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm@9.0.0

# Copy package.json files again
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/ ./packages/

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built app
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

EXPOSE 8000

WORKDIR /app/apps/backend

CMD ["node", "dist/src/main.js"]
