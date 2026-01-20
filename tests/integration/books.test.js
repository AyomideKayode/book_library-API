import request from 'supertest';
import app from '../../src/app.js';
import { connect, close, clear } from '../setup.js';
import Author from '../../src/models/Author.js';

describe('Books Integration Tests', () => {
  let authorId;

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
    // Create an author first
    const author = await Author.create({
      name: 'Test Author',
      email: 'author@example.com'
    });
    authorId = author._id;
  });

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const res = await request(app)
        .post('/api/books')
        .send({
          title: 'Test Book',
          authorId: authorId,
          isbn: '978-0-7432-7356-5',
          genre: 'Fiction',
          available: true,
          publicationDate: new Date().toISOString()
        });

      if (res.statusCode !== 201) {
          console.error('Create Book Error:', JSON.stringify(res.body, null, 2));
      }

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Test Book');
    });
  });

  describe('GET /api/books', () => {
    it('should return list of books', async () => {
        // Create a book first
        await request(app)
        .post('/api/books')
        .send({
          title: 'Test Book',
          authorId: authorId,
          isbn: '978-0-7432-7356-5',
          genre: 'Fiction',
          available: true,
          publicationDate: new Date().toISOString()
        });

      const res = await request(app).get('/api/books');
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });
});
