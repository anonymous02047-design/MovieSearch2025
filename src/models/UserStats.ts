import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserStats extends Document {
  userId: string;
  totalMoviesWatched: number;
  totalWatchTime: number; // in minutes
  averageRating: number;
  favoriteGenre?: string;
  moviesThisMonth: number;
  moviesThisYear: number;
  reviewsWritten: number;
  listsCreated: number;
  achievementsUnlocked: number;
  currentStreak: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserStatsSchema = new Schema<IUserStats>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    totalMoviesWatched: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalWatchTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    favoriteGenre: {
      type: String,
      maxlength: 50,
    },
    moviesThisMonth: {
      type: Number,
      default: 0,
      min: 0,
    },
    moviesThisYear: {
      type: Number,
      default: 0,
      min: 0,
    },
    reviewsWritten: {
      type: Number,
      default: 0,
      min: 0,
    },
    listsCreated: {
      type: Number,
      default: 0,
      min: 0,
    },
    achievementsUnlocked: {
      type: Number,
      default: 0,
      min: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const UserStats: Model<IUserStats> =
  mongoose.models.UserStats || mongoose.model<IUserStats>('UserStats', UserStatsSchema);

export default UserStats;

