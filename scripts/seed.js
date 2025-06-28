import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

// Import models
import Author from '../src/models/Author.js';
import Book from '../src/models/Book.js';
import User from '../src/models/User.js';
import BorrowRecord from '../src/models/BorrowRecord.js';

// Connect to MongoDB
async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

// Sample data
const authorsData = [
  {
    name: 'J.K. Rowling',
    email: 'jk.rowling@hogwarts.com',
    biography: 'British author best known for the Harry Potter series.',
    birthDate: new Date('1965-07-31'),
    nationality: 'British',
  },
  {
    name: 'George R.R. Martin',
    email: 'grrm@winterfell.com',
    biography:
      'American novelist and short story writer, best known for A Song of Ice and Fire.',
    birthDate: new Date('1948-09-20'),
    nationality: 'American',
  },
  {
    name: 'Stephen King',
    email: 'stephen.king@scary.com',
    biography:
      'American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels.',
    birthDate: new Date('1947-09-21'),
    nationality: 'American',
  },
  {
    name: 'Agatha Christie',
    email: 'agatha.christie@mystery.com',
    biography:
      'English writer known for her detective novels, particularly those featuring Hercule Poirot and Miss Marple.',
    birthDate: new Date('1890-09-15'),
    nationality: 'British',
  },
  {
    name: 'Isaac Asimov',
    email: 'isaac.asimov@foundation.com',
    biography:
      'American writer and professor of biochemistry, known for his works of science fiction and popular science.',
    birthDate: new Date('1920-01-02'),
    nationality: 'American',
  },
];

const usersData = [
  {
    name: 'Alice Johnson',
    email: 'alice.johnson@email.com',
    phone: '+1-555-0101',
    address: {
      street: '123 Library St',
      city: 'Booktown',
      state: 'Reading',
      zipCode: '12345',
      country: 'USA',
    },
    membershipDate: new Date('2023-01-15'),
  },
  {
    name: 'Bob Smith',
    email: 'bob.smith@email.com',
    phone: '+1-555-0102',
    address: {
      street: '456 Knowledge Ave',
      city: 'Learnville',
      state: 'Education',
      zipCode: '67890',
      country: 'USA',
    },
    membershipDate: new Date('2023-02-20'),
  },
  {
    name: 'Carol Davis',
    email: 'carol.davis@email.com',
    phone: '+1-555-0103',
    address: {
      street: '789 Wisdom Blvd',
      city: 'Studytown',
      state: 'Learning',
      zipCode: '54321',
      country: 'USA',
    },
    membershipDate: new Date('2023-03-10'),
  },
  {
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    phone: '+1-555-0104',
    address: {
      street: '321 Scholar Lane',
      city: 'Academyville',
      state: 'Knowledge',
      zipCode: '98765',
      country: 'USA',
    },
    membershipDate: new Date('2023-04-05'),
  },
  {
    name: 'Emma Brown',
    email: 'emma.brown@email.com',
    phone: '+1-555-0105',
    address: {
      street: '654 Literature Dr',
      city: 'Noveltown',
      state: 'Fiction',
      zipCode: '13579',
      country: 'USA',
    },
    membershipDate: new Date('2023-05-12'),
  },
];

// Books data (will be populated with author IDs after authors are created)
const getBooksData = (authors) => [
  {
    title: "Harry Potter and the Philosopher's Stone",
    isbn: '9780747532699',
    authorId: authors.find((a) => a.name === 'J.K. Rowling')._id,
    publicationDate: new Date('1997-06-26'),
    genre: 'Fantasy',
    pages: 223,
    description: 'The first book in the Harry Potter series.',
    copiesAvailable: 5,
    totalCopies: 5,
    language: 'English',
    publisher: 'Bloomsbury',
  },
  {
    title: 'Harry Potter and the Chamber of Secrets',
    isbn: '9780747538493',
    authorId: authors.find((a) => a.name === 'J.K. Rowling')._id,
    publicationDate: new Date('1998-07-02'),
    genre: 'Fantasy',
    pages: 251,
    description: 'The second book in the Harry Potter series.',
    copiesAvailable: 3,
    totalCopies: 3,
    language: 'English',
    publisher: 'Bloomsbury',
  },
  {
    title: 'A Game of Thrones',
    isbn: '9780553103540',
    authorId: authors.find((a) => a.name === 'George R.R. Martin')._id,
    publicationDate: new Date('1996-08-01'),
    genre: 'Fantasy',
    pages: 694,
    description: 'The first book in A Song of Ice and Fire series.',
    copiesAvailable: 2,
    totalCopies: 2,
    language: 'English',
    publisher: 'Bantam Spectra',
  },
  {
    title: 'A Clash of Kings',
    isbn: '9780553108033',
    authorId: authors.find((a) => a.name === 'George R.R. Martin')._id,
    publicationDate: new Date('1999-02-02'),
    genre: 'Fantasy',
    pages: 761,
    description: 'The second book in A Song of Ice and Fire series.',
    copiesAvailable: 1,
    totalCopies: 2,
    language: 'English',
    publisher: 'Bantam Spectra',
  },
  {
    title: 'The Shining',
    isbn: '9780385121675',
    authorId: authors.find((a) => a.name === 'Stephen King')._id,
    publicationDate: new Date('1977-01-28'),
    genre: 'Horror',
    pages: 447,
    description: 'A horror novel about a family trapped in an isolated hotel.',
    copiesAvailable: 4,
    totalCopies: 4,
    language: 'English',
    publisher: 'Doubleday',
  },
  {
    title: 'It',
    isbn: '9780670813025',
    authorId: authors.find((a) => a.name === 'Stephen King')._id,
    publicationDate: new Date('1986-09-15'),
    genre: 'Horror',
    pages: 1138,
    description: 'A horror novel about a monster that terrorizes children.',
    copiesAvailable: 2,
    totalCopies: 3,
    language: 'English',
    publisher: 'Viking',
  },
  {
    title: 'Murder on the Orient Express',
    isbn: '9780007119318',
    authorId: authors.find((a) => a.name === 'Agatha Christie')._id,
    publicationDate: new Date('1934-01-01'),
    genre: 'Mystery',
    pages: 256,
    description: 'A classic detective novel featuring Hercule Poirot.',
    copiesAvailable: 3,
    totalCopies: 3,
    language: 'English',
    publisher: 'Collins Crime Club',
  },
  {
    title: 'And Then There Were None',
    isbn: '9780007136834',
    authorId: authors.find((a) => a.name === 'Agatha Christie')._id,
    publicationDate: new Date('1939-11-06'),
    genre: 'Mystery',
    pages: 272,
    description: "Christie's best-selling mystery novel.",
    copiesAvailable: 4,
    totalCopies: 4,
    language: 'English',
    publisher: 'Collins Crime Club',
  },
  {
    title: 'Foundation',
    isbn: '9780553293357',
    authorId: authors.find((a) => a.name === 'Isaac Asimov')._id,
    publicationDate: new Date('1951-05-01'),
    genre: 'Science Fiction',
    pages: 244,
    description: 'The first book in the Foundation series.',
    copiesAvailable: 2,
    totalCopies: 2,
    language: 'English',
    publisher: 'Gnome Press',
  },
  {
    title: 'I, Robot',
    isbn: '9780553294385',
    authorId: authors.find((a) => a.name === 'Isaac Asimov')._id,
    publicationDate: new Date('1950-12-02'),
    genre: 'Science Fiction',
    pages: 253,
    description: 'A collection of nine science fiction short stories.',
    copiesAvailable: 3,
    totalCopies: 3,
    language: 'English',
    publisher: 'Gnome Press',
  },
];

// Function to clear existing data
async function clearData() {
  try {
    console.log('🧹 Clearing existing data...');
    await BorrowRecord.deleteMany({});
    await Book.deleteMany({});
    await User.deleteMany({});
    await Author.deleteMany({});
    console.log('✅ Existing data cleared');
  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
    throw error;
  }
}

// Function to seed authors
async function seedAuthors() {
  try {
    console.log('👤 Seeding authors...');
    const authors = await Author.insertMany(authorsData);
    console.log(`✅ Created ${authors.length} authors`);
    return authors;
  } catch (error) {
    console.error('❌ Error seeding authors:', error.message);
    throw error;
  }
}

// Function to seed users
async function seedUsers() {
  try {
    console.log('👥 Seeding users...');
    const users = await User.insertMany(usersData);
    console.log(`✅ Created ${users.length} users`);
    return users;
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    throw error;
  }
}

// Function to seed books
async function seedBooks(authors) {
  try {
    console.log('📚 Seeding books...');
    const booksData = getBooksData(authors);
    const books = await Book.insertMany(booksData);
    console.log(`✅ Created ${books.length} books`);
    return books;
  } catch (error) {
    console.error('❌ Error seeding books:', error.message);
    throw error;
  }
}

// Function to seed some borrow records (optional)
async function seedBorrowRecords(users, books) {
  try {
    console.log('📋 Seeding sample borrow records...');

    // Create some sample borrow records
    const borrowRecordsData = [
      {
        userId: users[0]._id, // Alice Johnson
        bookId: books[3]._id, // A Clash of Kings (1 available, 2 total)
        borrowDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'active',
      },
      {
        userId: users[1]._id, // Bob Smith
        bookId: books[5]._id, // It (2 available, 3 total)
        borrowDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
        status: 'active',
      },
      {
        userId: users[2]._id, // Carol Davis
        bookId: books[0]._id, // Harry Potter 1 (returned)
        borrowDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        dueDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000), // 16 days ago
        returnDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        status: 'returned',
      },
    ];

    const borrowRecords = await BorrowRecord.insertMany(borrowRecordsData);
    console.log(`✅ Created ${borrowRecords.length} borrow records`);

    return borrowRecords;
  } catch (error) {
    console.error('❌ Error seeding borrow records:', error.message);
    throw error;
  }
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    await connectDB();
    await clearData();

    const authors = await seedAuthors();
    const users = await seedUsers();
    const books = await seedBooks(authors);
    const borrowRecords = await seedBorrowRecords(users, books);

    console.log('\n📊 Seeding Summary:');
    console.log(`   Authors: ${authors.length}`);
    console.log(`   Users: ${users.length}`);
    console.log(`   Books: ${books.length}`);
    console.log(`   Borrow Records: ${borrowRecords.length}`);

    console.log('\n🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('\n💥 Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
