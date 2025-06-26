import Book from '../models/Book.js';
import Author from '../models/Author.js';

class BookService {
  constructor() {
    this.books = new Map();
    this.initializeData();
  }

  initializeData() {
    // Sample data for demonstration
    const sampleBooks = [
      {
        title: 'The Great Gatsby',
        authorId: 'a1234567-89ab-cdef-0123-456789abcdef',
        isbn: '978-0-7432-7356-5',
        genre: 'Fiction',
        publicationDate: '1925-04-10',
      },
      {
        title: 'To Kill a Mockingbird',
        authorId: 'a2234567-89ab-cdef-0123-456789abcdef',
        isbn: '978-0-06-112008-4',
        genre: 'Fiction',
        publicationDate: '1960-07-11',
      },
      {
        title: '1984',
        authorId: 'a3234567-89ab-cdef-0123-456789abcdef',
        isbn: '978-0-452-28423-4',
        genre: 'Dystopian Fiction',
        publicationDate: '1949-06-08',
      },
    ];

    sampleBooks.forEach((bookData) => {
      const book = new Book(
        bookData.title,
        bookData.authorId,
        bookData.isbn,
        bookData.genre,
        bookData.publicationDate
      );
      this.books.set(book.id, book);
    });
  }

  async findAll(filters = {}) {
    let books = Array.from(this.books.values());

    // Apply filters
    if (filters.q) {
      const query = filters.q.toLowerCase();
      books = books.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.genre.toLowerCase().includes(query) ||
          book.isbn.toLowerCase().includes(query)
      );
    }

    if (filters.genre) {
      books = books.filter(
        (book) => book.genre.toLowerCase() === filters.genre.toLowerCase()
      );
    }

    if (filters.available !== undefined) {
      books = books.filter((book) => book.available === filters.available);
    }

    if (filters.authorId) {
      books = books.filter((book) => book.authorId === filters.authorId);
    }

    // Sort
    if (filters.sort) {
      const sortField = filters.sort.startsWith('-')
        ? filters.sort.slice(1)
        : filters.sort;
      const sortOrder = filters.sort.startsWith('-') ? -1 : 1;

      books.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1 * sortOrder;
        if (a[sortField] > b[sortField]) return 1 * sortOrder;
        return 0;
      });
    } else {
      // Default sort by title
      books.sort((a, b) => a.title.localeCompare(b.title));
    }

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedBooks = books.slice(startIndex, endIndex);

    return {
      books: paginatedBooks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(books.length / limit),
        totalItems: books.length,
        itemsPerPage: limit,
        hasNext: endIndex < books.length,
        hasPrev: page > 1,
      },
    };
  }

  async findById(id) {
    return this.books.get(id) || null;
  }

  async findByIsbn(isbn) {
    for (const book of this.books.values()) {
      if (book.isbn === isbn) {
        return book;
      }
    }
    return null;
  }

  async create(bookData) {
    // Check if ISBN already exists
    const existingBook = await this.findByIsbn(bookData.isbn);
    if (existingBook) {
      throw {
        statusCode: 409,
        message: 'Book with this ISBN already exists',
        code: 'ISBN_EXISTS',
      };
    }

    const book = new Book(
      bookData.title,
      bookData.authorId,
      bookData.isbn,
      bookData.genre,
      bookData.publicationDate
    );

    this.books.set(book.id, book);
    return book;
  }

  async update(id, updateData) {
    const book = this.books.get(id);
    if (!book) {
      throw {
        statusCode: 404,
        message: 'Book not found',
        code: 'BOOK_NOT_FOUND',
      };
    }

    // Check if ISBN is being updated and already exists
    if (updateData.isbn && updateData.isbn !== book.isbn) {
      const existingBook = await this.findByIsbn(updateData.isbn);
      if (existingBook) {
        throw {
          statusCode: 409,
          message: 'Book with this ISBN already exists',
          code: 'ISBN_EXISTS',
        };
      }
    }

    book.update(updateData);
    this.books.set(id, book);
    return book;
  }

  async delete(id) {
    const book = this.books.get(id);
    if (!book) {
      throw {
        statusCode: 404,
        message: 'Book not found',
        code: 'BOOK_NOT_FOUND',
      };
    }

    this.books.delete(id);
    return book;
  }

  async updateAvailability(id, available) {
    return this.update(id, { available });
  }

  async getStats() {
    const books = Array.from(this.books.values());
    const availableBooks = books.filter((book) => book.available);
    const borrowedBooks = books.filter((book) => !book.available);

    const genreStats = books.reduce((acc, book) => {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
      return acc;
    }, {});

    return {
      totalBooks: books.length,
      availableBooks: availableBooks.length,
      borrowedBooks: borrowedBooks.length,
      genreDistribution: genreStats,
    };
  }
}

export default new BookService();
