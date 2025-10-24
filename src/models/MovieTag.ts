import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMovieTag extends Document {
  userId: string;
  movieId: number;
  movieTitle: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MovieTagSchema = new Schema<IMovieTag>(
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
    tags: [{
      type: String,
      maxlength: 30, // Short tags for efficiency
    }],
  },
  {
    timestamps: true,
  }
);

MovieTagSchema.index({ userId: 1, movieId: 1 }, { unique: true });
MovieTagSchema.index({ userId: 1, tags: 1 });

const MovieTag: Model<IMovieTag> =
  mongoose.models.MovieTag || mongoose.model<IMovieTag>('MovieTag', MovieTagSchema);

export default MovieTag;

