import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMovieComparison extends Document {
  userId: string;
  movie1Id: number;
  movie1Title: string;
  movie2Id: number;
  movie2Title: string;
  notes?: string;
  winner?: number; // movieId of preferred movie
  createdAt: Date;
}

const MovieComparisonSchema = new Schema<IMovieComparison>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    movie1Id: {
      type: Number,
      required: true,
    },
    movie1Title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    movie2Id: {
      type: Number,
      required: true,
    },
    movie2Title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    winner: {
      type: Number,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

MovieComparisonSchema.index({ userId: 1, createdAt: -1 });

const MovieComparison: Model<IMovieComparison> =
  mongoose.models.MovieComparison || mongoose.model<IMovieComparison>('MovieComparison', MovieComparisonSchema);

export default MovieComparison;

