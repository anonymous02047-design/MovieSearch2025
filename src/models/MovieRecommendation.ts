import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMovieRecommendation extends Document {
  userId: string;
  movieId: number;
  movieTitle: string;
  source: string; // 'ai', 'user', 'trending', 'similar'
  reason?: string;
  score?: number;
  watched: boolean;
  saved: boolean;
  createdAt: Date;
}

const MovieRecommendationSchema = new Schema<IMovieRecommendation>(
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
    source: {
      type: String,
      required: true,
      enum: ['ai', 'user', 'trending', 'similar', 'genre', 'actor', 'director'],
      maxlength: 20,
    },
    reason: {
      type: String,
      maxlength: 300,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    watched: {
      type: Boolean,
      default: false,
    },
    saved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

MovieRecommendationSchema.index({ userId: 1, watched: 1 });
MovieRecommendationSchema.index({ userId: 1, movieId: 1 });

const MovieRecommendation: Model<IMovieRecommendation> =
  mongoose.models.MovieRecommendation || mongoose.model<IMovieRecommendation>('MovieRecommendation', MovieRecommendationSchema);

export default MovieRecommendation;

