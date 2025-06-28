import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

// Import models to ensure schemas are registered
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

// Migration functions
async function createIndexes() {
  try {
    console.log('📇 Creating database indexes...');

    // Get all models
    const models = {
      Author,
      Book,
      User,
      BorrowRecord,
    };

    // Create indexes for each model with error handling
    for (const [modelName, model] of Object.entries(models)) {
      try {
        console.log(`🔄 Processing indexes for ${modelName}`);
        const collection = model.collection;

        // Get existing indexes
        const existingIndexes = await collection.indexes();

        // Drop all non-_id indexes
        for (const index of existingIndexes) {
          if (index.name !== '_id_') {
            try {
              await collection.dropIndex(index.name);
              console.log(`   🗑️  Dropped index: ${index.name}`);
            } catch (dropError) {
              if (dropError.code !== 27) {
                // 27 = IndexNotFound
                console.log(
                  `   ⚠️  Could not drop index ${index.name}: ${dropError.message}`
                );
              }
            }
          }
        }

        // Create indexes from schema definition with additional error handling
        try {
          await model.syncIndexes(); // This is more forgiving than createIndexes()
          console.log(`✅ ${modelName} indexes created successfully`);
        } catch (syncError) {
          console.log(
            `   ⚠️  Some indexes may not have been created: ${syncError.message}`
          );
          // Continue anyway
        }
        // Uncomment the line below if you want to create indexes explicitly
        // This can be useful if you want to ensure all indexes are created
        // but it may throw errors if indexes already exist
        // await model.createIndexes();
        // console.log(`✅ ${modelName} indexes created successfully`);
      } catch (error) {
        console.error(
          `❌ Error processing ${modelName} indexes:`,
          error.message
        );
        // Continue with next model instead of failing completely
      }
    }

    console.log('✅ Index creation process completed');
  } catch (error) {
    console.error('❌ Error in createIndexes:', error.message);
    throw error;
  }
}

async function validateCollections() {
  try {
    console.log('🔍 Validating collections...');

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const expectedCollections = ['authors', 'books', 'users', 'borrowrecords'];

    console.log('📋 Existing collections:');
    collections.forEach((col) => {
      console.log(`   - ${col.name}`);
    });

    const missingCollections = expectedCollections.filter(
      (expected) => !collections.some((col) => col.name === expected)
    );

    if (missingCollections.length > 0) {
      console.log('⚠️  Missing collections:');
      missingCollections.forEach((col) => {
        console.log(`   - ${col}`);
      });
      console.log('💡 Run the seed script to create collections with data');
    } else {
      console.log('✅ All expected collections exist');
    }
  } catch (error) {
    console.error('❌ Error validating collections:', error.message);
    throw error;
  }
}

async function showDatabaseStats() {
  try {
    console.log('📊 Database Statistics:');

    const authorCount = await Author.countDocuments();
    const bookCount = await Book.countDocuments();
    const userCount = await User.countDocuments();
    const borrowRecordCount = await BorrowRecord.countDocuments();

    console.log(`   Authors: ${authorCount}`);
    console.log(`   Books: ${bookCount}`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Borrow Records: ${borrowRecordCount}`);

    // Check for any validation issues
    if (authorCount === 0 && bookCount === 0 && userCount === 0) {
      console.log(
        '💡 Database is empty. Run the seed script to populate with sample data.'
      );
    }
  } catch (error) {
    console.error('❌ Error getting database stats:', error.message);
    throw error;
  }
}

// Main migration function
async function runMigration() {
  try {
    console.log('🔧 Starting database migration...');

    await connectDB();
    await createIndexes();
    await validateCollections();
    await showDatabaseStats();

    console.log('\n🎉 Database migration completed successfully!');
  } catch (error) {
    console.error('\n💥 Migration failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}

export default runMigration;
