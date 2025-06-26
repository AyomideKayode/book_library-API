import { Router } from 'express';
const router = Router();
import BorrowController from '../controllers/borrowController.js';
import {
  borrowValidationRules,
  returnValidationRules,
  handleValidationErrors,
  uuidParamValidation,
  searchQueryValidation,
} from '../middleware/validation.js';

/**
 * @swagger
 * tags:
 *   name: Borrowing
 *   description: Book borrowing and returning endpoints
 */

/**
 * @swagger
 * /api/borrow:
 *   post:
 *     summary: Borrow a book
 *     tags: [Borrowing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - bookId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: "u1234567-89ab-cdef-0123-456789abcdef"
 *               bookId:
 *                 type: string
 *                 format: uuid
 *                 example: "b1234567-89ab-cdef-0123-456789abcdef"
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: Optional due date (defaults to 14 days from borrow date)
 *                 example: "2024-02-15T23:59:59.000Z"
 *     responses:
 *       201:
 *         description: Book borrowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/BorrowRecord'
 *       400:
 *         description: Validation error or book not available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User or book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/borrow',
  borrowValidationRules(),
  handleValidationErrors,
  BorrowController.borrowBook
);

/**
 * @swagger
 * /api/return:
 *   post:
 *     summary: Return a borrowed book
 *     tags: [Borrowing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - borrowId
 *             properties:
 *               borrowId:
 *                 type: string
 *                 format: uuid
 *                 example: "br1234567-89ab-cdef-0123-456789abcdef"
 *     responses:
 *       200:
 *         description: Book returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/BorrowRecord'
 *       400:
 *         description: Book already returned or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Borrow record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/return',
  returnValidationRules(),
  handleValidationErrors,
  BorrowController.returnBook
);

/**
 * @swagger
 * /api/borrow-records:
 *   get:
 *     summary: Get all borrow records
 *     tags: [Borrowing]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by user ID
 *       - in: query
 *         name: bookId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by book ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, returned, overdue]
 *         description: Filter by borrow status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [borrowDate, dueDate, returnDate, status, -borrowDate, -dueDate, -returnDate, -status]
 *         description: Sort field (prefix with - for descending order)
 *     responses:
 *       200:
 *         description: Borrow records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/BorrowRecord'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalItems:
 *                           type: integer
 *                         itemsPerPage:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *                         hasPrev:
 *                           type: boolean
 */
router.get('/borrow-records', BorrowController.getAllBorrowRecords);

/**
 * @swagger
 * /api/borrow-records/{id}:
 *   get:
 *     summary: Get borrow record by ID
 *     tags: [Borrowing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Borrow record ID
 *     responses:
 *       200:
 *         description: Borrow record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/BorrowRecord'
 *       404:
 *         description: Borrow record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/borrow-records/:id',
  uuidParamValidation('id'),
  handleValidationErrors,
  BorrowController.getBorrowRecordById
);

/**
 * @swagger
 * /api/borrow-records/{id}/extend:
 *   patch:
 *     summary: Extend due date for a borrow record
 *     tags: [Borrowing]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Borrow record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dueDate
 *             properties:
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-03-01T23:59:59.000Z"
 *     responses:
 *       200:
 *         description: Due date extended successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/BorrowRecord'
 *       400:
 *         description: Invalid due date or book already returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Borrow record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch(
  '/borrow-records/:id/extend',
  uuidParamValidation('id'),
  handleValidationErrors,
  BorrowController.extendDueDate
);

/**
 * @swagger
 * /api/users/{userId}/borrow-history:
 *   get:
 *     summary: Get user's borrow history
 *     tags: [Borrowing]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User borrow history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/BorrowRecord'
 */
router.get(
  '/users/:userId/borrow-history',
  uuidParamValidation('userId'),
  handleValidationErrors,
  BorrowController.getUserBorrowHistory
);

/**
 * @swagger
 * /api/books/{bookId}/borrow-history:
 *   get:
 *     summary: Get book's borrow history
 *     tags: [Borrowing]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book borrow history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/BorrowRecord'
 */
router.get(
  '/books/:bookId/borrow-history',
  uuidParamValidation('bookId'),
  handleValidationErrors,
  BorrowController.getBookBorrowHistory
);

/**
 * @swagger
 * /api/overdue-books:
 *   get:
 *     summary: Get all overdue books
 *     tags: [Borrowing]
 *     responses:
 *       200:
 *         description: Overdue books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/BorrowRecord'
 */
router.get('/overdue-books', BorrowController.getOverdueBooks);

/**
 * @swagger
 * /api/borrow-stats:
 *   get:
 *     summary: Get borrow statistics
 *     tags: [Borrowing]
 *     responses:
 *       200:
 *         description: Borrow statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         totalBorrows:
 *                           type: integer
 *                         activeBorrows:
 *                           type: integer
 *                         returnedBorrows:
 *                           type: integer
 *                         overdueBorrows:
 *                           type: integer
 */
router.get('/borrow-stats', BorrowController.getBorrowStats);

export default router;
