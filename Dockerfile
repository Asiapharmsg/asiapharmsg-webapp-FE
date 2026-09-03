# Next.js 11 bakes the values in next.config.js `env` into the bundle at build
# time, so API_URL etc. must be supplied as build args (see docker-compose.yml).
# Next 11's bundled webpack needs OpenSSL's legacy provider on Node >= 17.
ARG NODE_IMAGE=node:22-alpine

FROM ${NODE_IMAGE} AS deps
WORKDIR /app
ENV NODE_OPTIONS=--openssl-legacy-provider
COPY package.json package-lock.json ./
# Several theme packages still declare React 16 peers; they run fine on 17.
RUN npm ci --legacy-peer-deps --no-audit --no-fund

FROM ${NODE_IMAGE} AS builder
WORKDIR /app
ENV NODE_OPTIONS=--openssl-legacy-provider
ARG PUBLIC_URL=""
ARG API_URL
ARG CAPTCHA_KEY
ARG EMAILJS_SERVICE_ID
ARG EMAILJS_TEMPLATE_ID
ARG EMAILJS_PUBLIC_KEY
ENV PUBLIC_URL=${PUBLIC_URL} \
    API_URL=${API_URL} \
    CAPTCHA_KEY=${CAPTCHA_KEY} \
    EMAILJS_SERVICE_ID=${EMAILJS_SERVICE_ID} \
    EMAILJS_TEMPLATE_ID=${EMAILJS_TEMPLATE_ID} \
    EMAILJS_PUBLIC_KEY=${EMAILJS_PUBLIC_KEY}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN test -n "$API_URL" || (echo "API_URL build arg is required" && exit 1) \
 && npm run build

FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV PORT=3000

COPY --from=builder --chown=node:node /app/next.config.js ./next.config.js
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/ || exit 1

CMD ["npm", "start"]
