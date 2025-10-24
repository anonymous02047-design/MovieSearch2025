import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMovieChallenge extends Document {
  userId: string;
  title: string;
  description: string;
  type: string;
  target: number;
  progress: number;
  startDate: Date;
  endDate: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MovieChallengeSchema = new Schema<IMovieChallenge>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 300,
    },
    type: {
      type: String,
      required: true,
      enum: ['genre', 'decade', 'director', 'actor', 'country', 'rating', 'custom'],
    },
    target: {
      type: Number,
      required: true,
      min: 1,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

MovieChallengeSchema.index({ userId: 1, completed: 1 });
MovieChallengeSchema.index({ userId: 1, endDate: 1 });

const MovieChallenge: Model<IMovieChallenge> =
  mongoose.models.MovieChallenge || mongoose.model<IMovieChallenge>('MovieChallenge', MovieChallengeSchema);

export default MovieChallenge;

