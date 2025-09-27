# Multi-stage build for production-ready backend
FROM node:18-alpine AS base

# Install dependencies for PostgreSQL client (skip if offline)
RUN apk add --no-cache postgresql-client || echo "Skipping postgresql-client install due to network issues"

WORKDIR /app

# Dependencies stage - only copy package files for better caching
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

# Build stage - install all dependencies and build the application
FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage - minimal image with only necessary files
FROM base AS production

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Copy package files
COPY package*.json ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001
USER backend

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

EXPOSE 3001

# Start the application
CMD ["npm", "start"]
