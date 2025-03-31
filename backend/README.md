# BudgetBuilders API

Backend for a marketplace that connects customers directly with builders and
workers. A customer posts a construction job with an offered price, builders
bid on it, and the customer awards the work to one of them.

## Stack

Node 22, Express 4, Sequelize 6 on PostgreSQL, Redis for rate limiting, Vitest
and Supertest for tests.

## Running locally

The whole stack, including Postgres, Redis and migrations:

```bash
cp backend/.env.example backend/.env   # then set the two secrets
docker compose up --build
```

Or against your own database:

```bash
cd backend
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

Generate the JWT secrets with `openssl rand -hex 32`. The API refuses to start
if any required variable is missing or malformed.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start with file watching |
| `npm start` | Start without watching |
| `npm test` | Run the test suite |
| `npm run test:watch` | Re-run tests on change |
| `npm run lint` | Lint `src` |
| `npm run format` | Format `src` with Prettier |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:migrate:down` | Revert the last migration |

Tests need a Postgres instance. Point `TEST_DATABASE_URL` at a throwaway
database; the suite truncates every table between tests.

To run a single file or test:

```bash
npx vitest run tests/auth.test.js
npx vitest run -t "rotates the refresh token"
```

## Authentication

Login is by email and a one-time code, so there are no passwords to store or
leak. Requesting a code returns the same response whether or not the address
has an account, which stops the endpoint being used to discover who is
registered.

1. `POST /api/auth/otp/request` with `{ email, role }` mails a code. The role
   is only used if this is a new account.
2. `POST /api/auth/otp/verify` with `{ email, otp }` returns an access token
   and a refresh token, creating the account on first use.

Codes are stored only as bcrypt hashes, expire after `OTP_TTL_MINUTES`, and are
invalidated once used or after `OTP_MAX_ATTEMPTS` wrong guesses.

Access tokens are short lived. Refresh tokens are stored one row per session as
a SHA-256 hash and rotate on every use, so a stolen refresh token works at most
once and `logout-all` can end every session.

With `MAIL_TRANSPORT=console` the code is written to the log instead of being
emailed, which is enough to sign in during local development.

## API

All routes below sit under `/api` and need `Authorization: Bearer <token>`
unless stated otherwise.

### Auth

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/auth/otp/request` | Public. Rate limited per email address |
| POST | `/auth/otp/verify` | Public. Returns tokens |
| POST | `/auth/refresh` | Rotates the refresh token |
| POST | `/auth/logout` | Revokes the presented refresh token |
| POST | `/auth/logout-all` | Ends every session for the account |
| GET | `/auth/me` | The signed-in account |

### Orders (customer)

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/orders` | Create an order with its sub-orders |
| GET | `/orders` | The caller's own orders |
| GET | `/orders/:id` | Owner reads their order; builders may read open ones |
| PATCH | `/orders/:id` | Change price while pending, or cancel |
| DELETE | `/orders/:id` | Soft delete; not allowed once awarded |
| GET | `/orders/open` | Builder-only feed of orders accepting bids |

### Bids

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/bids` | Builder places or revises a bid |
| GET | `/bids/mine` | The builder's own bids |
| DELETE | `/bids/:id` | Withdraw a pending bid |
| GET | `/bids/order/:orderId` | Bids on an order the caller owns |
| POST | `/bids/:id/accept` | Award the job |

Accepting a bid marks the order accepted at the bid price and rejects every
competing bid in a single transaction, so an order cannot end up with two
winning bids.

### Profiles

| Method | Path | Notes |
| --- | --- | --- |
| POST/GET/PATCH/DELETE | `/customers/me` | The caller's customer profile |
| POST/GET/PATCH | `/builders/me` | The caller's builder profile |
| GET | `/builders` | Public directory, ranked by rating |
| GET | `/builders/:id` | One builder's public details |

The directory omits phone numbers and GST numbers. Ratings are earned from
completed work and cannot be set through the profile endpoint.

### Health

`GET /health` reports liveness. `GET /health/ready` also checks the database
and returns 503 when it is unreachable.

## Authorization model

Every record is reached through the signed-in account rather than by trusting
an id in the request. A customer can only see and change their own orders and
profile; a builder bids as themselves, because the builder is resolved from the
session and a `builder_id` in the body is ignored. Requests for records
belonging to someone else return 404 rather than 403, since confirming that an
id exists is itself a leak.

## Errors

Failures share one shape:

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "A valid email address is required" }]
}
```

Zod, Sequelize and JWT errors are all translated into it. In production the
reason behind a 500 is logged but never returned.
