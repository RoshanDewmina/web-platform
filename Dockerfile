# Build stage
FROM node:20-bookworm-slim AS builder
ENV LIGHTNINGCSS_FORCE_WASM=1
WORKDIR /app
COPY package.json package-lock.json* bun.lock* ./
COPY prisma ./prisma
RUN npm install --legacy-peer-deps
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1 \
    LIGHTNINGCSS_FORCE_SYSTEM=1 \
    LIGHTNINGCSS_FORCE_WASM=1
RUN npm run build

# Runtime stage
FROM node:20-bookworm-slim AS runner
# Install OpenSSL, PostgreSQL client and required libraries
RUN apt-get update -y && \
    apt-get install -y openssl libssl3 ca-certificates wget gnupg && \
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - && \
    echo "deb http://apt.postgresql.org/pub/repos/apt/ bookworm-pgdg main" > /etc/apt/sources.list.d/pgdg.list && \
    apt-get update -y && \
    apt-get install -y postgresql-client-16 && \
    rm -rf /var/lib/apt/lists/*
ENV LIGHTNINGCSS_FORCE_WASM=1
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
EXPOSE 3000
CMD ["npm", "start"]


