import request from 'supertest';
import app from '../../src/app.js';
import { connect, close, clear } from '../setup.js';

describe('User Integration Tests', () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clear();
  });

  afterAll(async () => {
    await close();
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          phone: '1234567890'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('test@example.com');
    });

    it('should fail when email already exists', async () => {
      await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          phone: '1234567890'
        });

      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Another User',
          email: 'test@example.com',
          phone: '1987654321'
        });

      expect(res.statusCode).toBe(409);
    });
  });
});
