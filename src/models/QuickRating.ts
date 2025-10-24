import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuickRating extends Document {
  userId: string;
  movieId: number;
  movieTitle: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuickRatingSchema = new Schema<IQuickRating>(
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
    },
    rating: {
      type: Number,
      required: true,
      min: 0.5,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
QuickRatingSchema.index({ userId: 1, movieId: 1 }, { unique: true });

const QuickRating: Model<IQuickRating> =
  mongoose.models.QuickRating || mongoose.model<IQuickRating>('QuickRating', QuickRatingSchema);

export default QuickRating;

