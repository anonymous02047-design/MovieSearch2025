/**
 * MongoDB Connection and Utilities
 * Free tier compatible - Uses MongoDB Atlas free cluster
 */

import mongoose from 'mongoose';

// MongoDB is optional - only check at runtime when actually used
const MONGODB_URI: string | undefined = process.env.MONGODB_URI;
let hasWarnedAboutMissingURI = false;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare global type for mongoose cache
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connect to MongoDB
 * Uses connection pooling for better performance
 * MongoDB is optional - will throw error only if actually used without configuration
 */
export async function connectDB(): Promise<typeof mongoose> {
  // Check if MongoDB URI is configured
  if (!MONGODB_URI) {
    if (!hasWarnedAboutMissingURI) {
      console.warn('⚠️  MongoDB URI not configured');
      console.warn('   User profile features require MongoDB to be set up');
      console.warn('   Add MONGODB_URI to .env.local to enable these features');
      console.warn('   See MONGODB_INTEGRATION_GUIDE.md for setup instructions');
      hasWarnedAboutMissingURI = true;
    }
    throw new Error(
      'MongoDB not configured. Add MONGODB_URI to .env.local or see MONGODB_INTEGRATION_GUIDE.md'
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Free tier limit
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDB(): Promise<void> {
  if (!cached.conn) {
    return;
  }

  await mongoose.disconnect();
  cached.conn = null;
  cached.promise = null;
  console.log('MongoDB disconnected');
}

/**
 * Check MongoDB connection status
 */
export function isConnected(): boolean {
  return cached.conn !== null && mongoose.connection.readyState === 1;
}

/**
 * Get MongoDB connection info
 */
export function getConnectionInfo() {
  return {
    isConnected: isConnected(),
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name,
  };
}

export default mongoose;

