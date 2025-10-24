/**
 * User Model for MongoDB
 * Stores additional user data beyond Clerk authentication
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  clerkId: string; // Clerk user ID
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
  bio?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    emailNotifications: boolean;
    movieNotifications: boolean;
  };
  favorites: string[]; // Movie IDs
  watchlist: string[]; // Movie IDs
  searchHistory: Array<{
    query: string;
    timestamp: Date;
  }>;
  reviews: mongoose.Types.ObjectId[]; // References to Review model
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

const UserSchema: Schema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      sparse: true, // Allows null/undefined
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: 500,
      default: '',
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      language: {
        type: String,
        default: 'en',
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      movieNotifications: {
        type: Boolean,
        default: true,
      },
    },
    favorites: [{
      type: String, // Movie ID from TMDB
    }],
    watchlist: [{
      type: String, // Movie ID from TMDB
    }],
    searchHistory: [{
      query: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    }],
    reviews: [{
      type: Schema.Types.ObjectId,
      ref: 'Review',
    }],
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Indexes for better query performance
// Note: email and clerkId already have unique indexes from schema definition
UserSchema.index({ createdAt: -1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function (this: IUser) {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

// Method to add to favorites
UserSchema.methods.addToFavorites = function (movieId: string) {
  if (!this.favorites.includes(movieId)) {
    this.favorites.push(movieId);
    return this.save();
  }
  return this;
};

// Method to remove from favorites
UserSchema.methods.removeFromFavorites = function (movieId: string) {
  this.favorites = this.favorites.filter((id: string) => id !== movieId);
  return this.save();
};

// Method to add to watchlist
UserSchema.methods.addToWatchlist = function (movieId: string) {
  if (!this.watchlist.includes(movieId)) {
    this.watchlist.push(movieId);
    return this.save();
  }
  return this;
};

// Method to remove from watchlist
UserSchema.methods.removeFromWatchlist = function (movieId: string) {
  this.watchlist = this.watchlist.filter((id: string) => id !== movieId);
  return this.save();
};

// Method to add search query
UserSchema.methods.addSearchQuery = function (query: string) {
  this.searchHistory.unshift({
    query,
    timestamp: new Date(),
  });
  
  // Keep only last 50 searches
  if (this.searchHistory.length > 50) {
    this.searchHistory = this.searchHistory.slice(0, 50);
  }
  
  return this.save();
};

// Method to clear search history
UserSchema.methods.clearSearchHistory = function () {
  this.searchHistory = [];
  return this.save();
};

// Static method to find by Clerk ID
UserSchema.statics.findByClerkId = function (clerkId: string) {
  return this.findOne({ clerkId });
};

// Static method to create or update user
UserSchema.statics.createOrUpdate = async function (userData: Partial<IUser>) {
  const { clerkId, ...data } = userData;
  
  if (!clerkId) {
    throw new Error('clerkId is required');
  }

  const user = await this.findOneAndUpdate(
    { clerkId },
    { $set: data, lastLogin: new Date() },
    { upsert: true, new: true, runValidators: true }
  );

  return user;
};

// Prevent model recompilation in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

