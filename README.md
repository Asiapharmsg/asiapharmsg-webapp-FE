# Asia Pharm Frontend

Customer-facing storefront for [asiapharmsg.com](https://asiapharmsg.com), built with Next.js 11 (React 17). Talks to the [cust-admin-BE](../cust-admin-BE) API at `api.asiapharmsg.com`.

## Stack

- Next.js 11 / React 17
- Redux + redux-persist for client state
- Bootstrap / react-bootstrap for layout
- Formik + Yup for forms

## Project structure

```
src/
  pages/        Next.js routes
  components/   UI components
  redux/        store, actions, reducers
  middlewares/  redux middleware
  hoc/          higher-order components
  lib/          API client / integrations
  hooks/        custom hooks
  utils/        helpers
  data/         static data
  assets/       styles, images, fonts
```

## Local development

```bash
npm ci --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`next.config.js` is committed and reads its values from environment variables at build time (see `.env.example`). Copy `.env.example` to `.env` and fill in `API_URL` and `CAPTCHA_KEY` before building. Because Next.js bakes these into the bundle, any change needs a rebuild.

## Build

```bash
npm run build
npm start
```

Next.js 11's bundled webpack fails on Node ≥17 due to the OpenSSL 3 legacy-digest removal; set `NODE_OPTIONS=--openssl-legacy-provider` before building/running (the Dockerfile does this). Node 22 is the supported target.

## Docker deployment

```bash
docker compose up -d --build
```

This builds the app with the values from `.env` and runs it on `127.0.0.1:3000`. See [Dockerfile](Dockerfile) and [docker-compose.yml](docker-compose.yml).

`asiapharmsg.com` is served by the Caddy instance installed natively on the EC2 host (`/etc/caddy/Caddyfile`), which also serves `api.asiapharmsg.com` and `db.asiapharmsg.com`. The site block for this app is in [Caddyfile.snippet](Caddyfile.snippet); add it to that file and `sudo systemctl reload caddy`.
