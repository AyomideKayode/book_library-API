import { connect, close, clear } from '../setup.js';
import BorrowRecord from '../../src/models/BorrowRecord.js';
import mongoose from 'mongoose';

describe('Fine Calculation Logic', () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clear();
  });

  afterAll(async () => {
    await close();
  });

  test('should return 0 fine for books returned on time', async () => {
    const record = new BorrowRecord({
        userId: new mongoose.Types.ObjectId(),
        bookId: new mongoose.Types.ObjectId(),
        borrowDate: new Date(),
        dueDate: new Date(Date.now() + 10000), // Due in future
        status: 'active'
    });

    expect(record.daysOverdue).toBe(0);
    expect(record.calculatedFine).toBe(0);
  });

  test('should calculate correct fine for 1 day overdue', async () => {
    // 12 hours late -> 0.5 days -> ceil is 1 day
    const dueDate = new Date(Date.now() - (12 * 60 * 60 * 1000));

    const record = new BorrowRecord({
        userId: new mongoose.Types.ObjectId(),
        bookId: new mongoose.Types.ObjectId(),
        borrowDate: new Date(Date.now() - (24 * 60 * 60 * 1000)), // borrowed yesterday
        dueDate: dueDate,
        status: 'active'
    });

    expect(record.daysOverdue).toBe(1);
    expect(record.calculatedFine).toBe(50);
  });

  test('should calculate correct fine for 10 days overdue', async () => {
    // 9.5 days late -> ceil is 10 days
    const dueDate = new Date(Date.now() - (9 * 24 * 60 * 60 * 1000) - (12 * 60 * 60 * 1000));

    const record = new BorrowRecord({
        userId: new mongoose.Types.ObjectId(),
        bookId: new mongoose.Types.ObjectId(),
        borrowDate: new Date(Date.now() - (20 * 24 * 60 * 60 * 1000)),
        dueDate: dueDate,
        status: 'active'
    });

    expect(record.daysOverdue).toBe(10);
    expect(record.calculatedFine).toBe(500); // 10 * 50
  });

  test('should cap fine at 5000', async () => {
    // 199.5 days late -> ceil is 200 days
    const dueDate = new Date(Date.now() - (199 * 24 * 60 * 60 * 1000) - (12 * 60 * 60 * 1000));

    const record = new BorrowRecord({
        userId: new mongoose.Types.ObjectId(),
        bookId: new mongoose.Types.ObjectId(),
        borrowDate: new Date(Date.now() - (210 * 24 * 60 * 60 * 1000)),
        dueDate: dueDate,
        status: 'active'
    });

    // 200 days * 50 = 10000, but cap is 5000
    expect(record.daysOverdue).toBe(200);
    expect(record.calculatedFine).toBe(5000);
  });
});
