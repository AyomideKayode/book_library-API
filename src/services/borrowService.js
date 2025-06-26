import BorrowRecord from '../models/BorrowRecord.js';
import BookService from './bookService.js';
import UserService from './userService.js';

class BorrowService {
  constructor() {
    this.borrowRecords = new Map();
  }

  async findAll(filters = {}) {
    let records = Array.from(this.borrowRecords.values());

    // Apply filters
    if (filters.userId) {
      records = records.filter((record) => record.userId === filters.userId);
    }

    if (filters.bookId) {
      records = records.filter((record) => record.bookId === filters.bookId);
    }

    if (filters.status) {
      records = records.filter((record) => record.status === filters.status);
    }

    // Check for overdue records and update status
    const now = new Date();
    records.forEach((record) => {
      if (record.status === 'active' && new Date(record.dueDate) < now) {
        record.markOverdue();
        this.borrowRecords.set(record.id, record);
      }
    });

    // Sort
    if (filters.sort) {
      const sortField = filters.sort.startsWith('-')
        ? filters.sort.slice(1)
        : filters.sort;
      const sortOrder = filters.sort.startsWith('-') ? -1 : 1;

      records.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1 * sortOrder;
        if (a[sortField] > b[sortField]) return 1 * sortOrder;
        return 0;
      });
    } else {
      // Default sort by borrow date (newest first)
      records.sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate));
    }

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedRecords = records.slice(startIndex, endIndex);

    return {
      borrowRecords: paginatedRecords,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(records.length / limit),
        totalItems: records.length,
        itemsPerPage: limit,
        hasNext: endIndex < records.length,
        hasPrev: page > 1,
      },
    };
  }

  async findById(id) {
    return this.borrowRecords.get(id) || null;
  }

  async findActiveByUserAndBook(userId, bookId) {
    for (const record of this.borrowRecords.values()) {
      if (
        record.userId === userId &&
        record.bookId === bookId &&
        record.status === 'active'
      ) {
        return record;
      }
    }
    return null;
  }

  async borrowBook(borrowData) {
    // Validate user exists
    const user = await UserService.findById(borrowData.userId);
    if (!user) {
      throw {
        statusCode: 404,
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      };
    }

    // Validate book exists
    const book = await BookService.findById(borrowData.bookId);
    if (!book) {
      throw {
        statusCode: 404,
        message: 'Book not found',
        code: 'BOOK_NOT_FOUND',
      };
    }

    // Check if book is available
    if (!book.available) {
      throw {
        statusCode: 400,
        message: 'Book is not available for borrowing',
        code: 'BOOK_NOT_AVAILABLE',
      };
    }

    // Check if user already has this book borrowed
    const existingBorrow = await this.findActiveByUserAndBook(
      borrowData.userId,
      borrowData.bookId
    );
    if (existingBorrow) {
      throw {
        statusCode: 400,
        message: 'User has already borrowed this book',
        code: 'ALREADY_BORROWED',
      };
    }

    // Create borrow record
    const borrowRecord = new BorrowRecord(
      borrowData.userId,
      borrowData.bookId,
      borrowData.dueDate
    );

    // Update book availability
    await BookService.updateAvailability(borrowData.bookId, false);

    this.borrowRecords.set(borrowRecord.id, borrowRecord);
    return borrowRecord;
  }

  async returnBook(borrowId) {
    const borrowRecord = this.borrowRecords.get(borrowId);
    if (!borrowRecord) {
      throw {
        statusCode: 404,
        message: 'Borrow record not found',
        code: 'BORROW_NOT_FOUND',
      };
    }

    if (borrowRecord.status === 'returned') {
      throw {
        statusCode: 400,
        message: 'Book has already been returned',
        code: 'ALREADY_RETURNED',
      };
    }

    // Mark as returned
    borrowRecord.returnBook();

    // Update book availability
    await BookService.updateAvailability(borrowRecord.bookId, true);

    this.borrowRecords.set(borrowId, borrowRecord);
    return borrowRecord;
  }

  async extendDueDate(borrowId, newDueDate) {
    const borrowRecord = this.borrowRecords.get(borrowId);
    if (!borrowRecord) {
      throw {
        statusCode: 404,
        message: 'Borrow record not found',
        code: 'BORROW_NOT_FOUND',
      };
    }

    if (borrowRecord.status === 'returned') {
      throw {
        statusCode: 400,
        message: 'Cannot extend due date for returned book',
        code: 'BOOK_RETURNED',
      };
    }

    if (new Date(newDueDate) <= new Date()) {
      throw {
        statusCode: 400,
        message: 'New due date must be in the future',
        code: 'INVALID_DUE_DATE',
      };
    }

    borrowRecord.update({ dueDate: newDueDate });
    if (borrowRecord.status === 'overdue' && !borrowRecord.isOverdue()) {
      borrowRecord.update({ status: 'active' });
    }

    this.borrowRecords.set(borrowId, borrowRecord);
    return borrowRecord;
  }

  async getUserBorrowHistory(userId) {
    const userRecords = Array.from(this.borrowRecords.values())
      .filter((record) => record.userId === userId)
      .sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate));

    return userRecords;
  }

  async getBookBorrowHistory(bookId) {
    const bookRecords = Array.from(this.borrowRecords.values())
      .filter((record) => record.bookId === bookId)
      .sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate));

    return bookRecords;
  }

  async getOverdueBooks() {
    const now = new Date();
    const overdueRecords = [];

    for (const record of this.borrowRecords.values()) {
      if (record.status === 'active' && new Date(record.dueDate) < now) {
        record.markOverdue();
        this.borrowRecords.set(record.id, record);
        overdueRecords.push(record);
      }
    }

    return overdueRecords;
  }

  async getStats() {
    const records = Array.from(this.borrowRecords.values());
    const activeRecords = records.filter(
      (record) => record.status === 'active'
    );
    const returnedRecords = records.filter(
      (record) => record.status === 'returned'
    );
    const overdueRecords = records.filter(
      (record) => record.status === 'overdue'
    );

    return {
      totalBorrows: records.length,
      activeBorrows: activeRecords.length,
      returnedBorrows: returnedRecords.length,
      overdueBorrows: overdueRecords.length,
    };
  }
}

export default new BorrowService();
