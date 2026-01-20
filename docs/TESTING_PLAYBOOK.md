# Phase 1: Testing Playbook

This document serves as the definitive guide for testing the Book Library API. It explains our testing strategy, tool choices, and common debugging workflows.

## 1. Testing Stack & Rationale

We have chosen a "Integration-First" strategy for Phase 1 to lock in the behavior of the existing codebase without modifying business logic.

| Tool | Purpose | Why this choice? |
| :--- | :--- | :--- |
| **Jest** | Test Runner & Assertion Library | Industry standard, zero-config, parallel execution, built-in code coverage. |
| **Supertest** | HTTP Assertions | Allows testing Express routes directly without spinning up a real network server. |
| **Mongo Memory Server** | Database Mock | Runs a real MongoDB instance in RAM. Ensures tests are isolated, fast, and do not require a local DB installation. |
| **Cross-Env** | Environment Management | Ensures test scripts run consistently across Windows, macOS, and Linux. |

## 2. The In-Memory Database Architecture

We use `mongodb-memory-server` in **Replica Set** mode.

### Why Replica Set?
The application uses Mongoose Transactions (`session.startTransaction()`) for critical flows like `borrowBook` and `returnBook`. MongoDB transactions **require** a replica set configuration. A standalone instance will cause these operations to fail.

### How it works
1.  **Setup (`tests/setup.js`)**: Before tests run, we spin up a new `MongoMemoryReplSet`.
2.  **Connect**: Mongoose connects to this ephemeral URI.
3.  **Teardown**: After tests finish, we drop the database and stop the instance.

**Note:** The database state is wiped clean between test files (if configured) or you must manually clean it in `afterEach`. Our `tests/setup.js` provides a `clear()` function for this purpose.

## 3. Developer Guide

### Installation
New developers can get started immediately:

```bash
npm install
```

### Running Tests
| Command | Description |
| :--- | :--- |
| `npm test` | Run all tests once. |
| `npm run test:watch` | Run tests in watch mode (reruns on save). |
| `npm run test:coverage` | Generate a coverage report in `coverage/`. |

### Writing a New Integration Test
1.  Create a file in `tests/integration/` (e.g., `myFeature.test.js`).
2.  Import the necessary helpers:
    ```javascript
    import request from 'supertest';
    import app from '../../src/app.js';
    import { connect, close, clear } from '../setup.js';
    ```
3.  Use the standard lifecycle hooks:
    ```javascript
    describe('My Feature', () => {
      beforeAll(async () => { await connect(); });
      afterEach(async () => { await clear(); });
      afterAll(async () => { await close(); });

      it('should work', async () => {
        const res = await request(app).get('/api/resource');
        expect(res.statusCode).toBe(200);
      });
    });
    ```

## 4. Debugging & Common Failures

### Issue: "Jest is not defined"
**Cause:** The project uses ESM (`"type": "module"`). Jest globals are sometimes not injected automatically in experimental VM modules mode without configuration, or if explicitly needed.
**Solution:** Import `jest` from `@jest/globals` if you need to use spies or mocks.
```javascript
import { jest } from '@jest/globals';
```

### Issue: Tests Hanging
**Cause:** Open handles. Usually caused by not closing the MongoDB connection or stopping the server.
**Solution:** Ensure `await close()` is called in `afterAll`.

### Issue: "Transaction numbers are only allowed on a replica set"
**Cause:** The in-memory server is running as a standalone instance.
**Solution:** Ensure you are using `MongoMemoryReplSet` in `tests/setup.js`, not `MongoMemoryServer`.

### Issue: Validation Errors (400) instead of Logic Errors
**Cause:** Mongoose schema validation or Express Validator middleware catches invalid input before your business logic runs.
**Solution:** Check `console.error` output. Our error handler logs validation details. Ensure your test payloads match the schema requirements (e.g., valid ISBN formats, required dates).

## 5. Phase 1 Report
*   **Coverage:** focused on `BorrowService`, `BookService`, and `UserService`.
*   **Critical Flows:** Borrowing and Returning logic is now protected by integration tests.
*   **Unit Tests:** Fine calculation logic is isolated and verified.
