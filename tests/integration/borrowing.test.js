import request from 'supertest';
import app from '../../src/app.js';
import { connect, close, clear } from '../setup.js';
import User from '../../src/models/User.js';
import Book from '../../src/models/Book.js';
import BorrowRecord from '../../src/models/BorrowRecord.js';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';

describe('Borrowing Integration Tests', () => {
  let user, book;

  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clear();
    jest.restoreAllMocks(); // Restore spies
  });

  afterAll(async () => {
    await close();
  });

  beforeEach(async () => {
    // Create User
    user = await User.create({
      name: 'Borrower',
      email: 'borrower@example.com',
      phone: '1234567890'
    });

    // Create Book
    book = await Book.create({
      title: 'Borrowable Book',
      authorId: new mongoose.Types.ObjectId(),
      isbn: '978-0-7432-7356-5',
      genre: 'Fiction',
      available: true,
      publicationDate: new Date()
    });
  });

  describe('POST /api/borrow', () => {
    it('should successfully borrow a book', async () => {
      const res = await request(app)
        .post('/api/borrow')
        .send({
          userId: user._id,
          bookId: book._id
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('active');

      // Verify DB state
      const updatedBook = await Book.findById(book._id);
      expect(updatedBook.available).toBe(false);

      const record = await BorrowRecord.findOne({ userId: user._id, bookId: book._id });
      expect(record).toBeTruthy();
      expect(record.status).toBe('active');
    });

    it('should fail if book is not available', async () => {
      // Make book unavailable
      book.available = false;
      await book.save();

      const res = await request(app)
        .post('/api/borrow')
        .send({
          userId: user._id,
          bookId: book._id
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.code).toBe('BOOK_NOT_AVAILABLE');
    });

    it('should fail if user limit reached', async () => {
      // Mock canBorrow to return false or fill up 5 books
      // Filling up 5 books is safer integration test
      const books = [];
      for (let i = 0; i < 5; i++) {
        const b = await Book.create({
          title: `Book ${i}`,
          authorId: new mongoose.Types.ObjectId(),
          isbn: `978-0-00-00000${i}-0`,
          genre: 'Fiction',
          available: true,
          publicationDate: new Date()
        });
        books.push(b);

        await request(app)
            .post('/api/borrow')
            .send({ userId: user._id, bookId: b._id });
      }

      // Try 6th book
      const res = await request(app)
        .post('/api/borrow')
        .send({
          userId: user._id,
          bookId: book._id
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.code).toBe('BORROW_LIMIT_REACHED');
    });

    it('should rollback transaction if book update fails', async () => {
      // Spy on Book.findByIdAndUpdate to throw error
      // Note: borrowService uses Book.findByIdAndUpdate(id, { available: false }, { session })
      const error = new Error('Simulated DB Error');
      jest.spyOn(Book, 'findByIdAndUpdate').mockRejectedValueOnce(error);

      const res = await request(app)
        .post('/api/borrow')
        .send({
          userId: user._id,
          bookId: book._id
        });

      // Should fail with 500 (since we threw a generic error)
      expect(res.statusCode).toBe(500);

      // Verify Rollback
      // BorrowRecord should NOT exist
      const record = await BorrowRecord.findOne({ userId: user._id, bookId: book._id });
      expect(record).toBeNull();

      // Book should still be available
      const currentBook = await Book.findById(book._id);
      expect(currentBook.available).toBe(true);
    });
  });

  describe('POST /api/return', () => {
    it('should successfully return a book', async () => {
      // Borrow first
      const borrowRes = await request(app)
        .post('/api/borrow')
        .send({
          userId: user._id,
          bookId: book._id
        });

      const borrowId = borrowRes.body.data.id || borrowRes.body.data._id;

      const res = await request(app)
        .post('/api/return')
        .send({
          borrowId: borrowId
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('returned');

      // Verify DB
      const updatedBook = await Book.findById(book._id);
      expect(updatedBook.available).toBe(true);

      const record = await BorrowRecord.findById(borrowId);
      expect(record.status).toBe('returned');
      expect(record.returnDate).toBeTruthy();
    });
  });
});
