import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMovieReview extends Document {
  userId: string;
  movieId: number;
  movieTitle: string;
  rating: number;
  review: string;
  pros?: string;
  cons?: string;
  spoilers: boolean;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

const MovieReviewSchema = new Schema<IMovieReview>(
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
    rating: {
      type: Number,
      required: true,
      min: 0.5,
      max: 5,
    },
    review: {
      type: String,
      required: true,
      maxlength: 2000, // Limit for free tier
    },
    pros: {
      type: String,
      maxlength: 500,
    },
    cons: {
      type: String,
      maxlength: 500,
    },
    spoilers: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

MovieReviewSchema.index({ userId: 1, movieId: 1 });
MovieReviewSchema.index({ userId: 1, createdAt: -1 });

const MovieReview: Model<IMovieReview> =
  mongoose.models.MovieReview || mongoose.model<IMovieReview>('MovieReview', MovieReviewSchema);

export default MovieReview;

