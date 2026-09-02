# Asia Pharm Frontend

Customer-facing storefront for [asiapharmsg.com](https://asiapharmsg.com), built with Next.js 11 (React 17). Talks to the [cust-admin-BE](../cust-admin-BE) API at `api.asiapharmsg.com`.

## Stack

- Next.js 11 / React 13
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
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

`next.config.js` is gitignored and holds environment-specific values (API URL, reCAPTCHA key, EmailJS credentials) — copy it from another environment or another team member before running the app for the first time.

## Build

```bash
yarn build
yarn start
```

Next.js 11 uses webpack 4, which fails to build on Node ≥17 due to the OpenSSL 3 legacy-digest removal. Either use Node 16, or set `NODE_OPTIONS=--openssl-legacy-provider` before building/running on a newer Node version.

## Docker deployment

```bash
docker compose up -d --build
```

This builds the app and runs it on port `3000` inside the `ap_net` Docker network (not published to the host directly). See [Dockerfile](Dockerfile) and [docker-compose.yml](docker-compose.yml).

`asiapharmsg.com` is fronted by the Caddy reverse proxy defined in the `cust-admin-BE` repo, which also serves `api.asiapharmsg.com` — both domains share one Caddy instance since only one process can bind host ports 80/443. The site block for this app is in [Caddyfile.snippet](Caddyfile.snippet); it must be merged into that shared `Caddyfile`, and the `ap_net` network must exist before either stack starts (`docker network create ap_net` if neither compose project has created it yet).
