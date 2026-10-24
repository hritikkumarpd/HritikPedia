# =========================================================================
# Multi-stage Production Dockerfile for Hritikpedia Monorepo
# Builds and runs both web platform and admin console
# =========================================================================

FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/admin/package.json ./apps/admin/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci

# Build applications
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/apps/admin/node_modules ./apps/admin/node_modules
COPY . .

ENV NODE_ENV=production
RUN npm run build

# Production runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV ADMIN_PORT=3001

COPY --from=builder /app ./

EXPOSE 3000 3001

CMD ["npm", "start"]
