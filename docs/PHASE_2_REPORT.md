# Phase 2 Completion Report: Authentication & Authorization

## 1. Executive Summary

Phase 2 has been successfully executed. We have implemented a complete JWT-based authentication and role-based authorization system. All API endpoints (except public auth routes, health check, and Swagger UI) are now protected behind authentication. Integration tests have been updated and expanded to cover 21 passing tests.

**Status:** ✅ Complete
**Tests:** 21 Passing (+8 new auth tests)
**Coverage Target:** Auth flows, role enforcement, protected routes.

## 2. Implementation Details

### Auth System Architecture

```
┌─────────────────────────────────────────────────┐
│                Express App                       │
├─────────────────────────────────────────────────┤
│  /api/auth/*  (public — mounted before guard)   │
│    ├── POST /register                           │
│    ├── POST /login                              │
│    └── POST /refresh                            │
├─────────────────────────────────────────────────┤
│  Global authenticate middleware                 │
│  (all /api routes below require Bearer token)   │
├─────────────────────────────────────────────────┤
│  /api/books, /api/authors, /api/users, /api/borrow...  │
│  └── authorize('admin') on admin-only endpoints │
└─────────────────────────────────────────────────┘
```

### Token Design

| Token | Lifetime | Storage | Payload |
|---|---|---|---|
| Access | 15 min (configurable via `JWT_EXPIRES_IN`) | Client-side | `{ userId, role }` |
| Refresh | 7 days (configurable via `JWT_REFRESH_EXPIRES_IN`) | User document (rotated on each refresh) | `{ userId }` |

### Files Created (5)

| File | Purpose |
|---|---|
| `src/middleware/auth.js` | `authenticate` (JWT verification) + `authorize(...roles)` middleware |
| `src/services/authService.js` | Business logic for register, login, refresh token, profile retrieval |
| `src/controllers/authController.js` | Thin HTTP adapter over auth service |
| `src/routes/authRoutes.js` | Route definitions with Swagger JSDoc |
| `tests/helpers.js` | Test utilities: `createUser()`, `signToken()`, `getToken()` |

### Files Modified (9)

| File | Changes |
|---|---|
| `src/models/User.js` | Added `password` (hashed, `select: false`), `role` (`user`/`admin`), `refreshToken` (`select: false`). Pre-save hook hashes on modification. Added `comparePassword()` instance method. |
| `src/middleware/validation.js` | Added `registerValidationRules()` + `loginValidationRules()` for express-validator |
| `src/app.js` | Added `securitySchemes.bearerAuth` and `security: [{ bearerAuth: [] }]` to Swagger. Mounted auth routes before global `authenticate` middleware. Updated Swagger `info.description` with quick-start guide. |
| `scripts/seed.js` | Added `bcrypt.hashSync()` for password hashing before `insertMany`. Admin user `admin@library.com` / `admin123`. Env-var overrides via `SEED_USER_PASSWORD` and `SEED_ADMIN_PASSWORD`. |
| `.env.example` | Added `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `SEED_USER_PASSWORD`, `SEED_ADMIN_PASSWORD` |
| `package.json` | Added `bcrypt` and `jsonwebtoken` to dependencies. Added `--testTimeout=30000` to all test scripts. |
| `tests/setup.js` | Sets `JWT_SECRET` and `JWT_REFRESH_SECRET` for test environment. Pre-creates all collections to stabilize transaction tests. |
| `tests/integration/auth.test.js` | Rewritten to test register, login, duplicate email, profile retrieval, token validation, and protected-route rejection. |
| `tests/integration/books.test.js` | All requests include `Authorization: Bearer {token}`. |
| `tests/integration/borrowing.test.js` | All requests include `Authorization: Bearer {token}`. |

## 3. Key Scenarios Covered

### Auth Endpoints

| Scenario | Status |
|---|---|
| Register new user (201 + tokens) | ✅ Protected |
| Register with duplicate email (409) | ✅ Protected |
| Register with short password (400) | ✅ Protected |
| Login with valid credentials (200 + tokens) | ✅ Protected |
| Login with wrong password (401) | ✅ Protected |
| Login with unknown email (401) | ✅ Protected |
| Get profile with valid token (200) | ✅ Protected |
| Get profile without token (401) | ✅ Protected |
| Get profile with invalid token (401) | ✅ Protected |
| Protected endpoint without token (401) | ✅ Protected |

### Route Protection Matrix

| Scope | Routes | Guard |
|---|---|---|
| **Public** | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `GET /health`, `GET /`, `GET /api-docs` | None |
| **Any authenticated** | All remaining GET/POST endpoints, borrow/return | `authenticate` |
| **Admin only** | DELETE endpoints, PUT endpoints, stats, user search, user creation, borrow records list, overdue list | `authenticate` + `authorize('admin')` |
| **Self or admin** | `GET/PUT /api/users/:id`, user borrow-history, extend due-date | `authenticate` + identity check |

## 4. Risks Mitigated

- **Unauthenticated access:** Every API endpoint now requires a valid JWT, preventing anonymous data access.
- **Password leakage:** Passwords are hashed via bcrypt (10 salt rounds) before storage. The `password` field has `select: false`, so it never appears in query results unless explicitly requested with `.select('+password')`.
- **Plaintext exposure in source:** Seed script hashes passwords via `bcrypt.hashSync()` before database insertion. Plaintext passwords are never committed to the repository — they default to demo values but can be overridden via environment variables.
- **Token forgery:** Access tokens are signed with `JWT_SECRET` (server-side env var, not in repository). Refresh tokens are stored per-user and rotated on each refresh request.
- **Privilege escalation:** Role-based `authorize('admin')` middleware prevents non-admin users from accessing admin-only endpoints, enforced at the route level.

## 5. Technical Debt & Remaining Work

### Debt Resolved
- **Test transaction instability:** Pre-creating all collections in `tests/setup.js` eliminates `WriteConflict` transient errors with single-node replica set transactions.
- **Seed double-hashing bug:** Previously, passwords passed through `insertMany` (which bypasses Mongoose pre-save hooks), so they were stored as plaintext. Now hashed via `bcrypt.hashSync()` before insertion.

### Debt Introduced (Acceptable)
- **No rate limiting.** A production API would need `express-rate-limit` to prevent brute-force login attempts.
- **No refresh token invalidation on password change.** Changing password should invalidate all existing refresh tokens; currently not implemented.
- **No email verification.** Registration is immediate with no confirmation step.

### Untested Areas (Carried Forward from Phase 1)
- **Search & Filtering:** `findAll` methods with complex query params (pagination, sorting) are not fully covered.
- **Admin Features:** `updateUser`, `deleteUser`, `updateBook`, `deleteBook` are not covered by integration tests.
- **Statistics:** `/stats` endpoints are not covered.
- **Authors:** `Author` endpoints are not covered explicitly.

## 6. Seed Credentials

| Role | Email | Password (default) | Override via |
|---|---|---|---|
| User | Any seeded user | `password123` | `SEED_USER_PASSWORD` |
| Admin | `admin@library.com` | `admin123` | `SEED_ADMIN_PASSWORD` |

## 7. Next Steps

- **Phase 3 (Observability & CI):** Replace `morgan` with structured logging (Winston/Pino), add GitHub Actions workflow for automated test runs, add Dockerfile and docker-compose for deployment.
- **Rate limiting:** Protect login and register endpoints from brute-force attacks using `express-rate-limit`.
- **Docker + Deployment:** Containerize the application for platform deployment (Railway, Render, Fly.io).
