# Book Library RESTful API

A comprehensive RESTful API for managing a book library system, built following industry best practices and REST principles. This project demonstrates a complete evolution from in-memory storage to MongoDB, showcasing modern Node.js architecture patterns.

## 🎯 Project Overview

### Current Implementation (MongoDB-Based)

**Production-Ready Features:**

- 🏗️ **Modern Architecture**: Layered design (Routes → Controllers → Services → Models)
- 🗄️ **MongoDB Integration**: Full persistence with Mongoose ODM
- 🔗 **Data Relationships**: Proper foreign key relationships between entities
- 📊 **Real-Time Availability**: Dynamic book availability tracking
- 🔍 **Advanced Search**: Full-text search across books, authors, and users
- 📈 **Analytics**: Borrowing statistics and user engagement metrics
- 🛡️ **Data Validation**: Comprehensive input validation and error handling
- 📚 **Complete Documentation**: Interactive Swagger UI and Postman collection

### Legacy Implementation (Reference)

The project initially used in-memory Maps with UUIDs, providing a complete working API that has been successfully migrated to MongoDB while maintaining full backward compatibility.

## 🚀 Features & Capabilities

### Core API Features ✅

- ✅ **Complete CRUD Operations** for Books, Authors, Users, and Borrow Records
- ✅ **MongoDB Persistence** with Mongoose ODM and proper schema validation
- ✅ **RESTful Design** following HTTP standards and best practices
- ✅ **Data Relationships** with foreign key constraints and referential integrity
- ✅ **Interactive Documentation** via Swagger/OpenAPI 3.0
- ✅ **Postman Collection** with comprehensive test scenarios

### Advanced Functionality ✅

- ✅ **Smart Search & Filtering** across all entities with MongoDB text indexes
- ✅ **Pagination Support** with configurable page sizes and offset
- ✅ **Borrowing System** with availability tracking and due date management
- ✅ **User History Tracking** for borrowing patterns and analytics
- ✅ **Overdue Management** with automatic status updates
- ✅ **Statistics Dashboard** showing system usage and trends

### Business Logic & Rules ✅

- ✅ **Availability Tracking**: Real-time book availability with borrowing status
- ✅ **Duplicate Prevention**: Users cannot borrow the same book multiple times
- ✅ **Due Date Management**: 14-day default with extension capabilities
- ✅ **Data Integrity**: Unique constraints on ISBN, author email, user email
- ✅ **Error Handling**: Meaningful error messages with proper HTTP status codes
- ✅ **Validation**: Comprehensive input validation with detailed feedback

## 🛠️ Technology Stack

**Backend & Framework:**

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js (v4.18+)
- **Database**: MongoDB with Mongoose ODM (v7+)
- **Validation**: express-validator
- **Security**: Helmet, CORS

**Documentation & Testing:**

- **API Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Postman Collection
- **Logging**: Morgan (HTTP request logger)
- **Development**: Nodemon (auto-restart)

**Database Features:**

- **Schemas**: Mongoose with validation and relationships
- **Indexes**: Optimized for search and performance
- **Constraints**: Unique fields and referential integrity
- **Migrations**: Automated schema management

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **MongoDB** access (Atlas cloud or local instance)
- **Git** for cloning the repository

## 🔧 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd book-library-api

# Install dependencies
npm install
```

### 2. Database Setup

Choose one of the following MongoDB options:

#### **Option A: MongoDB Atlas (Recommended)**

1. Create a free account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string from the "Connect" button

#### **Option B: Local MongoDB**

```bash
# Install MongoDB locally (Ubuntu/Debian)
sudo apt-get install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verify installation
mongo --version
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
nano .env
```

**Required Environment Variables:**

```env
# Server Configuration
NODE_ENV=development
PORT=3001

# MongoDB Configuration (choose one)
# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/book-library

# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/book-library

# Optional: Database Name
DB_NAME=book-library
```

### 4. Database Initialization

```bash
# Run database migrations (creates indexes and schema)
npm run migrate

# Seed the database with sample data
npm run seed

# Verify database setup
npm run db-status
```

### 5. Start the Application

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

**The API will be available at:**

- **API Base URL**: <http://localhost:3001/api>
- **Swagger Documentation**: <http://localhost:3001/api-docs>
- **Health Check**: <http://localhost:3001/health>

## 🔍 API Documentation & Testing

### Interactive Documentation

Visit the **Swagger UI** at <http://localhost:3001/api-docs> for:

- Complete API reference with all endpoints
- Interactive testing interface
- Request/response schemas
- Authentication examples
- Real-time API exploration

### Postman Collection

Import the Postman collection from `docs/Book-Library-API.postman_collection.json`:

1. Open Postman
2. Import → Upload Files → Select the collection file
3. Set environment variable `baseUrl` to `http://localhost:3001`
4. Run the complete test suite

## 📚 API Reference

### Core Endpoints

| Category      | Method | Endpoint                  | Description                      |
| ------------- | ------ | ------------------------- | -------------------------------- |
| **Health**    | GET    | `/health`                 | Service health status            |
| **Authors**   | GET    | `/api/authors`            | List all authors with pagination |
| **Authors**   | POST   | `/api/authors`            | Create new author                |
| **Authors**   | GET    | `/api/authors/{id}`       | Get author by ID                 |
| **Authors**   | PUT    | `/api/authors/{id}`       | Update author                    |
| **Authors**   | DELETE | `/api/authors/{id}`       | Delete author                    |
| **Books**     | GET    | `/api/books`              | List all books with search       |
| **Books**     | POST   | `/api/books`              | Create new book                  |
| **Books**     | GET    | `/api/books/{id}`         | Get book by ID                   |
| **Books**     | PUT    | `/api/books/{id}`         | Update book                      |
| **Books**     | DELETE | `/api/books/{id}`         | Delete book                      |
| **Users**     | GET    | `/api/users`              | List all users                   |
| **Users**     | POST   | `/api/users`              | Create new user                  |
| **Users**     | GET    | `/api/users/{id}`         | Get user by ID                   |
| **Users**     | PUT    | `/api/users/{id}`         | Update user                      |
| **Users**     | DELETE | `/api/users/{id}`         | Delete user                      |
| **Borrowing** | POST   | `/api/borrow`             | Borrow a book                    |
| **Borrowing** | POST   | `/api/return`             | Return a book                    |
| **Borrowing** | GET    | `/api/borrow/records`     | Get borrow records               |
| **Borrowing** | PUT    | `/api/borrow/{id}/extend` | Extend due date                  |

### Real API Examples

_The following examples use real requests and responses from our comprehensive API testing:_

#### 1. Create Author

**Request:**

```bash
curl -X POST http://localhost:3001/api/authors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Isaac Asimov",
    "email": "isaac.asimov@authors.com",
    "biography": "American science fiction author and biochemist."
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "6757d9df2043b4c2e5dc6c89",
    "name": "Isaac Asimov",
    "email": "isaac.asimov@authors.com",
    "biography": "American science fiction author and biochemist.",
    "books": [],
    "createdAt": "2024-12-10T10:30:07.542Z",
    "updatedAt": "2024-12-10T10:30:07.542Z"
  },
  "message": "Author created successfully"
}
```

#### 2. Create Book

**Request:**

```bash
curl -X POST http://localhost:3001/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Caves of Steel",
    "isbn": "978-0553293395",
    "author": "6757d9df2043b4c2e5dc6c89",
    "genre": "Science Fiction",
    "publishedYear": 1954,
    "availableCopies": 3
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "6757da422043b4c2e5dc6c8f",
    "title": "The Caves of Steel",
    "isbn": "978-0553293395",
    "author": {
      "_id": "6757d9df2043b4c2e5dc6c89",
      "name": "Isaac Asimov",
      "email": "isaac.asimov@authors.com"
    },
    "genre": "Science Fiction",
    "publishedYear": 1954,
    "totalCopies": 3,
    "availableCopies": 3,
    "isAvailable": true,
    "createdAt": "2024-12-10T10:31:46.991Z",
    "updatedAt": "2024-12-10T10:31:46.991Z"
  },
  "message": "Book created successfully"
}
```

#### 3. Create User

**Request:**

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-123-4567"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "6757d8622043b4c2e5dc6c7f",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-123-4567",
    "membershipDate": "2024-12-10T10:25:22.891Z",
    "createdAt": "2024-12-10T10:25:22.891Z",
    "updatedAt": "2024-12-10T10:25:22.891Z"
  },
  "message": "User created successfully"
}
```

#### 4. Borrow Book

**Request:**

```bash
curl -X POST http://localhost:3001/api/borrow \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "6757d8622043b4c2e5dc6c7f",
    "bookId": "6757da422043b4c2e5dc6c8f"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "6757dbb62043b4c2e5dc6c97",
    "user": {
      "_id": "6757d8622043b4c2e5dc6c7f",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "book": {
      "_id": "6757da422043b4c2e5dc6c8f",
      "title": "The Caves of Steel",
      "author": "Isaac Asimov"
    },
    "borrowDate": "2024-12-10T10:38:14.045Z",
    "dueDate": "2024-12-24T10:38:14.045Z",
    "status": "borrowed",
    "createdAt": "2024-12-10T10:38:14.049Z",
    "updatedAt": "2024-12-10T10:38:14.049Z"
  },
  "message": "Book borrowed successfully"
}
```

#### 5. Return Book

**Request:**

```bash
curl -X 'POST' \
  'http://localhost:3001/api/return' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "borrowId": "68ab88b73d89082f99345d0c"
}'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "6757dbb62043b4c2e5dc6c97",
    "user": "6757d8622043b4c2e5dc6c7f",
    "book": "6757da422043b4c2e5dc6c8f",
    "borrowDate": "2024-12-10T10:38:14.045Z",
    "dueDate": "2024-12-24T10:38:14.045Z",
    "returnDate": "2024-12-10T10:44:46.883Z",
    "status": "returned",
    "createdAt": "2024-12-10T10:38:14.049Z",
    "updatedAt": "2024-12-10T10:44:46.883Z"
  },
  "message": "Book returned successfully"
}
```

#### 6. Search Books

**Request:**

```bash
curl "http://localhost:3001/api/books?search=caves&genre=Science%20Fiction&page=1&limit=10"
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "6757da422043b4c2e5dc6c8f",
      "title": "The Caves of Steel",
      "isbn": "978-0553293395",
      "author": {
        "_id": "6757d9df2043b4c2e5dc6c89",
        "name": "Isaac Asimov"
      },
      "genre": "Science Fiction",
      "publishedYear": 1954,
      "availableCopies": 3,
      "isAvailable": true
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "message": "Books retrieved successfully"
}
```

#### 7. Error Handling Example

**Request (Duplicate Email):**

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890"
  }'
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

## 🗄️ Database Schema

The API uses MongoDB with Mongoose ODM. The database consists of four main collections:

### Authors Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  biography: String,
  birthDate: Date,
  nationality: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Books Collection

```javascript
{
  _id: ObjectId,
  title: String (required),
  isbn: String (required, unique),
  author: ObjectId (ref: 'Author', required),
  publishedDate: Date,
  genre: String,
  pages: Number,
  description: String,
  copiesAvailable: Number (default: 1),
  totalCopies: Number (default: 1),
  language: String (default: 'English'),
  publisher: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  membershipDate: Date (default: now),
  createdAt: Date,
  updatedAt: Date
}
```

### BorrowRecords Collection

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  book: ObjectId (ref: 'Book', required),
  borrowDate: Date (default: now),
  dueDate: Date (required),
  returnDate: Date,
  status: String (enum: ['borrowed', 'returned', 'overdue'], default: 'borrowed'),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔍 Query Parameters

### Pagination

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

### Sorting

- `sort` - Sort field (prefix with `-` for descending order)
  - Books: `title`, `genre`, `publishedYear`, `createdAt`
  - Authors: `name`, `email`, `birthDate`, `createdAt`
  - Users: `name`, `email`, `membershipDate`, `createdAt`

### Filtering

- `search` - Search query (full-text search across relevant fields)
- `genre` - Filter books by genre
- `author` - Filter books by author ID
- `available` - Filter books by availability (true/false)
- `status` - Filter borrow records by status (borrowed/returned/overdue)

## 🧪 Testing & Development

### Development Scripts

```bash
# Development with auto-reload
npm run dev

# Production server
npm start

# Database operations
npm run migrate      # Run migrations
npm run seed        # Seed sample data
npm run db:status   # Check database status

# Code quality
npm run lint        # Check code style
npm run lint:fix    # Fix linting issues
npm run format      # Format code
```

### Project Structure

```text
book-library-api/
├── src/
│   ├── config/         # Database and app configuration
│   ├── models/         # Mongoose schemas
│   ├── services/       # Business logic layer
│   ├── controllers/    # Request handlers
│   ├── routes/         # API route definitions
│   ├── middleware/     # Custom middleware
│   └── app.js         # Express app configuration
├── scripts/
│   ├── migrate.js     # Database migration script
│   └── seed.js        # Data seeding script
├── docs/
│   ├── postman/       # Postman collection
│   └── examples/      # API usage examples
└── server.js          # Application entry point
```

## ⚙️ Configuration

### Environment Variables

| Variable      | Default                                  | Description               |
| ------------- | ---------------------------------------- | ------------------------- |
| `NODE_ENV`    | `development`                            | Application environment   |
| `PORT`        | `3001`                                   | Server port               |
| `MONGODB_URI` | `mongodb://localhost:27017/book-library` | MongoDB connection string |
| `DB_NAME`     | `book-library`                           | Database name             |

### MongoDB Connection Examples

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/book-library

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/book-library

# MongoDB with authentication
MONGODB_URI=mongodb://username:password@localhost:27017/book-library
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

## 🚀 Deployment (...in progress)

### Using Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t book-library-api .
docker run -p 3001:3001 -e MONGODB_URI=your-connection-string book-library-api
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**

   ```bash
   # Check MongoDB status
   mongosh --eval "db.runCommand('ping')"

   # Verify connection string
   echo $MONGODB_URI
   ```

2. **Port Already in Use**

   ```bash
   # Find process using port 3001
   lsof -i :3001

   # Kill process
   kill -9 <PID>
   ```

3. **Validation Errors**
   - Check request body format
   - Verify required fields
   - Ensure ObjectId format for references

## 📈 Legacy Implementation (In-Memory Maps)

### Historical Context

The project originally used in-memory Maps for data storage during Phase 1:

**Features:**

- **Rapid Prototyping**: No database setup required
- **UUID Identification**: Universally unique identifiers
- **Complete CRUD**: Full REST API functionality
- **Development Focus**: Pure API design principles

**Limitations:**

- **No Persistence**: Data lost on server restart
- **No Scalability**: Single instance limitation
- **No Relationships**: Limited data modeling
- **Memory Constraints**: RAM-based storage limits

**Migration Benefits:**

- **Data Persistence**: Permanent data storage
- **Scalability**: Production-ready architecture
- **Rich Relationships**: Complex data modeling
- **Performance**: Optimized queries and indexing

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes and test thoroughly**
4. **Run linting**: `npm run lint:fix`
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open Pull Request**

### Code Standards

- Follow **RESTful API principles**
- Use **async/await** for asynchronous operations
- Include **comprehensive error handling**
- Add **JSDoc comments** for functions
- Follow **MongoDB naming conventions**
- Write **meaningful commit messages**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Express.js** for the robust web framework
- **MongoDB** and **Mongoose** for excellent database tools
- **Swagger UI** for interactive API documentation
- **Node.js Community** for extensive package ecosystem

## 📞 Support & Contact

For questions, issues, or contributions:

- **Issues**: [GitHub Issues](repository-url/issues)
- **API Documentation**: <http://localhost:3001/api-docs>
- **Postman Collection**: `docs/Book-Library-API.postman_collection.json`

## 📚 Additional Documentation

- **[Project Development Journey](PROJECT_DEVELOPMENT_JOURNEY.md)** - Complete development process documentation
- **[Error Handling Examples](docs/error-handling-examples.md)** - Comprehensive error scenarios and responses
- **[Testing Report](docs/TESTING_REPORT.md)** - Detailed testing and troubleshooting documentation
- **[Migration Summary](docs/MIGRATION_SUMMARY.md)** - MongoDB migration process and decisions

## 🎯 Project Status

✅ **COMPLETED** - All deliverables have been successfully implemented and tested.

---

- **Built with ❤️ by [Ayomide Kayode](https://x.com/Ayomide_KayoDev) using Node.js, Express.js, and MongoDB**
