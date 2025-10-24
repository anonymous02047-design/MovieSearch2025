import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMovieBookmark extends Document {
  userId: string;
  movieId: number;
  movieTitle: string;
  timestamp: number; // in seconds
  note?: string;
  sceneDescription?: string;
  createdAt: Date;
}

const MovieBookmarkSchema = new Schema<IMovieBookmark>(
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
    timestamp: {
      type: Number,
      required: true,
      min: 0,
    },
    note: {
      type: String,
      maxlength: 500,
    },
    sceneDescription: {
      type: String,
      maxlength: 200,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

MovieBookmarkSchema.index({ userId: 1, movieId: 1 });

const MovieBookmark: Model<IMovieBookmark> =
  mongoose.models.MovieBookmark || mongoose.model<IMovieBookmark>('MovieBookmark', MovieBookmarkSchema);

export default MovieBookmark;

