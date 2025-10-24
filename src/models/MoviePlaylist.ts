import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMoviePlaylist extends Document {
  userId: string;
  name: string;
  description?: string;
  theme?: string;
  movies: number[]; // Store only IDs for efficiency
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MoviePlaylistSchema = new Schema<IMoviePlaylist>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 300,
    },
    theme: {
      type: String,
      maxlength: 50,
    },
    movies: [{
      type: Number,
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

MoviePlaylistSchema.index({ userId: 1, createdAt: -1 });

const MoviePlaylist: Model<IMoviePlaylist> =
  mongoose.models.MoviePlaylist || mongoose.model<IMoviePlaylist>('MoviePlaylist', MoviePlaylistSchema);

export default MoviePlaylist;

