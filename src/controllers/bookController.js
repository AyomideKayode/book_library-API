import BookService from '../services/bookService.js';

class BookController {
  async getAllBooks(req, res, next) {
    try {
      const filters = {
        q: req.query.q,
        genre: req.query.genre,
        available:
          req.query.available === 'true'
            ? true
            : req.query.available === 'false'
            ? false
            : undefined,
        authorId: req.query.authorId,
        page: req.query.page,
        limit: req.query.limit,
        sort: req.query.sort,
      };

      const result = await BookService.findAll(filters);

      res.status(200).json({
        success: true,
        data: result.books,
        pagination: result.pagination,
        message: 'Books retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookById(req, res, next) {
    try {
      const { id } = req.params;
      const book = await BookService.findById(id);

      if (!book) {
        return res.status(404).json({
          success: false,
          error: 'Book not found',
          code: 'BOOK_NOT_FOUND',
        });
      }

      res.status(200).json({
        success: true,
        data: book,
        message: 'Book retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async createBook(req, res, next) {
    try {
      const book = await BookService.create(req.body);

      res.status(201).json({
        success: true,
        data: book,
        message: 'Book created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBook(req, res, next) {
    try {
      const { id } = req.params;
      const book = await BookService.update(id, req.body);

      res.status(200).json({
        success: true,
        data: book,
        message: 'Book updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBook(req, res, next) {
    try {
      const { id } = req.params;
      await BookService.delete(id);

      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }

  async searchBooks(req, res, next) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required',
          code: 'MISSING_QUERY',
        });
      }

      const filters = {
        q,
        page: req.query.page,
        limit: req.query.limit,
        sort: req.query.sort,
      };

      const result = await BookService.findAll(filters);

      res.status(200).json({
        success: true,
        data: result.books,
        pagination: result.pagination,
        message: `Found ${result.pagination.totalItems} books matching "${q}"`,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookStats(req, res, next) {
    try {
      const stats = await BookService.getStats();

      res.status(200).json({
        success: true,
        data: stats,
        message: 'Book statistics retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new BookController();
