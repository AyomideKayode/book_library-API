import { body, param, query, validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Custom ObjectId validator
const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

// Validation middleware to check for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

// Book validation rules
const bookValidationRules = () => {
  return [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ min: 1, max: 255 })
      .withMessage('Title must be between 1 and 255 characters'),
    body('authorId')
      .trim()
      .notEmpty()
      .withMessage('Author ID is required')
      .custom(isValidObjectId)
      .withMessage('Author ID must be a valid ObjectId'),
    body('isbn')
      .trim()
      .notEmpty()
      .withMessage('ISBN is required')
      .matches(
        /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/
      )
      .withMessage('Invalid ISBN format'),
    body('genre')
      .trim()
      .notEmpty()
      .withMessage('Genre is required')
      .isLength({ min: 1, max: 100 })
      .withMessage('Genre must be between 1 and 100 characters'),
    body('publicationDate')
      .optional()
      .isISO8601()
      .withMessage('Publication date must be a valid date'),
    body('available')
      .optional()
      .isBoolean()
      .withMessage('Available must be a boolean value'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters'),
    body('pages')
      .optional()
      .isInt({ min: 1, max: 10000 })
      .withMessage('Pages must be between 1 and 10000'),
    body('language')
      .optional()
      .trim()
      .isLength({ min: 1, max: 30 })
      .withMessage('Language must be between 1 and 30 characters'),
    body('publisher')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Publisher must be between 1 and 100 characters'),
  ];
};

const bookUpdateValidationRules = () => {
  return [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty')
      .isLength({ min: 1, max: 255 })
      .withMessage('Title must be between 1 and 255 characters'),
    body('authorId')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Author ID cannot be empty')
      .custom(isValidObjectId)
      .withMessage('Author ID must be a valid ObjectId'),
    body('isbn')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('ISBN cannot be empty')
      .matches(
        /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/
      )
      .withMessage('Invalid ISBN format'),
    body('genre')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Genre cannot be empty')
      .isLength({ min: 1, max: 100 })
      .withMessage('Genre must be between 1 and 100 characters'),
    body('publicationDate')
      .optional()
      .isISO8601()
      .withMessage('Publication date must be a valid date'),
    body('available')
      .optional()
      .isBoolean()
      .withMessage('Available must be a boolean value'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must not exceed 1000 characters'),
    body('pages')
      .optional()
      .isInt({ min: 1, max: 10000 })
      .withMessage('Pages must be between 1 and 10000'),
    body('language')
      .optional()
      .trim()
      .isLength({ min: 1, max: 30 })
      .withMessage('Language must be between 1 and 30 characters'),
    body('publisher')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Publisher must be between 1 and 100 characters'),
  ];
};

// Author validation rules
const authorValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 1, max: 255 })
      .withMessage('Name must be between 1 and 255 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('biography')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Biography must not exceed 1000 characters'),
    body('birthDate')
      .optional()
      .isISO8601()
      .withMessage('Birth date must be a valid date')
      .custom((value) => {
        if (new Date(value) > new Date()) {
          throw new Error('Birth date cannot be in the future');
        }
        return true;
      }),
  ];
};

const authorUpdateValidationRules = () => {
  return [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty')
      .isLength({ min: 1, max: 255 })
      .withMessage('Name must be between 1 and 255 characters'),
    body('email')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Email cannot be empty')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('biography')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Biography must not exceed 1000 characters'),
    body('birthDate')
      .optional()
      .isISO8601()
      .withMessage('Birth date must be a valid date')
      .custom((value) => {
        if (new Date(value) > new Date()) {
          throw new Error('Birth date cannot be in the future');
        }
        return true;
      }),
  ];
};

// User validation rules
const userValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 1, max: 255 })
      .withMessage('Name must be between 1 and 255 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('phone')
      .optional()
      .trim()
      .matches(/^[\+]?[1-9][\d\-\s\(\)]{0,20}$/)
      .withMessage('Invalid phone number format'),
  ];
};

const userUpdateValidationRules = () => {
  return [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty')
      .isLength({ min: 1, max: 255 })
      .withMessage('Name must be between 1 and 255 characters'),
    body('email')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Email cannot be empty')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('phone')
      .optional()
      .trim()
      .matches(/^[\+]?[1-9][\d\-\s\(\)]{0,20}$/)
      .withMessage('Invalid phone number format'),
  ];
};

// Borrow validation rules
const borrowValidationRules = () => {
  return [
    body('userId')
      .trim()
      .notEmpty()
      .withMessage('User ID is required')
      .custom(isValidObjectId)
      .withMessage('User ID must be a valid ObjectId'),
    body('bookId')
      .trim()
      .notEmpty()
      .withMessage('Book ID is required')
      .custom(isValidObjectId)
      .withMessage('Book ID must be a valid ObjectId'),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Due date must be a valid date')
      .custom((value) => {
        if (new Date(value) <= new Date()) {
          throw new Error('Due date must be in the future');
        }
        return true;
      }),
  ];
};

// Return validation rules
const returnValidationRules = () => {
  return [
    body('borrowId')
      .trim()
      .notEmpty()
      .withMessage('Borrow ID is required')
      .custom(isValidObjectId)
      .withMessage('Borrow ID must be a valid ObjectId'),
  ];
};

// Parameter validation rules
const objectIdParamValidation = (paramName) => {
  return [
    param(paramName)
      .custom(isValidObjectId)
      .withMessage(`${paramName} must be a valid ObjectId`),
  ];
};

// Query validation rules
const searchQueryValidation = () => {
  return [
    query('q')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Search query must be between 1 and 255 characters'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('sort')
      .optional()
      .isIn([
        'title',
        'author',
        'genre',
        'createdAt',
        'updatedAt',
        '-title',
        '-author',
        '-genre',
        '-createdAt',
        '-updatedAt',
      ])
      .withMessage('Invalid sort field'),
  ];
};

export {
  handleValidationErrors,
  bookValidationRules,
  bookUpdateValidationRules,
  authorValidationRules,
  authorUpdateValidationRules,
  userValidationRules,
  userUpdateValidationRules,
  borrowValidationRules,
  returnValidationRules,
  objectIdParamValidation,
  searchQueryValidation,
};
