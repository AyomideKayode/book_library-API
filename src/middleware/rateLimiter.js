import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';

/**
 * General rate limiter for most endpoints
 * Limit: 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `windowMs`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  handler: (req, res, next, options) => {
    req.log ? req.log.warn('Rate limit exceeded (General)') : logger.warn({ ip: req.ip }, 'Rate limit exceeded (General)');
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * Strict rate limiter for sensitive endpoints (e.g., login, user creation)
 * Limit: 5 requests per 15 minutes
 */
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `windowMs`
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many attempts, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED_STRICT',
  },
  handler: (req, res, next, options) => {
    req.log ? req.log.warn('Rate limit exceeded (Strict)') : logger.warn({ ip: req.ip }, 'Rate limit exceeded (Strict)');
    res.status(options.statusCode).json(options.message);
  },
});
