import request from 'supertest';
import app from '../../src/app.js';
import { connect, close, clear } from '../setup.js';
import { getToken } from '../helpers.js';
import Author from '../../src/models/Author.js';

describe('Books Integration Tests', () => {
  let authorId, token;

  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clear();
  });

  afterAll(async () => {
    await close();
  });

  beforeEach(async () => {
    const { token: t } = await getToken();
    token = t;

    const author = await Author.create({
      name: 'Test Author',
      email: 'author@example.com',
    });
    authorId = author._id;
  });

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Book',
          authorId: authorId,
          isbn: '978-0-7432-7356-5',
          genre: 'Fiction',
          available: true,
          publicationDate: new Date().toISOString(),
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Test Book');
    });
  });

  describe('GET /api/books', () => {
    it('should return list of books', async () => {
      await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Book',
          authorId: authorId,
          isbn: '978-0-7432-7356-5',
          genre: 'Fiction',
          available: true,
          publicationDate: new Date().toISOString(),
        });

      const res = await request(app)
        .get('/api/books')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });
});
