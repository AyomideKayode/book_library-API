import { Router } from 'express';
const router = Router();
import AuthorController from '../controllers/authorController.js';
import {
  authorValidationRules,
  authorUpdateValidationRules,
  handleValidationErrors,
  objectIdParamValidation,
  searchQueryValidation,
} from '../middleware/validation.js';

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Author management endpoints
 */

/**
 * @swagger
 * /api/authors:
 *   get:
 *     summary: Get all authors
 *     tags: [Authors]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for name, email, or biography
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
 *           enum: [name, email, createdAt, updatedAt, -name, -email, -createdAt, -updatedAt]
 *         description: Sort field (prefix with - for descending order)
 *     responses:
 *       200:
 *         description: Authors retrieved successfully
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
 *                         $ref: '#/components/schemas/Author'
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
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/',
  searchQueryValidation(),
  handleValidationErrors,
  AuthorController.getAllAuthors
);

/**
 * @swagger
 * /api/authors/search:
 *   get:
 *     summary: Search authors
 *     tags: [Authors]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query for name, email, or biography
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
 *           enum: [name, email, createdAt, updatedAt, -name, -email, -createdAt, -updatedAt]
 *         description: Sort field (prefix with - for descending order)
 *     responses:
 *       200:
 *         description: Authors found successfully
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
 *                         $ref: '#/components/schemas/Author'
 *       400:
 *         description: Search query is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/search',
  searchQueryValidation(),
  handleValidationErrors,
  AuthorController.searchAuthors
);

/**
 * @swagger
 * /api/authors/stats:
 *   get:
 *     summary: Get author statistics
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: Author statistics retrieved successfully
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
 *                         totalAuthors:
 *                           type: integer
 */
router.get('/stats', AuthorController.getAuthorStats);

/**
 * @swagger
 * /api/authors/{id}:
 *   get:
 *     summary: Get author by ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Author ID
 *     responses:
 *       200:
 *         description: Author retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/:id',
  objectIdParamValidation('id'),
  handleValidationErrors,
  AuthorController.getAuthorById
);

/**
 * @swagger
 * /api/authors:
 *   post:
 *     summary: Create a new author
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: "F. Scott Fitzgerald"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "fscott@example.com"
 *               biography:
 *                 type: string
 *                 example: "American novelist and short story writer"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1896-09-24"
 *     responses:
 *       201:
 *         description: Author created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Author'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Author with this email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  authorValidationRules(),
  handleValidationErrors,
  AuthorController.createAuthor
);

/**
 * @swagger
 * /api/authors/{id}:
 *   put:
 *     summary: Update author by ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Author ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "F. Scott Fitzgerald"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "fscott.updated@example.com"
 *               biography:
 *                 type: string
 *                 example: "Updated biography text"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1896-09-24"
 *     responses:
 *       200:
 *         description: Author updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Author'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Author with this email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  '/:id',
  objectIdParamValidation('id'),
  authorUpdateValidationRules(),
  handleValidationErrors,
  AuthorController.updateAuthor
);

/**
 * @swagger
 * /api/authors/{id}:
 *   delete:
 *     summary: Delete author by ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-fA-F]{24}$"
 *         description: Author ID
 *     responses:
 *       204:
 *         description: Author deleted successfully
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  '/:id',
  objectIdParamValidation('id'),
  handleValidationErrors,
  AuthorController.deleteAuthor
);

export default router;
