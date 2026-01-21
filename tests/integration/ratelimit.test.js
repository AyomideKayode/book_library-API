import request from 'supertest';
import app from '../../src/app.js';
import { connect, close, clear } from '../setup.js';

describe('Rate Limiting Integration Tests', () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clear();
  });

  afterAll(async () => {
    await close();
  });

  describe('POST /api/users Rate Limit', () => {
    it('should block requests after exceeding the limit', async () => {
        // The limit is 5 requests per 15 minutes.
        // We'll generate a unique email for each request to avoid 409 Conflict.
        // Note: In a real integration test suite, previous tests might have already
        // consumed some of the rate limit quota if the limiter state is shared.
        // However, express-rate-limit keeps state in memory by default.
        // If Jest tears down the app or module cache between files, state resets.
        // But with --runInBand and ESM, imports are cached.
        // Let's assume we might start with some usage or 0 usage.
        // We will loop until we hit 429 or a reasonable max to avoid infinite loop.

        let limitHit = false;
        const maxAttempts = 10;

        for (let i = 0; i < maxAttempts; i++) {
            const res = await request(app)
                .post('/api/users')
                .send({
                    name: `Rate Limit Tester ${i}`,
                    email: `ratelimit${i}-${Date.now()}@example.com`,
                    phone: `123456789${i}`
                });

            if (res.statusCode === 429) {
                limitHit = true;
                break;
            }
        }

        expect(limitHit).toBe(true);
    });
  });
});
