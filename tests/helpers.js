import User from '../src/models/User.js';
import jwt from 'jsonwebtoken';

export const createUser = async (overrides = {}) => {
  const defaults = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user',
  };
  return User.create({ ...defaults, ...overrides });
};

export const signToken = (user) =>
  jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

export const getToken = async (overrides = {}) => {
  const user = await createUser(overrides);
  return { user, token: signToken(user) };
};
