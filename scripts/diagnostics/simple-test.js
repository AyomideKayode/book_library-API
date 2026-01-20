import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/book-library';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in environment variables');
  process.exit(1);
}

console.log('Starting simple MongoDB test...');

async function simpleTest() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log('✅ Connected successfully!');

    // Test a simple operation
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(
      '📋 Collections:',
      collections.map((c) => c.name)
    );

    await mongoose.disconnect();
    console.log('✅ Disconnected successfully!');
  } catch (error) {
    console.error('❌ Error:', error.name, '-', error.message);
    if (error.reason) {
      console.error('Reason:', error.reason);
    }
  }
  process.exit(0);
}

simpleTest();
