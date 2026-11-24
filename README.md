# Green Cart

A full-stack grocery e-commerce application with a React storefront, an Express REST API, and MongoDB. It covers buyer flows (browse, search, cart, address, orders, COD/Stripe checkout) and seller/shopkeeper flows (register, add products, toggle stock, view orders) with products scoped to their owning seller, plus JWT authentication, Gemini-powered recommendations, Docker Compose, and a GitHub Actions CI pipeline.

> This project started from the [Green Cart tutorial](https://youtu.be/PaQX0pktLnw). The storefront, baseline API, and payment/media integrations come from that tutorial; the additions listed below were implemented on top of it.

## What I added on top of the tutorial

- **Dual JWT authentication** — access + refresh tokens stored in HTTP-only, secure cookies, with a persisted refresh token, a dedicated `/api/v1/user/refresh-token` endpoint, and an Axios interceptor that refreshes once on configured `authRequired` 400 failures and replays the original request. The tutorial used a single JWT.
- **AI product recommendations** — `POST /api/v1/recommendations/get/:userId` uses Gemini with the current cart, the user's last 10 orders, and up to 50 in-stock products. Returned IDs are validated, cart items are excluded, and results are capped at 6.
- **Containerization** — Dockerfiles for both apps plus `docker-compose.yaml` with a shared network and a real `/health` check used by `docker compose up --wait`.
- **CI pipeline** — `.github/workflows/ci.yml` runs ESLint for both packages, scans both images with Trivy for HIGH/CRITICAL vulnerabilities, then builds and smoke-tests the full Compose stack before cleaning up.
- **Multi-seller tenant scoping** — products carry `sellerId`, and seller-only middleware scopes product and order queries to the authenticated shopkeeper's catalog. Buyers shop across sellers; recommendations include seller/shop metadata.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Client | React 19, Vite 8, Tailwind CSS 4, React Router 7, Axios, react-hot-toast |
| Server | Node.js, Express 5, MongoDB, Mongoose, JWT, bcrypt |
| Services | Google Gemini, Stripe Checkout, Cloudinary |
| Tooling | ESLint, Prettier, Docker, Docker Compose, GitHub Actions, Trivy |

## Features

- Customer: product listing, category filtering, search, product details, cart, delivery address, order history, COD and Stripe payment.
- Seller: seller registration/login, product creation with image upload, product list, stock toggle, seller order view.
- Auth: role-based routes (`USER` / `SELLER`, where sellers act as shopkeepers), HTTP-only cookies, bearer token fallback, refresh-token rotation, logout that clears the stored refresh token.
- Recommendations: AI suggestions shown in the cart based on cart contents and order history.
- API conventions: `ApiError`, `ApiResponse`, and `asyncHandler` utilities for consistent response and error shapes.

## Project structure

```text
.
├── client/                  # React + Vite storefront
│   └── src/
│       ├── components/
│       ├── context/         # AppContext: auth, cart, refresh interceptor
│       ├── pages/           # Buyer and seller pages
│       └── config/          # Axios instance
├── server/                  # Express API
│   └── src/
│       ├── controllers/
│       ├── middleware/      # User/seller auth, multer uploads
│       ├── models/
│       ├── routes/
│       ├── utils/           # Tokens, Gemini service, Cloudinary, responses
│       ├── db/              # MongoDB connection
│       ├── constants.js
│       ├── app.js
│       └── server.js
├── .github/workflows/ci.yml
└── docker-compose.yaml
```

## Getting started

### Prerequisites

- Node.js 22 and npm (CI uses Node 22)
- Docker and Docker Compose
- MongoDB connection, Cloudinary account, Gemini API key, and Stripe secret key

### 1. Configure environment files

Environment files are gitignored. `docker-compose.yaml` expects them at `server/.env` and `client/.env`.

`server/.env`:

```dotenv
PORT=8000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-host>
DB_NAME=green-cart
REACT_APP_URL=http://localhost:5173

ACCESS_TOKEN_SECRET=<long-random-string>
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=<different-long-random-string>
REFRESH_TOKEN_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_SECRET=<api-secret>

GEMINI_API_KEY=<gemini-api-key>
GEMINI_MODEL=<gemini-model-name>

STRIPE_SECRET_KEY=<stripe-secret-key>
```

`client/.env`:

```dotenv
VITE_SERVER_URL=http://localhost:8000
VITE_CURRENCY=₹
```

> Cookies are set with `secure: true`, so test authentication on `localhost` or over HTTPS. Plain HTTP on a non-local host may cause browsers to drop cookies.

### 2. Run with Docker

```bash
docker compose up -d --build
docker compose ps
```

- Storefront: `http://localhost:5173`
- API health check: `http://localhost:8000/health`

Stop and remove containers:

```bash
docker compose down -v
```

### 3. Run locally without Docker

```bash
# API
cd server
npm install
npm run server        # nodemon
# or: npm start

# Storefront (in another terminal)
cd client
npm install
npm run dev
```

Useful scripts: `npm run lint` in either package, and `npm run build` / `npm run preview` in `client`.

## API overview

| Area | Endpoints |
| --- | --- |
| Health | `GET /health` |
| User auth | `POST /api/v1/user/register`, `POST /login`, `GET /auth`, `GET /refresh-token`, `GET /logout` |
| Seller auth | `POST /api/v1/seller/register`, `POST /login`, `GET /auth` and `GET /logout` (seller-only) |
| Products | `GET /api/v1/product/list`, `GET /:id`, `POST /add`, `POST /stock`, `GET /seller` |
| Cart & address | `POST /api/v1/cart/update`, `POST /api/v1/address/add`, `GET /api/v1/address/get` |
| Orders | `POST /api/v1/order/cod`, `POST /stripe`, `GET /user`, `GET /seller` |
| Recommendations | `POST /api/v1/recommendations/get/:userId` with `{ "cartItems": ["<productId>"] }` |

Most write and account routes require the `accessToken` cookie or an `Authorization: Bearer <token>` header; seller-only routes also require `role: SELLER`. `/api/v1/user/refresh-token` accepts the refresh token from the `refreshToken` cookie or request body.

## CI

On pushes and pull requests to `main`, the workflow runs:

1. ESLint on `server/` and `client/` using Node 22.
2. Trivy image scans on both Docker images, failing on unfixed HIGH/CRITICAL findings.
3. `docker compose build` followed by `docker compose up -d --wait`, which waits for the API health check.
4. Teardown with `docker compose down -v` and container logs on failure.

The Compose smoke-test job expects GitHub secrets named `SERVER_SECRETS` and `CLIENT_SECRETS` containing the two `.env` files.

## Known limitations

- No automated unit or e2e test suite is configured yet; `npm test` in `server/` is still the npm placeholder.
- The client Docker image runs the Vite dev server rather than serving a production `build`.
- Recommendations require valid cart items; invalid input returns 400, while Gemini/upstream failures return 500.
- Stripe checkout session creation has no webhook/payment-confirmation handler, so online orders can remain unconfirmed unless updated externally; success/cancel URLs are derived from the request origin.
- The current role enum is `USER` and `SELLER`; there is no separate `ADMIN` or `SHOPKEEPER` role in this checkout — sellers act as shopkeepers.
- Auth cookies set `httpOnly` and `secure` but no explicit `sameSite` attribute, and no custom Express error-handling middleware is registered.

## Credit

Tutorial: [Green Cart full-stack project](https://youtu.be/PaQX0pktLnw).
