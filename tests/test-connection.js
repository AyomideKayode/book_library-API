import mongoose from 'mongoose';
import dotenv from 'dotenv';

console.log('Loading environment variables...');
dotenv.config();

console.log('Environment loaded, starting test...');

async function test() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    console.log(
      'URI starts with:',
      process.env.MONGODB_URI
        ? process.env.MONGODB_URI.substring(0, 20) + '...'
        : 'N/A'
    );

    console.log('Attempting to connect...');
    await mongoose.connect(process.env.MONGODB_URI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connection successful');

    console.log('Disconnecting...');
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnection successful');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

console.log('Calling test function...');
test();
