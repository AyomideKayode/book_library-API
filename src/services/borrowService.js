import BorrowRecord from '../models/BorrowRecord.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

class BorrowService {
  async findAll(filters = {}) {
    const query = {};

    // Apply filters
    if (filters.userId && mongoose.Types.ObjectId.isValid(filters.userId)) {
      query.userId = filters.userId;
    }

    if (filters.bookId && mongoose.Types.ObjectId.isValid(filters.bookId)) {
      query.bookId = filters.bookId;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    // Update overdue records first
    await BorrowRecord.updateOverdueRecords();

    // Sorting
    let sort = { borrowDate: -1 }; // Default: newest first
    if (filters.sort) {
      const field = filters.sort.replace('-', '');
      const order = filters.sort.startsWith('-') ? -1 : 1;
      sort = { [field]: order };
    }

    // Pagination
    const page = parseInt(filters.page) > 0 ? parseInt(filters.page) : 1;
    const limit = parseInt(filters.limit) > 0 ? parseInt(filters.limit) : 10;
    const skip = (page - 1) * limit;

    const [borrowRecords, totalItems] = await Promise.all([
      BorrowRecord.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email libraryCard')
        .populate('book', 'title isbn author')
        .lean(),
      BorrowRecord.countDocuments(query),
    ]);

    return {
      borrowRecords,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
        hasNext: skip + borrowRecords.length < totalItems,
        hasPrev: page > 1,
      },
    };
  }

  async findById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return BorrowRecord.findById(id)
      .populate('user', 'name email libraryCard')
      .populate('book', 'title isbn author')
      .lean();
  }

  async findActiveByUserAndBook(userId, bookId) {
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(bookId)
    ) {
      return null;
    }

    return BorrowRecord.findOne({
      userId,
      bookId,
      status: 'active',
    }).lean();
  }

  async borrowBook(borrowData) {
    // Validate user exists and can borrow
    const user = await User.findById(borrowData.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    if (user.status !== 'active') {
      const error = new Error('User account is not active');
      error.statusCode = 400;
      error.code = 'USER_NOT_ACTIVE';
      throw error;
    }

    // Check if user can borrow more books
    const canBorrow = await user.canBorrow();
    if (!canBorrow) {
      const error = new Error('User has reached maximum borrow limit');
      error.statusCode = 400;
      error.code = 'BORROW_LIMIT_REACHED';
      throw error;
    }

    // Validate book exists and is available
    const book = await Book.findById(borrowData.bookId);
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      error.code = 'BOOK_NOT_FOUND';
      throw error;
    }

    if (!book.available) {
      const error = new Error('Book is not available for borrowing');
      error.statusCode = 400;
      error.code = 'BOOK_NOT_AVAILABLE';
      throw error;
    }

    // Check if user already has this book borrowed
    const existingBorrow = await this.findActiveByUserAndBook(
      borrowData.userId,
      borrowData.bookId
    );
    if (existingBorrow) {
      const error = new Error('User has already borrowed this book');
      error.statusCode = 400;
      error.code = 'ALREADY_BORROWED';
      throw error;
    }

    // Create borrow record using transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Set default due date if not provided (14 days from now)
      const dueDate = borrowData.dueDate 
        ? new Date(borrowData.dueDate)
        : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

      // Create borrow record
      const borrowRecord = await BorrowRecord.create(
        [
          {
            userId: borrowData.userId,
            bookId: borrowData.bookId,
            dueDate: dueDate,
          },
        ],
        { session }
      );

      // Update book availability
      await Book.findByIdAndUpdate(
        borrowData.bookId,
        { available: false },
        { session }
      );

      await session.commitTransaction();

      // Return populated record
      return BorrowRecord.findById(borrowRecord[0]._id)
        .populate('user', 'name email libraryCard')
        .populate('book', 'title isbn author')
        .lean();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async returnBook(borrowId) {
    if (!mongoose.Types.ObjectId.isValid(borrowId)) {
      const error = new Error('Invalid borrow record ID');
      error.statusCode = 400;
      error.code = 'INVALID_ID';
      throw error;
    }

    const borrowRecord = await BorrowRecord.findById(borrowId);
    if (!borrowRecord) {
      const error = new Error('Borrow record not found');
      error.statusCode = 404;
      error.code = 'BORROW_NOT_FOUND';
      throw error;
    }

    if (borrowRecord.status === 'returned') {
      const error = new Error('Book has already been returned');
      error.statusCode = 400;
      error.code = 'ALREADY_RETURNED';
      throw error;
    }

    // Use transaction to ensure consistency
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Mark as returned
      borrowRecord.status = 'returned';
      borrowRecord.returnDate = new Date();
      await borrowRecord.save({ session });

      // Update book availability
      await Book.findByIdAndUpdate(
        borrowRecord.bookId,
        { available: true },
        { session }
      );

      await session.commitTransaction();

      // Return populated record
      return BorrowRecord.findById(borrowRecord._id)
        .populate('user', 'name email libraryCard')
        .populate('book', 'title isbn author')
        .lean();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async extendDueDate(borrowId, newDueDate) {
    if (!mongoose.Types.ObjectId.isValid(borrowId)) {
      const error = new Error('Invalid borrow record ID');
      error.statusCode = 400;
      error.code = 'INVALID_ID';
      throw error;
    }

    const borrowRecord = await BorrowRecord.findById(borrowId);
    if (!borrowRecord) {
      const error = new Error('Borrow record not found');
      error.statusCode = 404;
      error.code = 'BORROW_NOT_FOUND';
      throw error;
    }

    if (borrowRecord.status === 'returned') {
      const error = new Error('Cannot extend due date for returned book');
      error.statusCode = 400;
      error.code = 'BOOK_RETURNED';
      throw error;
    }

    if (new Date(newDueDate) <= new Date()) {
      const error = new Error('New due date must be in the future');
      error.statusCode = 400;
      error.code = 'INVALID_DUE_DATE';
      throw error;
    }

    borrowRecord.dueDate = newDueDate;

    // Reset status to active if it was overdue and new date is valid
    if (
      borrowRecord.status === 'overdue' &&
      new Date(newDueDate) > new Date()
    ) {
      borrowRecord.status = 'active';
    }

    await borrowRecord.save();

    return BorrowRecord.findById(borrowRecord._id)
      .populate('user', 'name email libraryCard')
      .populate('book', 'title isbn author')
      .lean();
  }

  async renewBorrow(borrowId) {
    const borrowRecord = await BorrowRecord.findById(borrowId);
    if (!borrowRecord) {
      const error = new Error('Borrow record not found');
      error.statusCode = 404;
      error.code = 'BORROW_NOT_FOUND';
      throw error;
    }

    try {
      await borrowRecord.renew();
      return BorrowRecord.findById(borrowRecord._id)
        .populate('user', 'name email libraryCard')
        .populate('book', 'title isbn author')
        .lean();
    } catch (error) {
      const err = new Error(error.message);
      err.statusCode = 400;
      err.code = 'RENEWAL_ERROR';
      throw err;
    }
  }

  async getUserBorrowHistory(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return [];
    }

    return BorrowRecord.find({ userId })
      .sort({ borrowDate: -1 })
      .populate('book', 'title isbn author')
      .lean();
  }

  async getBookBorrowHistory(bookId) {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return [];
    }

    return BorrowRecord.find({ bookId })
      .sort({ borrowDate: -1 })
      .populate('user', 'name email libraryCard')
      .lean();
  }

  async getOverdueBooks() {
    await BorrowRecord.updateOverdueRecords();

    return BorrowRecord.find({ status: 'overdue' })
      .populate('user', 'name email libraryCard phone')
      .populate('book', 'title isbn author')
      .sort({ dueDate: 1 })
      .lean();
  }

  async getDueSoon(days = 3) {
    return BorrowRecord.findDueSoon()
      .populate('user', 'name email libraryCard phone')
      .populate('book', 'title isbn author')
      .sort({ dueDate: 1 })
      .lean();
  }

  async getStats() {
    const [
      totalBorrows,
      activeBorrows,
      returnedBorrows,
      overdueBorrows,
      lostBorrows,
    ] = await Promise.all([
      BorrowRecord.countDocuments(),
      BorrowRecord.countDocuments({ status: 'active' }),
      BorrowRecord.countDocuments({ status: 'returned' }),
      BorrowRecord.countDocuments({ status: 'overdue' }),
      BorrowRecord.countDocuments({ status: 'lost' }),
    ]);

    // Monthly borrow statistics
    const monthlyStatsArr = await BorrowRecord.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$borrowDate' },
            month: { $month: '$borrowDate' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    const monthlyStats = {};
    monthlyStatsArr.forEach((m) => {
      const key = `${m._id.year}-${m._id.month.toString().padStart(2, '0')}`;
      monthlyStats[key] = m.count;
    });

    return {
      totalBorrows,
      activeBorrows,
      returnedBorrows,
      overdueBorrows,
      lostBorrows,
      monthlyBorrows: monthlyStats,
    };
  }
}

export default new BorrowService();
