import request from 'supertest';
import app from '../../src/app.js';
import { connect, close, clear } from '../setup.js';
import { getToken } from '../helpers.js';

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clear();
  });

  afterAll(async () => {
    await close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user and return tokens', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'secure123',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('jane@example.com');
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    it('should fail when email already exists', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'secure123',
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe 2',
          email: 'jane@example.com',
          password: 'other456',
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.code).toBe('EMAIL_EXISTS');
    });

    it('should fail with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: '12345',
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'secure123',
        });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'jane@example.com',
          password: 'secure123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    it('should fail with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'jane@example.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.code).toBe('INVALID_CREDENTIALS');
    });

    it('should fail with unknown email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unknown@example.com',
          password: 'secure123',
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user profile with valid token', async () => {
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'secure123',
        });

      const token = registerRes.body.data.accessToken;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.email).toBe('jane@example.com');
      expect(res.body.data.password).toBeUndefined();
    });

    it('should fail without token', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body.code).toBe('NO_TOKEN');
    });

    it('should fail with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('Token-protected routes', () => {
    it('should reject requests without token on protected endpoints', async () => {
      const res = await request(app).get('/api/books');
      expect(res.statusCode).toBe(401);
      expect(res.body.code).toBe('NO_TOKEN');
    });
  });
});
