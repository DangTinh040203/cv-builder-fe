# ================================
# Stage 1: Install dependencies
# ================================
FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy all package.json files for workspace packages
COPY apps/web/package.json ./apps/web/
COPY shared/ui/package.json ./shared/ui/
COPY shared/eslint-config/package.json ./shared/eslint-config/
COPY shared/typescript-config/package.json ./shared/typescript-config/

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# ================================
# Stage 2: Build the application
# ================================
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Build the Next.js application via turbo
RUN pnpm run build

# ================================
# Stage 3: Production image
# ================================
FROM node:22-alpine AS production

# Add non-root user for security
RUN addgroup --system --gid 1001 nextjs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app

# Copy standalone output
COPY --from=builder /app/apps/web/.next/standalone ./
# Copy static files
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
# Copy public directory
COPY --from=builder /app/apps/web/public ./apps/web/public

# Set ownership
RUN chown -R nextjs:nextjs /app

USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the Next.js standalone server
CMD ["node", "apps/web/server.js"]
