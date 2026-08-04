import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDb() {
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5_000 });
    console.log(`[db] connected to ${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (err) {
    console.warn(`[db] warning: could not connect to MongoDB (${err.message}). Server running with DB disconnected.`);
    return null;
  }
}

export async function disconnectDb() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

