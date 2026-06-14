FROM node:20-alpine AS base

WORKDIR /app

RUN npm install -g pnpm@9.0.0

COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY packages/ ./packages/

RUN pnpm install --frozen-lockfile

COPY apps/frontend/ ./apps/frontend/

WORKDIR /app/apps/frontend
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Copy the entire standalone directory
COPY --from=base /app/apps/frontend/.next/standalone ./
# Copy static assets
COPY --from=base /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=base /app/apps/frontend/public ./apps/frontend/public

EXPOSE 3000

ENV HOSTNAME=0.0.0.0

CMD ["node", "apps/frontend/server.js"]
