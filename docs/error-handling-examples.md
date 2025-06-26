# Error Handling Examples

This document provides examples of how the Book Library API handles various error scenarios with consistent response formats.

## Error Response Format

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": null | object
}
```

## Validation Errors

### Invalid Email Format

**Request:**

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"invalid-email","phone":"+1234567890"}'
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "message": "Invalid email format",
      "value": "invalid-email"
    }
  ]
}
```

### Missing Required Fields

**Request:**

```bash
curl -X POST http://localhost:3001/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Incomplete Book"}'
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "message": "Author ID is required",
      "field": "authorId"
    },
    {
      "message": "ISBN is required",
      "field": "isbn"
    }
  ]
}
```

### Invalid UUID Format

**Request:**

```bash
curl -X GET http://localhost:3001/api/books/invalid-uuid
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "message": "Invalid UUID format",
      "value": "invalid-uuid"
    }
  ]
}
```

## Resource Not Found Errors

### Book Not Found

**Request:**

```bash
curl -X GET http://localhost:3001/api/books/12345678-1234-1234-1234-123456789012
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "error": "Book not found",
  "code": "BOOK_NOT_FOUND",
  "details": null
}
```

### Author Not Found

**Request:**

```bash
curl -X GET http://localhost:3001/api/authors/12345678-1234-1234-1234-123456789012
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "error": "Author not found",
  "code": "AUTHOR_NOT_FOUND",
  "details": null
}
```

### User Not Found

**Request:**

```bash
curl -X GET http://localhost:3001/api/users/12345678-1234-1234-1234-123456789012
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "error": "User not found",
  "code": "USER_NOT_FOUND",
  "details": null
}
```

## Business Logic Errors

### Duplicate Email

**Request:**

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","phone":"+1234567890"}'
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "User with this email already exists",
  "code": "EMAIL_EXISTS",
  "details": null
}
```

### Duplicate ISBN

**Request:**

```bash
curl -X POST http://localhost:3001/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Another Book",
    "authorId":"a1234567-89ab-cdef-0123-456789abcdef",
    "isbn":"978-0-7432-7356-5",
    "genre":"Fiction",
    "publicationDate":"2023-01-01"
  }'
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Book with this ISBN already exists",
  "code": "ISBN_EXISTS",
  "details": null
}
```

### Book Not Available for Borrowing

**Request:**

```bash
curl -X POST http://localhost:3001/api/borrow \
  -H "Content-Type: application/json" \
  -d '{"userId":"u1234567-89ab-cdef-0123-456789abcdef","bookId":"b1234567-89ab-cdef-0123-456789abcdef"}'
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Book is not available for borrowing",
  "code": "BOOK_NOT_AVAILABLE",
  "details": null
}
```

### User Already Borrowed This Book

**Request:**

```bash
curl -X POST http://localhost:3001/api/borrow \
  -H "Content-Type: application/json" \
  -d '{"userId":"u1234567-89ab-cdef-0123-456789abcdef","bookId":"b1234567-89ab-cdef-0123-456789abcdef"}'
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "User has already borrowed this book",
  "code": "ALREADY_BORROWED",
  "details": null
}
```

### Book Already Returned

**Request:**

```bash
curl -X POST http://localhost:3001/api/return \
  -H "Content-Type: application/json" \
  -d '{"borrowId":"br123456-89ab-cdef-0123-456789abcdef"}'
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Book has already been returned",
  "code": "ALREADY_RETURNED",
  "details": null
}
```

## Search and Filter Errors

### Missing Search Query

**Request:**

```bash
curl -X GET http://localhost:3001/api/books/search
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Search query is required",
  "code": "MISSING_QUERY"
}
```

### Invalid Pagination Parameters

**Request:**

```bash
curl -X GET "http://localhost:3001/api/books?page=-1&limit=0"
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "message": "Page must be a positive integer",
      "value": "-1"
    },
    {
      "message": "Limit must be between 1 and 100",
      "value": "0"
    }
  ]
}
```

## Route Not Found

### Invalid Endpoint

**Request:**

```bash
curl -X GET http://localhost:3001/api/invalid-endpoint
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "error": "Route GET /api/invalid-endpoint not found",
  "code": "NOT_FOUND",
  "details": {
    "method": "GET",
    "url": "/api/invalid-endpoint",
    "timestamp": "2025-06-26T02:45:00.000Z"
  }
}
```

## Server Errors

### Internal Server Error (500)

```json
{
  "success": false,
  "error": "Internal Server Error",
  "code": "INTERNAL_ERROR",
  "details": {
    "timestamp": "2025-06-26T02:45:00.000Z",
    "requestId": "req-12345"
  }
}
```

## Testing Error Handling

You can test these error scenarios using the provided Postman collection or by running the curl commands above. The API consistently returns appropriate HTTP status codes and error messages for different types of failures.

### Common HTTP Status Codes Used

- **200 OK**: Successful operations
- **201 Created**: Resource successfully created
- **400 Bad Request**: Validation errors, business logic violations
- **404 Not Found**: Resource not found, invalid routes
- **500 Internal Server Error**: Server-side errors

All error responses include helpful error codes and messages to assist with debugging and client-side error handling.
