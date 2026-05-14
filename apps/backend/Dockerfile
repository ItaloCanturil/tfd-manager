FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm --filter=backend build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=build /app/apps/backend/dist ./apps/backend/dist
COPY --from=build /app/apps/backend/drizzle.config.ts ./apps/backend/drizzle.config.ts
COPY --from=build /app/apps/backend/drizzle ./apps/backend/drizzle
COPY --from=build /app/apps/backend/package.json ./apps/backend/package.json
WORKDIR /app/apps/backend
EXPOSE 3333
CMD ["node", "dist/main.js"]
