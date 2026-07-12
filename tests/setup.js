import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';

process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret';

let replSet;

export const connect = async () => {
  // Spin up a new Replica Set
  replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: 'wiredTiger' },
  });

  const uri = replSet.getUri();

  // Mongoose connection
  await mongoose.connect(uri);

  // Pre-create collections so transactional writes don't hit catalog changes
  await mongoose.connection.createCollection('authors');
  await mongoose.connection.createCollection('books');
  await mongoose.connection.createCollection('borrowrecords');
  await mongoose.connection.createCollection('users');
};

export const close = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (replSet) {
    await replSet.stop();
  }
};

export const clear = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
