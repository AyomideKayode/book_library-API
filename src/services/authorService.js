import Author from '../models/Author.js';

class AuthorService {
  constructor() {
    this.authors = new Map();
    this.initializeData();
  }

  initializeData() {
    // Sample data for demonstration
    const sampleAuthors = [
      {
        id: 'a1234567-89ab-cdef-0123-456789abcdef',
        name: 'F. Scott Fitzgerald',
        email: 'fscott@example.com',
        biography:
          'American novelist and short story writer, widely regarded as one of the greatest American writers of the 20th century.',
        birthDate: '1896-09-24',
      },
      {
        id: 'a2234567-89ab-cdef-0123-456789abcdef',
        name: 'Harper Lee',
        email: 'harper@example.com',
        biography:
          'American novelist best known for her 1960 novel To Kill a Mockingbird.',
        birthDate: '1926-04-28',
      },
      {
        id: 'a3234567-89ab-cdef-0123-456789abcdef',
        name: 'George Orwell',
        email: 'george@example.com',
        biography:
          'English novelist, essayist, journalist and critic, whose work is characterized by lucid prose, biting social criticism, opposition to totalitarianism.',
        birthDate: '1903-06-25',
      },
    ];

    sampleAuthors.forEach((authorData) => {
      const author = new Author(
        authorData.name,
        authorData.email,
        authorData.biography,
        authorData.birthDate
      );
      // Override the generated ID with our sample ID
      author.id = authorData.id;
      this.authors.set(author.id, author);
    });
  }

  async findAll(filters = {}) {
    let authors = Array.from(this.authors.values());

    // Apply filters
    if (filters.q) {
      const query = filters.q.toLowerCase();
      authors = authors.filter(
        (author) =>
          author.name.toLowerCase().includes(query) ||
          author.email.toLowerCase().includes(query) ||
          (author.biography && author.biography.toLowerCase().includes(query))
      );
    }

    // Sort
    if (filters.sort) {
      const sortField = filters.sort.startsWith('-')
        ? filters.sort.slice(1)
        : filters.sort;
      const sortOrder = filters.sort.startsWith('-') ? -1 : 1;

      authors.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1 * sortOrder;
        if (a[sortField] > b[sortField]) return 1 * sortOrder;
        return 0;
      });
    } else {
      // Default sort by name
      authors.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedAuthors = authors.slice(startIndex, endIndex);

    return {
      authors: paginatedAuthors,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(authors.length / limit),
        totalItems: authors.length,
        itemsPerPage: limit,
        hasNext: endIndex < authors.length,
        hasPrev: page > 1,
      },
    };
  }

  async findById(id) {
    return this.authors.get(id) || null;
  }

  async findByEmail(email) {
    for (const author of this.authors.values()) {
      if (author.email.toLowerCase() === email.toLowerCase()) {
        return author;
      }
    }
    return null;
  }

  async create(authorData) {
    // Check if email already exists
    const existingAuthor = await this.findByEmail(authorData.email);
    if (existingAuthor) {
      throw {
        statusCode: 409,
        message: 'Author with this email already exists',
        code: 'EMAIL_EXISTS',
      };
    }

    const author = new Author(
      authorData.name,
      authorData.email,
      authorData.biography,
      authorData.birthDate
    );

    this.authors.set(author.id, author);
    return author;
  }

  async update(id, updateData) {
    const author = this.authors.get(id);
    if (!author) {
      throw {
        statusCode: 404,
        message: 'Author not found',
        code: 'AUTHOR_NOT_FOUND',
      };
    }

    // Check if email is being updated and already exists
    if (
      updateData.email &&
      updateData.email.toLowerCase() !== author.email.toLowerCase()
    ) {
      const existingAuthor = await this.findByEmail(updateData.email);
      if (existingAuthor) {
        throw {
          statusCode: 409,
          message: 'Author with this email already exists',
          code: 'EMAIL_EXISTS',
        };
      }
    }

    author.update(updateData);
    this.authors.set(id, author);
    return author;
  }

  async delete(id) {
    const author = this.authors.get(id);
    if (!author) {
      throw {
        statusCode: 404,
        message: 'Author not found',
        code: 'AUTHOR_NOT_FOUND',
      };
    }

    this.authors.delete(id);
    return author;
  }

  async getStats() {
    const authors = Array.from(this.authors.values());

    return {
      totalAuthors: authors.length,
    };
  }
}

export default new AuthorService();
