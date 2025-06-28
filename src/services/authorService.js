import Author from '../models/Author.js';
import mongoose from 'mongoose';

class AuthorService {
  async findAll(filters = {}) {
    const query = {};

    // Search filter
    if (filters.q) {
      query.$or = [
        { name: { $regex: filters.q, $options: 'i' } },
        { email: { $regex: filters.q, $options: 'i' } },
        { biography: { $regex: filters.q, $options: 'i' } },
        { nationality: { $regex: filters.q, $options: 'i' } },
      ];
    }

    // Nationality filter
    if (filters.nationality) {
      query.nationality = { $regex: filters.nationality, $options: 'i' };
    }

    // Sorting
    let sort = { name: 1 };
    if (filters.sort) {
      const field = filters.sort.replace('-', '');
      const order = filters.sort.startsWith('-') ? -1 : 1;
      sort = { [field]: order };
    }

    // Pagination
    const page = parseInt(filters.page) > 0 ? parseInt(filters.page) : 1;
    const limit = parseInt(filters.limit) > 0 ? parseInt(filters.limit) : 10;
    const skip = (page - 1) * limit;

    const [authors, totalItems] = await Promise.all([
      Author.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('books')
        .lean(),
      Author.countDocuments(query),
    ]);

    return {
      authors,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        itemsPerPage: limit,
        hasNext: skip + authors.length < totalItems,
        hasPrev: page > 1,
      },
    };
  }

  async findById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Author.findById(id).populate('books').lean();
  }

  async findByEmail(email) {
    return Author.findOne({ email: email.toLowerCase() }).lean();
  }

  async create(authorData) {
    // Check if email already exists
    const existingAuthor = await this.findByEmail(authorData.email);
    if (existingAuthor) {
      const error = new Error('Author with this email already exists');
      error.statusCode = 409;
      error.code = 'EMAIL_EXISTS';
      throw error;
    }

    const author = await Author.create(authorData);
    return author.toObject();
  }

  async update(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('Invalid author ID');
      error.statusCode = 400;
      error.code = 'INVALID_ID';
      throw error;
    }

    // Check if email is being updated and already exists
    if (updateData.email) {
      const existingAuthor = await Author.findOne({
        email: updateData.email.toLowerCase(),
        _id: { $ne: id },
      });
      if (existingAuthor) {
        const error = new Error('Author with this email already exists');
        error.statusCode = 409;
        error.code = 'EMAIL_EXISTS';
        throw error;
      }
    }

    const author = await Author.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('books');

    if (!author) {
      const error = new Error('Author not found');
      error.statusCode = 404;
      error.code = 'AUTHOR_NOT_FOUND';
      throw error;
    }

    return author.toObject();
  }

  async delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('Invalid author ID');
      error.statusCode = 400;
      error.code = 'INVALID_ID';
      throw error;
    }

    // Check if author has books
    const Book = mongoose.model('Book');
    const booksCount = await Book.countDocuments({ authorId: id });

    if (booksCount > 0) {
      const error = new Error('Cannot delete author with existing books');
      error.statusCode = 409;
      error.code = 'AUTHOR_HAS_BOOKS';
      throw error;
    }

    const author = await Author.findByIdAndDelete(id);
    if (!author) {
      const error = new Error('Author not found');
      error.statusCode = 404;
      error.code = 'AUTHOR_NOT_FOUND';
      throw error;
    }

    return author.toObject();
  }

  async getStats() {
    const totalAuthors = await Author.countDocuments();
    const nationalityStatsArr = await Author.aggregate([
      { $match: { nationality: { $exists: true, $ne: null } } },
      { $group: { _id: '$nationality', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const nationalityStats = {};
    nationalityStatsArr.forEach((n) => {
      nationalityStats[n._id] = n.count;
    });

    return {
      totalAuthors,
      nationalityDistribution: nationalityStats,
    };
  }
}

export default new AuthorService();
