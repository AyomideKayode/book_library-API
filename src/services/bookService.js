import Book from '../models/Book.js';
import Author from '../models/Author.js';
import mongoose from 'mongoose';

class BookService {
  async findAll(filters = {}) {
    const query = {};
    if (filters.q) {
      query.$or = [
        { title: { $regex: filters.q, $options: 'i' } },
        { genre: { $regex: filters.q, $options: 'i' } },
        { isbn: { $regex: filters.q, $options: 'i' } },
      ];
    }
    if (filters.genre) {
      query.genre = { $regex: filters.genre, $options: 'i' };
    }
    if (filters.available !== undefined) {
      query.available = filters.available;
    }
    if (filters.authorId) {
      if (mongoose.Types.ObjectId.isValid(filters.authorId)) {
        query.authorId = filters.authorId;
      }
    }

    // Sorting
    let sort = { title: 1 };
    if (filters.sort) {
      const field = filters.sort.replace('-', '');
      const order = filters.sort.startsWith('-') ? -1 : 1;
      sort = { [field]: order };
    }

    // Pagination
    const page = parseInt(filters.page) > 0 ? parseInt(filters.page) : 1;
    const limit = parseInt(filters.limit) > 0 ? parseInt(filters.limit) : 10;
    const skip = (page - 1) * limit;

    const [books, totalItems] = await Promise.all([
      Book.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('author')
        .lean(),
      Book.countDocuments(query),
    ]);

    return {
      books,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
        hasNext: skip + books.length < totalItems,
        hasPrev: page > 1,
      },
    };
  }

  async findById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Book.findById(id).populate('author').lean();
  }

  async findByIsbn(isbn) {
    return Book.findOne({ isbn: isbn.replace(/[-\s]/g, '') }).lean();
  }

  async create(bookData) {
    // Check if ISBN already exists
    const existingBook = await this.findByIsbn(bookData.isbn);
    if (existingBook) {
      const error = new Error('Book with this ISBN already exists');
      error.statusCode = 409;
      error.code = 'ISBN_EXISTS';
      throw error;
    }
    // Validate author exists
    if (!(await Author.findById(bookData.authorId))) {
      const error = new Error('Author not found');
      error.statusCode = 404;
      error.code = 'AUTHOR_NOT_FOUND';
      throw error;
    }
    const book = await Book.create(bookData);
    return book.toObject();
  }

  async update(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('Invalid book ID');
      error.statusCode = 400;
      error.code = 'INVALID_ID';
      throw error;
    }
    // Check if ISBN is being updated and already exists
    if (updateData.isbn) {
      const existingBook = await Book.findOne({
        isbn: updateData.isbn.replace(/[-\s]/g, ''),
        _id: { $ne: id },
      });
      if (existingBook) {
        const error = new Error('Book with this ISBN already exists');
        error.statusCode = 409;
        error.code = 'ISBN_EXISTS';
        throw error;
      }
    }
    const book = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('author');
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      error.code = 'BOOK_NOT_FOUND';
      throw error;
    }
    return book.toObject();
  }

  async delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('Invalid book ID');
      error.statusCode = 400;
      error.code = 'INVALID_ID';
      throw error;
    }
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      error.code = 'BOOK_NOT_FOUND';
      throw error;
    }
    return book.toObject();
  }

  async updateAvailability(id, available) {
    return this.update(id, { available });
  }

  async getStats() {
    const totalBooks = await Book.countDocuments();
    const availableBooks = await Book.countDocuments({ available: true });
    const borrowedBooks = await Book.countDocuments({ available: false });
    const genreStatsArr = await Book.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
    ]);
    const genreStats = {};
    genreStatsArr.forEach((g) => {
      genreStats[g._id] = g.count;
    });
    return {
      totalBooks,
      availableBooks,
      borrowedBooks,
      genreDistribution: genreStats,
    };
  }
}

export default new BookService();
