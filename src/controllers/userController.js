import UserService from '../services/userService.js';

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const filters = {
        q: req.query.q,
        page: req.query.page,
        limit: req.query.limit,
        sort: req.query.sort,
      };

      const result = await UserService.findAll(filters);

      res.status(200).json({
        success: true,
        data: result.users,
        pagination: result.pagination,
        message: 'Users retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        });
      }

      res.status(200).json({
        success: true,
        data: user,
        message: 'User retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const user = await UserService.create(req.body);

      res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.update(id, req.body);

      res.status(200).json({
        success: true,
        data: user,
        message: 'User updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      await UserService.delete(id);

      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }

  async searchUsers(req, res, next) {
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

      const result = await UserService.findAll(filters);

      res.status(200).json({
        success: true,
        data: result.users,
        pagination: result.pagination,
        message: `Found ${result.pagination.totalItems} users matching "${q}"`,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserStats(req, res, next) {
    try {
      const stats = await UserService.getStats();

      res.status(200).json({
        success: true,
        data: stats,
        message: 'User statistics retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
