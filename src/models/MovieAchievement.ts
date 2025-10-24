import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMovieAchievement extends Document {
  userId: string;
  achievementType: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MovieAchievementSchema = new Schema<IMovieAchievement>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    achievementType: {
      type: String,
      required: true,
      enum: ['watch_count', 'genre_master', 'critic', 'streak', 'social', 'collection'],
      maxlength: 30,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
    },
    target: {
      type: Number,
      required: true,
      min: 1,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

MovieAchievementSchema.index({ userId: 1, achievementType: 1 });
MovieAchievementSchema.index({ userId: 1, completed: 1 });

const MovieAchievement: Model<IMovieAchievement> =
  mongoose.models.MovieAchievement || mongoose.model<IMovieAchievement>('MovieAchievement', MovieAchievementSchema);

export default MovieAchievement;

