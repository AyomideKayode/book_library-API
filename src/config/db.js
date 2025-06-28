import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      // Check if MongoDB URI is provided
      if (!process.env.MONGODB_URI) {
        throw new Error(
          'MONGODB_URI is not defined in environment variables. Please check your .env file.'
        );
      }

      // MongoDB connection options
      const options = {
        // Connection management
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity

        // Modern Mongoose options (removed deprecated options)
        // bufferCommands: false, // Uncomment if you want to disable buffering
      };

      // Connect to MongoDB
      this.connection = await mongoose.connect(
        process.env.MONGODB_URI,
        options
      );

      console.log('🚀 MongoDB Connected Successfully!');
      console.log(`📊 Database: ${this.connection.connection.name}`);
      console.log(
        `🌐 Host: ${this.connection.connection.host}:${this.connection.connection.port}`
      );

      // Set up connection event listeners
      this.setupEventListeners();

      return this.connection;
    } catch (error) {
      console.error('❌ MongoDB Connection Error:', error.message);

      // Provide helpful connection troubleshooting
      if (error.message.includes('MONGODB_URI')) {
        console.error('💡 Tip: Make sure to set MONGODB_URI in your .env file');
        console.error(
          '   Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/book-library'
        );
      }

      if (error.message.includes('authentication')) {
        console.error('💡 Tip: Check your MongoDB username and password');
      }

      if (error.message.includes('network')) {
        console.error(
          '💡 Tip: Check your internet connection and MongoDB Atlas network access'
        );
      }

      // Exit process on connection failure
      process.exit(1);
    }
  }

  setupEventListeners() {
    // Connection events
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await this.disconnect();
      console.log('👋 MongoDB connection closed through app termination');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.disconnect();
      console.log('👋 MongoDB connection closed through SIGTERM');
      process.exit(0);
    });
  }

  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
      }
    } catch (error) {
      console.error('❌ Error closing MongoDB connection:', error.message);
    }
  }

  getConnection() {
    return this.connection;
  }

  isConnected() {
    return mongoose.connection.readyState === 1;
  }
}

// Create and export a single instance
const database = new Database();

// Named exports for convenience
export const connectDB = () => database.connect();
export const disconnectDB = () => database.disconnect();
export const getConnection = () => database.getConnection();
export const isConnected = () => database.isConnected();

export default database;
