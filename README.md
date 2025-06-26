# Book Library RESTful API

A comprehensive RESTful API for managing a book library system, built following industry best practices and REST principles.

## 🚀 Features

### Must Have ✅

- ✅ RESTful CRUD endpoints for books (`/api/books`)
- ✅ RESTful CRUD endpoints for authors (`/api/authors`)
- ✅ RESTful CRUD endpoints for users (`/api/users`)
- ✅ Borrowing and returning of books (`/api/borrow`, `/api/return`)
- ✅ Appropriate HTTP methods (GET, POST, PUT, DELETE)
- ✅ Correct HTTP status codes (200, 201, 204, 400, 404, 500, etc.)
- ✅ OpenAPI/Swagger-based API documentation
- ✅ Comprehensive error handling with meaningful messages
- ✅ Postman collection for endpoint testing

### Should Have ✅

- ✅ Track book availability status (`available`: true/false)
- ✅ Prevent borrowing of unavailable books
- ✅ Associate books with authors
- ✅ Associate borrowing records with users

### Could Have ✅

- ✅ Search/filter endpoints (search by title, author, genre)
- ✅ Pagination support
- ✅ Statistics endpoints
- ✅ Overdue book tracking
- ✅ Borrow history tracking

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Documentation**: Swagger/OpenAPI 3.0
- **Validation**: express-validator
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Development**: Nodemon

## 📋 Prerequisites

- Node.js (v12 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd book-library-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start the server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## 🌐 API Endpoints

### Base URL

```sh
http://localhost:3000
```

### Health Check

- `GET /health` - API health status

### API Documentation

- `GET /api-docs` - Interactive Swagger UI documentation
- `GET /` - Redirects to API documentation

### Books

- `GET /api/books` - Get all books (with filters and pagination)
- `GET /api/books/search` - Search books
- `GET /api/books/stats` - Get book statistics
- `GET /api/books/{id}` - Get book by ID
- `POST /api/books` - Create a new book
- `PUT /api/books/{id}` - Update book by ID
- `DELETE /api/books/{id}` - Delete book by ID

### Authors

- `GET /api/authors` - Get all authors (with filters and pagination)
- `GET /api/authors/search` - Search authors
- `GET /api/authors/stats` - Get author statistics
- `GET /api/authors/{id}` - Get author by ID
- `POST /api/authors` - Create a new author
- `PUT /api/authors/{id}` - Update author by ID
- `DELETE /api/authors/{id}` - Delete author by ID

### Users

- `GET /api/users` - Get all users (with filters and pagination)
- `GET /api/users/search` - Search users
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/{id}` - Update user by ID
- `DELETE /api/users/{id}` - Delete user by ID

### Borrowing

- `POST /api/borrow` - Borrow a book
- `POST /api/return` - Return a borrowed book
- `GET /api/borrow-records` - Get all borrow records (with filters)
- `GET /api/borrow-records/{id}` - Get borrow record by ID
- `PATCH /api/borrow-records/{id}/extend` - Extend due date
- `GET /api/users/{userId}/borrow-history` - Get user's borrow history
- `GET /api/books/{bookId}/borrow-history` - Get book's borrow history
- `GET /api/overdue-books` - Get all overdue books
- `GET /api/borrow-stats` - Get borrowing statistics

## 📖 API Documentation

The API includes comprehensive OpenAPI/Swagger documentation available at:

- **Interactive Documentation**: <http://localhost:3000/api-docs>
- **JSON Specification**: <http://localhost:3000/api-docs.json>

## 🔍 Query Parameters

### Pagination

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

### Sorting

- `sort` - Sort field (prefix with `-` for descending order)
  - Books: `title`, `genre`, `createdAt`, `updatedAt`
  - Authors: `name`, `email`, `createdAt`, `updatedAt`
  - Users: `name`, `email`, `membershipDate`, `createdAt`, `updatedAt`

### Filtering

- `q` - Search query (searches across relevant fields)
- `genre` - Filter books by genre
- `available` - Filter books by availability (true/false)
- `authorId` - Filter books by author ID
- `userId` - Filter borrow records by user ID
- `bookId` - Filter borrow records by book ID
- `status` - Filter borrow records by status (active/returned/overdue)

## 📝 Example Requests

### Create a Book

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "authorId": "a1234567-89ab-cdef-0123-456789abcdef",
    "isbn": "978-0-7432-7356-5",
    "genre": "Fiction",
    "publicationDate": "1925-04-10"
  }'
```

### Borrow a Book

```bash
curl -X POST http://localhost:3000/api/borrow \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "e80194b5-c236-46f0-a7f6-bf112ceb2054",
    "bookId": "bdf2529c-b42a-46ee-b888-0be48a2945d9"
  }'
```

```bash
  {"success":true,"data":{"id":"c051564d-de92-4824-8813-05ca5e4df8ff","userId":"e80194b5-c236-46f0-a7f6-bf112ceb2054","bookId":"bdf2529c-b42a-46ee-b888-0be48a2945d9","borrowDate":"2025-06-26T02:43:54.059Z","dueDate":"2025-07-10T02:43:54.059Z","returnDate":null,"status":"active","createdAt":"2025-06-26T02:43:54.059Z","updatedAt":"2025-06-26T02:43:54.059Z"},"message":"Book borrowed successfully"}
```

### Return a Book

```bash
curl -X POST http://localhost:3000/api/return \
  -H "Content-Type: application/json" \
  -d '{
    "borrowId":"c051564d-de92-4824-8813-05ca5e4df8ff"
  }'
```

```bash
{"success":true,"data":{"id":"c051564d-de92-4824-8813-05ca5e4df8ff","userId":"e80194b5-c236-46f0-a7f6-bf112ceb2054","bookId":"bdf2529c-b42a-46ee-b888-0be48a2945d9","borrowDate":"2025-06-26T02:43:54.059Z","dueDate":"2025-07-10T02:43:54.059Z","returnDate":"2025-06-26T02:44:46.883Z","status":"returned","createdAt":"2025-06-26T02:43:54.059Z","updatedAt":"2025-06-26T02:44:46.883Z"},"message":"Book returned successfully"}
```

### Search Books

```bash
curl -X GET "http://localhost:3000/api/books/search?q=gatsby&page=1&limit=10"
```

```bash
curl -X GET "http://localhost:3000/api/books/search?q=1984"

{"success":true,"data":[{"id":"bdf2529c-b42a-46ee-b888-0be48a2945d9","title":"1984","authorId":"a3234567-89ab-cdef-0123-456789abcdef","isbn":"978-0-452-28423-4","genre":"Dystopian Fiction","publicationDate":"1949-06-08","available":true,"createdAt":"2025-06-26T02:40:50.447Z","updatedAt":"2025-06-26T02:44:46.884Z"}],"pagination":{"currentPage":1,"totalPages":1,"totalItems":1,"itemsPerPage":10,"hasNext":false,"hasPrev":false},"message":"Found 1 books matching \"1984\""}
```

### Create a User

```bash
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"name":"John Doe","email":"johndoe123@example.com","phone":"+1234567890"}'
```

```bash
{"success":true,"data":{"id":"e80194b5-c236-46f0-a7f6-bf112ceb2054","name":"John Doe","email":"johndoe123@example.com","phone":"+1234567890","membershipDate":"2025-06-26","createdAt":"2025-06-26T02:43:32.946Z","updatedAt":"2025-06-26T02:43:32.946Z"},"message":"User created successfully"}
```

## 🔒 HTTP Status Codes

The API uses standard HTTP status codes:

- `200` - OK (successful GET, PUT requests)
- `201` - Created (successful POST requests)
- `204` - No Content (successful DELETE requests)
- `400` - Bad Request (validation errors, invalid data)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resources, business logic violations)
- `500` - Internal Server Error (unexpected server errors)

## ⚠️ Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "fieldName",
    "value": "invalidValue"
  }
}
```

## 🧪 Testing

### Using Postman

1. Import the Postman collection from `/docs/Book-Library-API.postman_collection.json`
2. Set up environment variables in Postman
3. Run the collection to test all endpoints

### Manual Testing

Use the interactive Swagger UI at <http://localhost:3000/api-docs> to test endpoints directly in your browser.

## 📁 Project Structure

```sh
book-library-api/
├── src/
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Data models
│   ├── routes/            # Route definitions
│   ├── services/          # Business logic
│   └── app.js             # Express app configuration
├── docs/                  # Documentation files
├── server.js              # Server entry point
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
└── README.md              # This file
```

## 🏗️ Architecture

The API follows a layered architecture:

1. **Routes** - Define endpoints and validate requests
2. **Controllers** - Handle HTTP requests/responses
3. **Services** - Implement business logic
4. **Models** - Define data structures
5. **Middleware** - Handle cross-cutting concerns

## 🔄 Data Flow

1. Client makes HTTP request
2. Route validation middleware validates input
3. Controller processes request
4. Service implements business logic
5. Model handles data operations
6. Response sent back to client

## 🎯 REST Principles Adherence

- **Resource-based URLs**: `/api/books`, `/api/authors`, `/api/users`
- **HTTP methods**: GET, POST, PUT, DELETE for CRUD operations
- **Stateless**: Each request contains all necessary information
- **Uniform interface**: Consistent response formats and error handling
- **HATEOAS**: Links provided in responses (where applicable)

## 🔧 Configuration

Environment variables in `.env`:

```env
PORT=3000
NODE_ENV=development
API_BASE_URL=http://localhost:3000
```

## 🚀 Deployment

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## 📚 Sample Data

The API comes with pre-loaded sample data:

- 3 sample authors
- 3 sample books
- 3 sample users

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please create an issue on the repository or contact the development team.

---

## **Happy coding! 📚✨**
