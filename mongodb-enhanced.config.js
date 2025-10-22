/**
 * Enhanced MongoDB Configuration for MovieSearch 2025
 * Production-ready setup with security, performance, and monitoring
 */

module.exports = {
  // Connection configuration
  connection: {
    uri: process.env.MONGODB_URI,
    options: {
      // Connection pool settings
      maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE) || 10,
      minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE) || 2,
      
      // Timeout settings
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      
      // Retry settings
      retryWrites: true,
      retryReads: true,
      maxIdleTimeMS: 300000, // 5 minutes
      
      // Write concern
      w: 'majority',
      wtimeoutMS: 5000,
      
      // Read preference
      readPreference: 'primaryPreferred',
      
      // Compression
      compressors: ['snappy', 'zlib'],
      
      // Authentication
      authSource: 'admin',
      
      // TLS/SSL
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
    },
  },

  // Database names
  databases: {
    main: process.env.MONGODB_DATABASE_NAME || 'moviesearch2025',
    analytics: process.env.MONGODB_ANALYTICS_DB || 'moviesearch_analytics',
    sessions: process.env.MONGODB_SESSIONS_DB || 'moviesearch_sessions',
  },

  // Collection names
  collections: {
    users: 'users',
    favorites: 'favorites',
    watchlists: 'watchlists',
    reviews: 'reviews',
    collections: 'collections',
    notes: 'notes',
    history: 'viewing_history',
    ratings: 'ratings',
    sessions: 'sessions',
    analytics: 'analytics_events',
  },

  // Index configurations
  indexes: [
    // Users collection
    {
      collection: 'users',
      indexes: [
        { fields: { clerkId: 1 }, options: { unique: true, name: 'idx_clerk_id' } },
        { fields: { email: 1 }, options: { unique: true, sparse: true, name: 'idx_email' } },
        { fields: { createdAt: -1 }, options: { name: 'idx_created_at' } },
        { fields: { 'profile.username': 1 }, options: { unique: true, sparse: true, name: 'idx_username' } },
      ],
    },
    // Favorites collection
    {
      collection: 'favorites',
      indexes: [
        { fields: { userId: 1, movieId: 1 }, options: { unique: true, name: 'idx_user_movie' } },
        { fields: { userId: 1, createdAt: -1 }, options: { name: 'idx_user_created' } },
        { fields: { movieId: 1 }, options: { name: 'idx_movie' } },
      ],
    },
    // Watchlists collection
    {
      collection: 'watchlists',
      indexes: [
        { fields: { userId: 1, movieId: 1 }, options: { unique: true, name: 'idx_user_movie' } },
        { fields: { userId: 1, status: 1 }, options: { name: 'idx_user_status' } },
        { fields: { userId: 1, createdAt: -1 }, options: { name: 'idx_user_created' } },
      ],
    },
    // Reviews collection
    {
      collection: 'reviews',
      indexes: [
        { fields: { userId: 1, movieId: 1 }, options: { unique: true, name: 'idx_user_movie' } },
        { fields: { movieId: 1, createdAt: -1 }, options: { name: 'idx_movie_created' } },
        { fields: { rating: 1 }, options: { name: 'idx_rating' } },
      ],
    },
    // Viewing history
    {
      collection: 'viewing_history',
      indexes: [
        { fields: { userId: 1, viewedAt: -1 }, options: { name: 'idx_user_viewed' } },
        { fields: { userId: 1, movieId: 1 }, options: { name: 'idx_user_movie' } },
        { fields: { viewedAt: 1 }, options: { expireAfterSeconds: 7776000, name: 'idx_ttl_90days' } }, // 90 days TTL
      ],
    },
    // Sessions
    {
      collection: 'sessions',
      indexes: [
        { fields: { sessionId: 1 }, options: { unique: true, name: 'idx_session_id' } },
        { fields: { userId: 1 }, options: { name: 'idx_user_id' } },
        { fields: { expiresAt: 1 }, options: { expireAfterSeconds: 0, name: 'idx_ttl_expires' } },
      ],
    },
    // Analytics events
    {
      collection: 'analytics_events',
      indexes: [
        { fields: { userId: 1, timestamp: -1 }, options: { name: 'idx_user_time' } },
        { fields: { eventType: 1, timestamp: -1 }, options: { name: 'idx_event_time' } },
        { fields: { timestamp: 1 }, options: { expireAfterSeconds: 2592000, name: 'idx_ttl_30days' } }, // 30 days TTL
      ],
    },
  ],

  // Security settings
  security: {
    // Field-level encryption (if using MongoDB 4.2+)
    encryption: {
      enabled: process.env.MONGODB_ENCRYPTION_ENABLED === 'true',
      keyVaultNamespace: 'encryption.__keyVault',
      kmsProviders: {
        local: {
          key: process.env.MONGODB_ENCRYPTION_KEY,
        },
      },
    },
    
    // IP whitelist (for MongoDB Atlas)
    ipWhitelist: ['0.0.0.0/0'], // Update in production
    
    // Audit logging
    auditLog: {
      enabled: true,
      destination: 'file',
      format: 'JSON',
      filter: {
        atype: { $in: ['authenticate', 'authCheck', 'createUser', 'dropUser', 'dropDatabase', 'dropCollection'] },
      },
    },
  },

  // Performance settings
  performance: {
    // Query optimization
    maxTimeMS: 30000, // 30 seconds max query time
    
    // Aggregation
    allowDiskUse: true,
    
    // Cursor settings
    batchSize: 100,
    
    // Read concern
    readConcern: { level: 'majority' },
    
    // Write concern
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 5000,
    },
  },

  // Monitoring and logging
  monitoring: {
    // Slow query threshold (ms)
    slowQueryThreshold: 100,
    
    // Profiling level (0: off, 1: slow queries, 2: all queries)
    profilingLevel: 1,
    
    // Enable command monitoring
    commandMonitoring: true,
    
    // Metrics collection
    collectMetrics: true,
    metricsInterval: 60000, // 1 minute
  },

  // Backup settings
  backup: {
    enabled: true,
    schedule: '0 2 * * *', // Daily at 2 AM
    retention: 30, // days
    collections: ['users', 'favorites', 'watchlists', 'reviews', 'collections'],
  },

  // Data validation rules
  validation: {
    users: {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['clerkId', 'email', 'createdAt'],
          properties: {
            clerkId: { bsonType: 'string' },
            email: { bsonType: 'string', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
            profile: {
              bsonType: 'object',
              properties: {
                username: { bsonType: 'string', minLength: 3, maxLength: 30 },
                bio: { bsonType: 'string', maxLength: 500 },
              },
            },
            preferences: { bsonType: 'object' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
            deletedAt: { bsonType: ['date', 'null'] },
          },
        },
      },
      validationLevel: 'moderate',
      validationAction: 'warn',
    },
  },

  // Migration settings
  migration: {
    enabled: true,
    directory: './migrations',
    collection: 'migrations',
  },
};

