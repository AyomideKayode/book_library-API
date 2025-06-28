# Error Handling Examples

This document provides examples of how the Book Library API handles various error scenarios with consistent response formats using MongoDB and ObjectId validation.

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
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid email format",
      "path": "email",
      "location": "body"
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
      "type": "field",
      "msg": "Author is required",
      "path": "author",
      "location": "body"
    },
    {
      "type": "field",
      "msg": "ISBN is required",
      "path": "isbn",
      "location": "body"
    }
  ]
}
```

### Invalid ObjectId Format

**Request:**

```bash
curl -X GET http://localhost:3001/api/books/invalid-objectid
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "type": "field",
      "value": "invalid-objectid",
      "msg": "Invalid id format",
      "path": "id",
      "location": "params"
    }
  ]
}
```

### Invalid Phone Number Format

**Request:**

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"invalid-phone"}'
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "type": "field",
      "value": "invalid-phone",
      "msg": "Invalid phone number format",
      "path": "phone",
      "location": "body"
    }
  ]
}
```

## Resource Not Found Errors

### Book Not Found

**Request:**

```bash
curl -X GET http://localhost:3001/api/books/6757da422043b4c2e5dc6c8f
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
curl -X GET http://localhost:3001/api/authors/6757d9df2043b4c2e5dc6c89
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
curl -X GET http://localhost:3001/api/users/6757d8622043b4c2e5dc6c7f
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

### Borrow Record Not Found

**Request:**

```bash
curl -X GET http://localhost:3001/api/borrow-records/6757dbb62043b4c2e5dc6c97
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "error": "Borrow record not found",
  "code": "BORROW_RECORD_NOT_FOUND",
  "details": null
}
```

{

## Business Logic Errors

### Duplicate Email (User Registration)

**Request:**

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"john.doe@example.com","phone":"+1234567890"}'
```

**Response (409 Conflict):**

```json
{
  "success": false,
  "error": "User already exists with this email",
  "code": "DUPLICATE_USER",
  "details": {
    "field": "email",
    "value": "john.doe@example.com"
  }
}
```

### Duplicate Email (Author Registration)

**Request:**

```bash
curl -X POST http://localhost:3001/api/authors \
  -H "Content-Type: application/json" \
  -d '{"name":"Isaac Asimov","email":"isaac.asimov@authors.com","biography":"Science fiction author"}'
```

**Response (409 Conflict):**

```json
{
  "success": false,
  "error": "Author already exists with this email",
  "code": "DUPLICATE_AUTHOR",
  "details": {
    "field": "email",
    "value": "isaac.asimov@authors.com"
  }
}
```

### Duplicate ISBN

**Request:**

```bash
curl -X POST http://localhost:3001/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Another Book",
    "author":"6757d9df2043b4c2e5dc6c89",
    "isbn":"978-0553293395",
    "genre":"Fiction",
    "publishedYear":2023
  }'
```

**Response (409 Conflict):**

```json
{
  "success": false,
  "error": "Book already exists with this ISBN",
  "code": "DUPLICATE_BOOK",
  "details": {
    "field": "isbn",
    "value": "978-0553293395"
  }
}
```

### Book Not Available for Borrowing

**Request:**

```bash
curl -X POST http://localhost:3001/api/borrow \
  -H "Content-Type: application/json" \
  -d '{"userId":"6757d8622043b4c2e5dc6c7f","bookId":"6757da422043b4c2e5dc6c8f"}'
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Book is not available for borrowing",
  "code": "BOOK_NOT_AVAILABLE",
  "details": {
    "bookId": "6757da422043b4c2e5dc6c8f",
    "availableCopies": 0
  }
}
```

### User Already Borrowed This Book

**Request:**

```bash
curl -X POST http://localhost:3001/api/borrow \
  -H "Content-Type: application/json" \
  -d '{"userId":"6757d8622043b4c2e5dc6c7f","bookId":"6757da422043b4c2e5dc6c8f"}'
```

**Response (409 Conflict):**

```json
{
  "success": false,
  "error": "User has already borrowed this book",
  "code": "ALREADY_BORROWED",
  "details": {
    "userId": "6757d8622043b4c2e5dc6c7f",
    "bookId": "6757da422043b4c2e5dc6c8f"
  }
}
```

### Book Already Returned

**Request:**

```bash
curl -X POST http://localhost:3001/api/return \
  -H "Content-Type: application/json" \
  -d '{"borrowId":"6757dbb62043b4c2e5dc6c97"}'
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Book has already been returned",
  "code": "ALREADY_RETURNED",
  "details": {
    "borrowId": "6757dbb62043b4c2e5dc6c97",
    "returnDate": "2024-12-10T10:44:46.883Z"
  }
}
```

### Invalid Author Reference

**Request:**

```bash
curl -X POST http://localhost:3001/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Test Book",
    "author":"6757d9df2043b4c2e5dc6c00",
    "isbn":"978-1234567890",
    "genre":"Fiction"
  }'
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Author not found",
  "code": "AUTHOR_NOT_FOUND",
  "details": {
    "authorId": "6757d9df2043b4c2e5dc6c00"
  }
}
```

## Search and Filter Errors

### Missing Search Query

**Request:**

```bash
curl -X GET "http://localhost:3001/api/books/search"
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Search query is required",
  "code": "MISSING_QUERY",
  "details": null
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
      "type": "field",
      "value": "-1",
      "msg": "Page must be a positive integer",
      "path": "page",
      "location": "query"
    },
    {
      "type": "field",
      "value": "0",
      "msg": "Limit must be between 1 and 100",
      "path": "limit",
      "location": "query"
    }
  ]
}
```

### Invalid Sort Parameter

**Request:**

```bash
curl -X GET "http://localhost:3001/api/books?sort=invalid_field"
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Invalid sort field",
  "code": "INVALID_SORT",
  "details": {
    "field": "invalid_field",
    "allowedFields": [
      "title",
      "genre",
      "publishedYear",
      "createdAt",
      "updatedAt"
    ]
  }
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
    "timestamp": "2024-12-10T10:45:00.000Z"
  }
}
```

### Invalid HTTP Method

**Request:**

```bash
curl -X PATCH http://localhost:3001/api/books
```

**Response (405 Method Not Allowed):**

```json
{
  "success": false,
  "error": "Method PATCH not allowed for /api/books",
  "code": "METHOD_NOT_ALLOWED",
  "details": {
    "method": "PATCH",
    "url": "/api/books",
    "allowedMethods": ["GET", "POST"]
  }
}
```

## Database Connection Errors

### MongoDB Connection Failed

**Response (503 Service Unavailable):**

```json
{
  "success": false,
  "error": "Database connection failed",
  "code": "DATABASE_CONNECTION_ERROR",
  "details": {
    "timestamp": "2024-12-10T10:45:00.000Z",
    "retryAfter": 30
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
    "timestamp": "2024-12-10T10:45:00.000Z",
    "requestId": "req-12345"
  }
}
```

### Validation Schema Error

```json
{
  "success": false,
  "error": "Schema validation failed",
  "code": "SCHEMA_VALIDATION_ERROR",
  "details": {
    "field": "publishedYear",
    "message": "Published year must be a valid year between 1000 and current year",
    "value": 2025
  }
}
```

## Rate Limiting (Future Enhancement)

### Too Many Requests

**Response (429 Too Many Requests):**

```json
{
  "success": false,
  "error": "Too many requests",
  "code": "RATE_LIMIT_EXCEEDED",
  "details": {
    "limit": 100,
    "window": "15m",
    "retryAfter": 900
  }
}
```

## Testing Error Handling

You can test these error scenarios using the provided Postman collection or by running the curl commands above. The API consistently returns appropriate HTTP status codes and error messages for different types of failures.

### Common HTTP Status Codes Used

- **200 OK**: Successful operations
- **201 Created**: Resource successfully created
- **204 No Content**: Successful deletion
- **400 Bad Request**: Validation errors, business logic violations
- **404 Not Found**: Resource not found, invalid routes
- **405 Method Not Allowed**: Invalid HTTP method for endpoint
- **409 Conflict**: Duplicate resources, constraint violations
- **429 Too Many Requests**: Rate limiting (future enhancement)
- **500 Internal Server Error**: Server-side errors
- **503 Service Unavailable**: Database connection issues

### Error Response Consistency

All error responses include:

- **success**: Always `false` for errors
- **error**: Human-readable error message
- **code**: Machine-readable error code for programmatic handling
- **details**: Additional context about the error (optional)

### Best Practices for Client Applications

1. **Check HTTP Status Code**: Use status codes for general error categorization
2. **Parse Error Code**: Use the `code` field for specific error handling
3. **Display Error Message**: Show the `error` field to users
4. **Handle Validation Details**: Process the `details` array for field-specific errors
5. **Implement Retry Logic**: For 5xx errors and rate limiting scenarios

All error formats are consistent across the API, making it easy to implement robust error handling in client applications.
