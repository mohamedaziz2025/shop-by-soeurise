FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S nodejs && adduser -S -u 1001 -G nodejs nestjs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Ensure uploads folder exists and is writable by the non-root user
RUN mkdir -p /app/uploads && chown -R 1001:1001 /app/uploads

USER nestjs

EXPOSE 4000

CMD ["node", "dist/main"]
