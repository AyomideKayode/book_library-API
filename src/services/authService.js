import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

class AuthService {
  async register(data) {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 409;
      error.code = 'EMAIL_EXISTS';
      throw error;
    }

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken };
  }

  async login(email, password) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken };
  }

  async refreshToken(token) {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      const error = new Error('Invalid refresh token');
      error.statusCode = 401;
      error.code = 'INVALID_REFRESH_TOKEN';
      throw error;
    }

    const user = await User.findById(decoded.userId).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      const error = new Error('Invalid refresh token');
      error.statusCode = 401;
      error.code = 'INVALID_REFRESH_TOKEN';
      throw error;
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken, refreshToken: newRefreshToken };
  }

  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }
    return user.toObject();
  }
}

export default new AuthService();
