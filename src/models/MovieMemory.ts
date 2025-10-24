import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMovieMemory extends Document {
  userId: string;
  movieId?: number;
  movieTitle?: string;
  memory: string;
  tags?: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MovieMemorySchema = new Schema<IMovieMemory>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    movieId: {
      type: Number,
    },
    movieTitle: {
      type: String,
    },
    memory: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    tags: [{
      type: String,
    }],
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

MovieMemorySchema.index({ userId: 1, createdAt: -1 });

const MovieMemory: Model<IMovieMemory> =
  mongoose.models.MovieMemory || mongoose.model<IMovieMemory>('MovieMemory', MovieMemorySchema);

export default MovieMemory;

