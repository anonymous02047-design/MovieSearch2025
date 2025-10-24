import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMovieGoal extends Document {
  userId: string;
  year: number;
  goalCount: number;
  watchedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MovieGoalSchema = new Schema<IMovieGoal>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    year: {
      type: Number,
      required: true,
    },
    goalCount: {
      type: Number,
      required: true,
      min: 1,
    },
    watchedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

MovieGoalSchema.index({ userId: 1, year: 1 }, { unique: true });

const MovieGoal: Model<IMovieGoal> =
  mongoose.models.MovieGoal || mongoose.model<IMovieGoal>('MovieGoal', MovieGoalSchema);

export default MovieGoal;

