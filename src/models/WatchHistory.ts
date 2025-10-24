import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWatchHistory extends Document {
  userId: string;
  movieId: number;
  movieTitle: string;
  watchedAt: Date;
  watchDuration?: number; // in minutes
  completed: boolean;
  platform?: string;
  createdAt: Date;
}

const WatchHistorySchema = new Schema<IWatchHistory>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    movieTitle: {
      type: String,
      required: true,
      maxlength: 200,
    },
    watchedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    watchDuration: {
      type: Number,
      min: 0,
    },
    completed: {
      type: Boolean,
      default: true,
    },
    platform: {
      type: String,
      maxlength: 50,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

WatchHistorySchema.index({ userId: 1, watchedAt: -1 });
WatchHistorySchema.index({ userId: 1, movieId: 1 });

const WatchHistory: Model<IWatchHistory> =
  mongoose.models.WatchHistory || mongoose.model<IWatchHistory>('WatchHistory', WatchHistorySchema);

export default WatchHistory;

