import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMovieQuote extends Document {
  userId: string;
  movieId: number;
  movieTitle: string;
  quote: string;
  character?: string;
  actor?: string;
  timestamp?: string;
  isFavorite: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MovieQuoteSchema = new Schema<IMovieQuote>(
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
    quote: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    character: {
      type: String,
    },
    actor: {
      type: String,
    },
    timestamp: {
      type: String,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    tags: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

MovieQuoteSchema.index({ userId: 1, movieId: 1 });
MovieQuoteSchema.index({ userId: 1, isFavorite: -1 });

const MovieQuote: Model<IMovieQuote> =
  mongoose.models.MovieQuote || mongoose.model<IMovieQuote>('MovieQuote', MovieQuoteSchema);

export default MovieQuote;

