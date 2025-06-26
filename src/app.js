import express, { json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();


import swaggerJsdoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';

// Import routes
import bookRoutes from './routes/bookRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
import userRoutes from './routes/userRoutes.js';
import borrowRoutes from './routes/borrowRoutes.js';

// Import middleware
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors());

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book Library API',
      version: '1.0.0',
      description:
        'A comprehensive RESTful API for managing a book library system',
      contact: {
        name: 'API Support',
        email: 'support@booklibrary.com',
      },
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Book: {
          type: 'object',
          required: ['title', 'authorId', 'isbn', 'genre'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the book',
              example: 'b1234567-89ab-cdef-0123-456789abcdef',
            },
            title: {
              type: 'string',
              description: 'Title of the book',
              example: 'The Great Gatsby',
            },
            authorId: {
              type: 'string',
              description: 'ID of the author',
              example: 'a1234567-89ab-cdef-0123-456789abcdef',
            },
            isbn: {
              type: 'string',
              description: 'International Standard Book Number',
              example: '978-0-7432-7356-5',
            },
            genre: {
              type: 'string',
              description: 'Genre of the book',
              example: 'Fiction',
            },
            publicationDate: {
              type: 'string',
              format: 'date',
              description: 'Publication date',
              example: '1925-04-10',
            },
            available: {
              type: 'boolean',
              description: 'Whether the book is available for borrowing',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Author: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the author',
              example: 'a1234567-89ab-cdef-0123-456789abcdef',
            },
            name: {
              type: 'string',
              description: 'Full name of the author',
              example: 'F. Scott Fitzgerald',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the author',
              example: 'fscott@example.com',
            },
            biography: {
              type: 'string',
              description: 'Brief biography of the author',
              example: 'American novelist and short story writer',
            },
            birthDate: {
              type: 'string',
              format: 'date',
              description: 'Birth date of the author',
              example: '1896-09-24',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        User: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the user',
              example: 'u1234567-89ab-cdef-0123-456789abcdef',
            },
            name: {
              type: 'string',
              description: 'Full name of the user',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the user',
              example: 'john.doe@example.com',
            },
            phone: {
              type: 'string',
              description: 'Phone number of the user',
              example: '+1-555-123-4567',
            },
            membershipDate: {
              type: 'string',
              format: 'date',
              description: 'Date when user became a member',
              example: '2024-01-15',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        BorrowRecord: {
          type: 'object',
          required: ['userId', 'bookId'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the borrow record',
              example: 'br1234567-89ab-cdef-0123-456789abcdef',
            },
            userId: {
              type: 'string',
              description: 'ID of the user who borrowed the book',
              example: 'u1234567-89ab-cdef-0123-456789abcdef',
            },
            bookId: {
              type: 'string',
              description: 'ID of the borrowed book',
              example: 'b1234567-89ab-cdef-0123-456789abcdef',
            },
            borrowDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time when book was borrowed',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Due date for returning the book',
            },
            returnDate: {
              type: 'string',
              format: 'date-time',
              description:
                'Date and time when book was returned (null if not returned)',
              nullable: true,
            },
            status: {
              type: 'string',
              enum: ['active', 'returned', 'overdue'],
              description: 'Status of the borrow record',
              example: 'active',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Resource not found',
            },
            code: {
              type: 'string',
              description: 'Error code',
              example: 'NOT_FOUND',
            },
            details: {
              type: 'object',
              description: 'Additional error details',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Operation completed successfully',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(swaggerOptions);

// Swagger UI endpoint
app.use(
  '/api-docs',
  serve,
  setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Book Library API Documentation',
  })
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Book Library API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API routes
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/users', userRoutes);
app.use('/api', borrowRoutes);

// API documentation redirect
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

export default app;
