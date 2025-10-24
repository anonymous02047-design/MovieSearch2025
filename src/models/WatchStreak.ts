import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWatchStreak extends Document {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastWatchDate: Date;
  streakType: string;
  createdAt: Date;
  updatedAt: Date;
}

const WatchStreakSchema = new Schema<IWatchStreak>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastWatchDate: {
      type: Date,
    },
    streakType: {
      type: String,
      enum: ['daily', 'weekly'],
      default: 'daily',
    },
  },
  {
    timestamps: true,
  }
);

const WatchStreak: Model<IWatchStreak> =
  mongoose.models.WatchStreak || mongoose.model<IWatchStreak>('WatchStreak', WatchStreakSchema);

export default WatchStreak;

