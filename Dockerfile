# Next.js 11 uses webpack 4, whose hashing breaks on Node >=17 because OpenSSL 3
# dropped the legacy digest it relies on (ERR_OSSL_EVP_UNSUPPORTED). Node 18 +
# --openssl-legacy-provider keeps a maintained base image while avoiding that.
FROM node:18-alpine AS deps
WORKDIR /app
ENV NODE_OPTIONS=--openssl-legacy-provider
COPY package.json package-lock.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
ENV NODE_OPTIONS=--openssl-legacy-provider
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NODE_OPTIONS=--openssl-legacy-provider

COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# `next start` reads PORT itself; the host reverse proxy maps
# asiapharmsg.com (80/443) to this port on the container.
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
