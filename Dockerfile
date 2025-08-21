# Build stage
FROM node:20-bookworm-slim AS builder
ENV LIGHTNINGCSS_FORCE_WASM=1
WORKDIR /app
COPY package.json package-lock.json* bun.lock* ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1 \
    LIGHTNINGCSS_FORCE_SYSTEM=1 \
    LIGHTNINGCSS_FORCE_WASM=1
RUN npm run build

# Runtime stage
FROM node:20-bookworm-slim AS runner
ENV LIGHTNINGCSS_FORCE_WASM=1
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["npm", "start"]


