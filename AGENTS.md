# AGENTS.md — book-library-API

## Tech

Node.js v18+ · Express · MongoDB + Mongoose · ES Modules (`"type": "module"`)
bcrypt · jsonwebtoken

## Commands

| Command                           | What it does                                                       |
| --------------------------------- | ------------------------------------------------------------------ |
| `npm run dev`                     | Start dev server with nodemon on `PORT` (default 3001)             |
| `npm start`                       | Production start — no dotenv loading, must set env vars externally |
| `npm run migrate && npm run seed` | Init DB: create indexes, then seed sample data                     |
| `npm test`                        | Full test suite (`--testTimeout=30000`) (see quirks below)         |
| `npm run test:watch`              | Watch mode                                                         |
| `npm run test:coverage`           | With coverage report                                               |

**No linter, formatter, or typechecker is configured** — `npm run lint` etc. do not exist.

## Test quirks

- ESM requires `--experimental-vm-modules`. Always use `npm test`, not raw `jest`.
- `--runInBand` is mandatory — parallel tests break because all share a single in-memory DB.
- `mongodb-memory-server` must run in **Replica Set** mode (`MongoMemoryReplSet` in `tests/setup.js`). Standalone mode will fail because `borrowService` uses `mongoose.startSession()` + transactions.
- `--testTimeout=30000` prevents beforeAll timeout when `MongoMemoryReplSet` starts slowly.
- Run a single file: `npm test -- --testPathPatterns=tests/unit/fineCalculation`
- Integration tests use `tests/helpers.js` to create test users + sign JWT tokens.

## Architecture

Unidirectional layered monolith:

```bash
Routes (express-validator rules)
  → Controllers (extract req, call service, send response)
    → Services (business logic, MongoDB transactions)
      → Models (Mongoose schemas, virtuals, pre-save hooks)
```

Swagger UI at `/api-docs` — spec is inline JSDoc in route files (`src/routes/*.js`), assembled by `swagger-jsdoc`.

## Important details

- **DB init order matters**: run `npm run migrate` before `npm run seed`.
- **Seed password env vars**: `SEED_USER_PASSWORD` (default `password123`) and `SEED_ADMIN_PASSWORD` (default `admin123`). Set these in `.env` to override demo credentials. Passwords are hashed via `bcrypt.hashSync()` before `insertMany` — no plaintext reaches the DB.
- **JWT auth** — all endpoints (except `/api/auth/*`, `/health`, `/api-docs`) require a `Bearer <token>` header. Public auth endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`. Protected: `GET /api/auth/me`. Register/login return `{ accessToken, refreshToken }`.
- **Seed users** all have password `"password123"`. An admin user `admin@library.com` / `admin123` is also seeded.
- **Test helpers** — `tests/helpers.js` exports `createUser(overrides)`, `signToken(user)`, `getToken(overrides)` for generating valid JWTs in integration tests.
- **Mongoose virtuals** produce computed fields (`daysOverdue`, `calculatedFine`, `membershipDuration`, `fullAddress`) — these are not stored in the DB.
- **Pre-save hooks** auto-update book `available` when borrow status changes, and auto-generate `libraryCard.number` on user creation.
- **Transaction atomicity**: `borrowBook` / `returnBook` use `startSession() + startTransaction()` to atomically update `BorrowRecord` + `Book`.
- **Health check**: `GET /health`. Shell health checker at `routine-health-check.sh`.
- **No Docker or CI** — `README.md` has an inline Dockerfile example but no actual `Dockerfile` or `.github/workflows/`.
- **No TypeScript** — plain JavaScript with JSDoc comments.
- **JWT env vars required**: `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_EXPIRES_IN` (default `15m`), `JWT_REFRESH_EXPIRES_IN` (default `7d`). Tests auto-set these in `tests/setup.js`.

## Business rules snapshot

| Rule                                          | Where enforced                                               |
| --------------------------------------------- | ------------------------------------------------------------ |
| Unique ISBN, unique author/user email         | Mongoose unique indexes                                      |
| Book must be `available: true` to borrow      | `borrowService.borrowBook()`                                 |
| No duplicate active borrow (same user + book) | `borrowService.findActiveByUserAndBook()`                    |
| Max 5 active books per user                   | `User.methods.canBorrow()`                                   |
| Default 14-day borrow period, max 3 renewals  | `borrowService.borrowBook()`, `BorrowRecord.methods.renew()` |
| Fine: ₦50/day, capped at ₦5,000               | `BorrowRecord.virtual('calculatedFine')`                     |

## Response format

All endpoints return `{ success, data, message }` (or `{ success, error, code, details }` on error).
