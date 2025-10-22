/**
 * MongoDB Initialization and Setup
 * Automatically initializes database with proper indexes and default data
 */

import { connectDB } from './mongodb';
import User from '@/models/User';
import Review from '@/models/Review';
import Collection from '@/models/Collection';

let isInitialized = false;

/**
 * Initialize MongoDB with proper indexes and setup
 */
export async function initializeDatabase() {
  // Only initialize once
  if (isInitialized) {
    return { success: true, message: 'Database already initialized' };
  }

  try {
    console.log('🔧 Initializing MongoDB database...');

    // Connect to database
    await connectDB();

    // Create indexes for User model
    console.log('📊 Creating User indexes...');
    await User.createIndexes();

    // Create indexes for Review model
    console.log('📊 Creating Review indexes...');
    await Review.createIndexes();

    // Create indexes for Collection model
    console.log('📊 Creating Collection indexes...');
    await Collection.createIndexes();

    isInitialized = true;

    console.log('✅ MongoDB database initialized successfully');

    return {
      success: true,
      message: 'Database initialized successfully',
      indexes: {
        users: await User.collection.getIndexes(),
        reviews: await Review.collection.getIndexes(),
        collections: await Collection.collection.getIndexes(),
      },
    };
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error,
    };
  }
}

/**
 * Get database health status
 */
export async function getDatabaseHealth() {
  try {
    const mongoose = await connectDB();

    const health = {
      status: 'healthy',
      connection: {
        state: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name,
      },
      collections: {
        users: await User.countDocuments(),
        reviews: await Review.countDocuments(),
        collections: await Collection.countDocuments(),
      },
      initialized: isInitialized,
      timestamp: new Date().toISOString(),
    };

    return health;
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Check if database needs initialization
 */
export async function needsInitialization(): Promise<boolean> {
  if (isInitialized) {
    return false;
  }

  try {
    await connectDB();
    
    // Check if indexes exist
    const userIndexes = await User.collection.getIndexes();
    const reviewIndexes = await Review.collection.getIndexes();
    const collectionIndexes = await Collection.collection.getIndexes();

    // If all models have proper indexes, mark as initialized
    if (Object.keys(userIndexes).length > 1 && 
        Object.keys(reviewIndexes).length > 1 && 
        Object.keys(collectionIndexes).length > 1) {
      isInitialized = true;
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking initialization status:', error);
    return true;
  }
}

/**
 * Reset initialization status (for testing)
 */
export function resetInitialization() {
  isInitialized = false;
}

/**
 * Get database statistics
 */
export async function getDatabaseStats() {
  try {
    const mongoose = await connectDB();
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection not established');
    }

    const stats = await db.stats();

    return {
      success: true,
      stats: {
        database: db.databaseName,
        collections: stats.collections,
        dataSize: formatBytes(stats.dataSize),
        storageSize: formatBytes(stats.storageSize),
        indexes: stats.indexes,
        indexSize: formatBytes(stats.indexSize),
        objects: stats.objects,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Format bytes to human-readable format
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Auto-initialize on first import (server-side only)
 */
if (typeof window === 'undefined') {
  // Only auto-initialize in production or when explicitly enabled
  const autoInit = process.env.MONGODB_AUTO_INIT === 'true' || process.env.NODE_ENV === 'production';
  
  if (autoInit && process.env.MONGODB_URI) {
    initializeDatabase().catch((error) => {
      console.error('Auto-initialization failed:', error);
    });
  }
}

