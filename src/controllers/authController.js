import AuthService from '../services/authService.js';

class AuthController {
  async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);

      res.status(201).json({
        success: true,
        data: result,
        message: 'User registered successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Login successful',
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await AuthService.getProfile(req.user.userId);

      res.status(200).json({
        success: true,
        data: user,
        message: 'Profile retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
