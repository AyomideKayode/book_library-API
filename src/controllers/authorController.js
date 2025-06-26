import AuthorService from '../services/authorService.js';

class AuthorController {
  async getAllAuthors(req, res, next) {
    try {
      const filters = {
        q: req.query.q,
        page: req.query.page,
        limit: req.query.limit,
        sort: req.query.sort,
      };

      const result = await AuthorService.findAll(filters);

      res.status(200).json({
        success: true,
        data: result.authors,
        pagination: result.pagination,
        message: 'Authors retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getAuthorById(req, res, next) {
    try {
      const { id } = req.params;
      const author = await AuthorService.findById(id);

      if (!author) {
        return res.status(404).json({
          success: false,
          error: 'Author not found',
          code: 'AUTHOR_NOT_FOUND',
        });
      }

      res.status(200).json({
        success: true,
        data: author,
        message: 'Author retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async createAuthor(req, res, next) {
    try {
      const author = await AuthorService.create(req.body);

      res.status(201).json({
        success: true,
        data: author,
        message: 'Author created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAuthor(req, res, next) {
    try {
      const { id } = req.params;
      const author = await AuthorService.update(id, req.body);

      res.status(200).json({
        success: true,
        data: author,
        message: 'Author updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAuthor(req, res, next) {
    try {
      const { id } = req.params;
      await AuthorService.delete(id);

      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }

  async searchAuthors(req, res, next) {
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

      const result = await AuthorService.findAll(filters);

      res.status(200).json({
        success: true,
        data: result.authors,
        pagination: result.pagination,
        message: `Found ${result.pagination.totalItems} authors matching "${q}"`,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAuthorStats(req, res, next) {
    try {
      const stats = await AuthorService.getStats();

      res.status(200).json({
        success: true,
        data: stats,
        message: 'Author statistics retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthorController();
