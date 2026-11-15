import mongoose from 'mongoose';
import dns from 'dns';
import { env } from './env.js';

// Configure DNS resolution for MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Use system default if setting custom servers fails
}

export const connectDB = async (retryCount = 0): Promise<void> => {
  try {
    if (!env.MONGO_URI) {
      throw new Error('MONGO_URI is missing in environment variables');
    }

    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] MongoDB Connection Error: ${(error as Error).message}`);
    // Retry connection after 3 seconds instead of exiting process
    const nextRetry = retryCount + 1;
    console.log(`[Database] Retrying MongoDB connection in 3 seconds (Attempt ${nextRetry})...`);
    setTimeout(() => {
      connectDB(nextRetry).catch(() => {});
    }, 3000);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB connection dropped. Attempting reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('[Database] MongoDB reconnected successfully.');
});

mongoose.connection.on('error', (err) => {
  console.error('[Database] MongoDB connection error:', err.message);
});
