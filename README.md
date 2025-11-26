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

### 🏥 Routine Health Check Commands

Use these commands to perform comprehensive health checks and verify all endpoints are working correctly:

#### **1. Start the Server**

```bash
# Start server in background
nohup npm start > server.log 2>&1 &

# Or start in development mode
npm run dev
```

#### **2. Basic Health Check**

```bash
echo "🏥 Testing Health Endpoint..." && curl -s http://localhost:3001/health | head -200
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Book Library API is running",
  "timestamp": "2025-11-26T15:37:13.727Z",
  "version": "1.0.0"
}
```

#### **3. Authors Endpoint Testing**

```bash
echo "👤 Testing Authors Endpoint..." && curl -s "http://localhost:3001/api/authors?limit=5" | npx json
```

**Expected Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "685fd756ae5c4d390d769f94",
      "name": "Agatha Christie",
      "email": "agatha.christie@mystery.com",
      "biography": "English writer known for her detective novels...",
      "birthDate": "1890-09-15T00:00:00.000Z",
      "nationality": "British",
      "books": [
        {
          "_id": "685fd756ae5c4d390d769fb3",
          "title": "Murder on the Orient Express",
          "isbn": "9780007119318",
          "genre": "Mystery"
        }
      ]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 15,
    "itemsPerPage": 5
  }
}
```

#### **4. Books Endpoint Testing**

```bash
echo "📚 Testing Books Endpoint..." && curl -s "http://localhost:3001/api/books?limit=5" | npx json
```

**Expected Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "685fd756ae5c4d390d769fb0",
      "title": "A Clash of Kings",
      "authorId": "685fd756ae5c4d390d769f92",
      "isbn": "9780553108033",
      "genre": "Fantasy",
      "publicationDate": "1999-02-02T00:00:00.000Z",
      "available": true,
      "description": "The second book in A Song of Ice and Fire series.",
      "pages": 761,
      "language": "English",
      "publisher": "Bantam Spectra",
      "author": {
        "_id": "685fd756ae5c4d390d769f92",
        "name": "George R.R. Martin",
        "email": "grrm@winterfell.com",
        "nationality": "American"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 7,
    "totalItems": 33,
    "itemsPerPage": 5
  }
}
```

#### **5. Users Endpoint Testing**

```bash
echo "👥 Testing Users Endpoint..." && curl -s "http://localhost:3001/api/users?limit=3" | npx json
```

**Expected Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "685fd756ae5c4d390d769fa6",
      "name": "Adaora Okafor",
      "email": "adaora.okafor@gmail.com",
      "phone": "+234-803-123-4567",
      "membershipDate": "2023-06-10T00:00:00.000Z",
      "address": {
        "street": "15 Victoria Island Road",
        "city": "Lagos",
        "state": "Lagos",
        "zipCode": "101001",
        "country": "Nigeria"
      },
      "preferences": {
        "notifications": {
          "email": true,
          "sms": false,
          "reminders": true
        },
        "favoriteGenres": [],
        "language": "English"
      },
      "status": "active",
      "__v": 0,
      "createdAt": "2025-06-28T11:51:50.733Z",
      "updatedAt": "2025-06-28T11:51:50.733Z",
      "borrowRecords": []
    },
    {
      "_id": "685fd756ae5c4d390d769fa1",
      "name": "Alice Johnson",
      "email": "alice.johnson@email.com",
      "phone": "+1-555-0101",
      "membershipDate": "2023-01-15T00:00:00.000Z",
      "address": {
        "street": "123 Library St",
        "city": "Booktown",
        "state": "Reading",
        "zipCode": "12345",
        "country": "USA"
      },
      "preferences": {
        "notifications": {
          "email": true,
          "sms": false,
          "reminders": true
        },
        "favoriteGenres": [],
        "language": "English"
      },
      "status": "active",
      "__v": 0,
      "createdAt": "2025-06-28T11:51:50.731Z",
      "updatedAt": "2025-06-28T11:51:50.731Z",
      "borrowRecords": [
        {
          "_id": "685fd757ae5c4d390d769fce",
          "userId": "685fd756ae5c4d390d769fa1",
          "bookId": "685fd756ae5c4d390d769fb0",
          "borrowDate": "2025-06-21T11:51:51.151Z",
          "dueDate": "2025-07-05T11:51:51.151Z",
          "status": "returned",
          "renewalCount": 0,
          "fineAmount": 2550,
          "finePaid": false,
          "__v": 0,
          "createdAt": "2025-06-28T11:51:51.154Z",
          "updatedAt": "2025-08-24T21:21:06.787Z",
          "returnDate": "2025-08-24T21:21:06.785Z"
        }
      ]
    },
    {
      "_id": "685fd756ae5c4d390d769fa8",
      "name": "Amina Hassan",
      "email": "amina.hassan@hotmail.com",
      "phone": "+254-722-345-678",
      "membershipDate": "2023-08-05T00:00:00.000Z",
      "address": {
        "street": "78 Uhuru Highway",
        "city": "Nairobi",
        "state": "Nairobi",
        "zipCode": "00100",
        "country": "Kenya"
      },
      "preferences": {
        "notifications": {
          "email": true,
          "sms": false,
          "reminders": true
        },
        "favoriteGenres": [],
        "language": "English"
      },
      "status": "active",
      "__v": 0,
      "createdAt": "2025-06-28T11:51:50.733Z",
      "updatedAt": "2025-06-28T11:51:50.733Z",
      "borrowRecords": [
        {
          "_id": "685fdfae08aea8e70fd259f7",
          "userId": "685fd756ae5c4d390d769fa8",
          "bookId": "685fd756ae5c4d390d769fb6",
          "dueDate": "2025-07-12T12:27:26.954Z",
          "status": "returned",
          "renewalCount": 0,
          "fineAmount": 2200,
          "finePaid": false,
          "borrowDate": "2025-06-28T12:27:26.971Z",
          "createdAt": "2025-06-28T12:27:26.993Z",
          "updatedAt": "2025-08-24T21:08:45.798Z",
          "__v": 0,
          "returnDate": "2025-08-24T21:08:45.788Z"
        }
      ]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 4,
    "totalItems": 12,
    "itemsPerPage": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "message": "Users retrieved successfully"
}
```

#### **6. Borrow Records Testing**

```bash
echo "📋 Testing Borrow Records Endpoint..." && curl -s "http://localhost:3001/api/borrow-records?limit=2" | npx json
```

**Expected Response:**

```json
Testing Borrow Records Endpoint...
{
  "success": true,
  "data": [
    {
      "_id": "68ab88b73d89082f99345d0c",
      "userId": "685fd756ae5c4d390d769fa4",
      "bookId": "685fd756ae5c4d390d769fb5",
      "dueDate": "2025-09-07T21:48:39.887Z",
      "status": "returned",
      "renewalCount": 0,
      "fineAmount": 1050,
      "finePaid": false,
      "borrowDate": "2025-08-24T21:48:39.887Z",
      "createdAt": "2025-08-24T21:48:39.888Z",
      "updatedAt": "2025-09-28T21:49:15.087Z",
      "__v": 0,
      "returnDate": "2025-09-28T21:49:15.085Z",
      "book": {
        "_id": "685fd756ae5c4d390d769fb5",
        "title": "Foundation",
        "isbn": "9780553293357"
      },
      "user": {
        "_id": "685fd756ae5c4d390d769fa4",
        "name": "David Wilson",
        "email": "david.wilson@email.com"
      }
    },
    {
      "_id": "68ab88143d89082f99345d02",
      "userId": "685fd756ae5c4d390d769fab",
      "bookId": "685fd756ae5c4d390d769faf",
      "dueDate": "2025-09-07T21:45:56.498Z",
      "status": "returned",
      "renewalCount": 0,
      "fineAmount": 1050,
      "finePaid": false,
      "borrowDate": "2025-08-24T21:45:56.502Z",
      "createdAt": "2025-08-24T21:45:56.511Z",
      "updatedAt": "2025-09-28T21:51:53.322Z",
      "__v": 0,
      "returnDate": "2025-09-28T21:51:53.320Z",
      "book": {
        "_id": "685fd756ae5c4d390d769faf",
        "title": "A Game of Thrones",
        "isbn": "9780553103540"
      },
      "user": {
        "_id": "685fd756ae5c4d390d769fab",
        "name": "Fatoumata Keita",
        "email": "fatoumata.keita@gmail.com"
      }
    },
    {
      "_id": "685fe19b08aea8e70fd25a01",
      "userId": "685fd756ae5c4d390d769fa5",
      "bookId": "685fd756ae5c4d390d769fbb",
      "dueDate": "2025-07-12T12:35:39.625Z",
      "status": "returned",
      "renewalCount": 0,
      "fineAmount": 2200,
      "finePaid": false,
      "borrowDate": "2025-06-28T12:35:39.626Z",
      "createdAt": "2025-06-28T12:35:39.626Z",
      "updatedAt": "2025-08-24T21:10:05.983Z",
      "__v": 0,
      "returnDate": "2025-08-24T21:10:05.982Z",
      "book": {
        "_id": "685fd756ae5c4d390d769fbb",
        "title": "Death and the King's Horseman",
        "isbn": "9780393312836"
      },
      "user": {
        "_id": "685fd756ae5c4d390d769fa5",
        "name": "Emma Brown",
        "email": "emma.brown@email.com"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 7,
    "itemsPerPage": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "message": "Borrow records retrieved successfully"
}
```

#### **7. Search Functionality Testing**

```bash
echo "🔍 Testing Specific Author search by name..." && curl -s "http://localhost:3001/api/authors/search?q=Thiongo" | npx json
```

**Expected Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "685fd756ae5c4d390d769f9a",
      "name": "Ngugi wa Thiongo",
      "email": "ngugi.thiongo@literature.ke",
      "biography": "Kenyan author and academic who writes primarily in Gikuyu. Known for novels like Weep Not, Child and A Grain of Wheat.",
      "birthDate": "1938-01-05T00:00:00.000Z",
      "nationality": "Kenyan",
      "awards": [],
      "__v": 0,
      "createdAt": "2025-06-28T11:51:50.493Z",
      "updatedAt": "2025-06-28T11:51:50.493Z",
      "books": [
        {
          "_id": "685fd756ae5c4d390d769fc2",
          "title": "A Grain of Wheat",
          "authorId": "685fd756ae5c4d390d769f9a",
          "isbn": "9780435905217",
          "genre": "Literary Fiction",
          "publicationDate": "1967-01-01T00:00:00.000Z",
          "available": true,
          "description": "A novel set during the final days of British colonial rule in Kenya.",
          "pages": 264,
          "language": "English",
          "publisher": "Heinemann",
          "__v": 0,
          "createdAt": "2025-06-28T11:51:50.967Z",
          "updatedAt": "2025-06-28T11:51:50.967Z"
        },
        {
          "_id": "685fd756ae5c4d390d769fc1",
          "title": "Weep Not, Child",
          "authorId": "685fd756ae5c4d390d769f9a",
          "isbn": "9780435905200",
          "genre": "Literary Fiction",
          "publicationDate": "1964-01-01T00:00:00.000Z",
          "available": true,
          "description": "A novel about a young Kenyan boy's experiences during the Mau Mau uprising.",
          "pages": 154,
          "language": "English",
          "publisher": "Heinemann",
          "__v": 0,
          "createdAt": "2025-06-28T11:51:50.967Z",
          "updatedAt": "2025-06-28T11:51:50.967Z"
        }
      ]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 10,
    "hasNext": false,
    "hasPrev": false
  },
  "message": "Found 1 authors matching \"Thiongo\""
}
```

#### **8. Error Handling Testing**

```bash
echo "⚠️ Testing Error Handling..." && curl -s "http://localhost:3001/api/books/invalid-id" | npx json
```

**Expected Error Response:**

```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "id",
      "message": "Invalid ObjectId format"
    }
  ]
}
```

#### **9. Statistics Testing**

```bash
echo "📊 Testing Statistics..." && curl -s "http://localhost:3001/api/borrow-stats" | npx json
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "totalBorrows": 7,
    "activeBorrows": 0,
    "returnedBorrows": 7,
    "overdueBorrows": 0,
    "lostBorrows": 0,
    "monthlyBorrows": {
      "2025-08": 2,
      "2025-06": 4,
      "2025-05": 1
    }
  },
  "message": "Borrow statistics retrieved successfully"
}
```

#### **10. Overdue Testing**

```bash
echo "📊 Testing Overdue Books..." && curl -s "http://localhost:3001/api/overdue-books" | npx json
```

**Expected Response:**

```json
Testing Overdue Books Endpoint...
{
  "success": true,
  "data": [],
  "message": "Overdue books retrieved successfully"
}
```

#### **11. Comprehensive Health Check Script**

Create a comprehensive health check script:

```bash
# Create health-check.sh
cat > health-check.sh << 'EOF'
#!/bin/bash

echo "🏥 === BOOK LIBRARY API HEALTH CHECK ==="
echo ""

# Check if server is running
echo "1️⃣ Checking Server Status..."
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ Server is running on port 3001"
else
    echo "❌ Server is not responding on port 3001"
    exit 1
fi

echo ""
echo "2️⃣ Testing Core Endpoints..."

# Test Authors
AUTHORS_COUNT=$(curl -s "http://localhost:3001/api/authors?limit=1" | npx json pagination.totalItems)
echo "   📚 Authors: $AUTHORS_COUNT total"

# Test Books
BOOKS_COUNT=$(curl -s "http://localhost:3001/api/books?limit=1" | npx json pagination.totalItems)
echo "   📖 Books: $BOOKS_COUNT total"

# Test Users
USERS_COUNT=$(curl -s "http://localhost:3001/api/users?limit=1" | npx json pagination.totalItems)
echo "   👥 Users: $USERS_COUNT total"

# Test Borrow Records
BORROWS_COUNT=$(curl -s "http://localhost:3001/api/borrow-records?limit=1" | npx json pagination.totalItems)
echo "   📋 Borrow Records: $BORROWS_COUNT total"

echo ""
echo "3️⃣ Testing Search Functionality..."
SEARCH_RESULTS=$(curl -s "http://localhost:3001/api/books?search=dream&limit=1" | npx json pagination.totalItems)
echo "   🔍 Search Results: $SEARCH_RESULTS found for 'dream'"

echo ""
echo "✅ Health Check Complete - All Systems Operational!"
EOF

# Make executable and run
chmod +x health-check.sh
./health-check.sh
```

#### **Quick Database Counts Check**

```bash
echo "📊 Database Summary:"
echo "Authors: $(curl -s 'http://localhost:3001/api/authors?limit=1' | grep -o '"totalItems":[0-9]*' | cut -d: -f2)"
echo "Books: $(curl -s 'http://localhost:3001/api/books?limit=1' | grep -o '"totalItems":[0-9]*' | cut -d: -f2)"
echo "Users: $(curl -s 'http://localhost:3001/api/users?limit=1' | grep -o '"totalItems":[0-9]*' | cut -d: -f2)"
echo "Borrow Records: $(curl -s 'http://localhost:3001/api/borrow-records?limit=1' | grep -o '"totalItems":[0-9]*' | cut -d: -f2)"
```

#### **Monitoring Server Logs**

```bash
# View live server logs
tail -f server.log

# Check for errors in logs
grep -i error server.log

# Check MongoDB connection status
grep -i "mongodb" server.log
```

### **Health Check Prerequisites**

Before running health checks, ensure you have:

```bash
# Install npx if not available (for JSON formatting)
npm install -g npx

# Alternative: install jq for JSON formatting
sudo apt install jq  # Ubuntu/Debian
brew install jq      # macOS

# Use jq instead of npx json
curl -s "http://localhost:3001/api/books?limit=2" | jq
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
