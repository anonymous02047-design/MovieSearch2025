import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMovieDiaryEntry extends Document {
  userId: string;
  movieId: number;
  movieTitle: string;
  watchedDate: Date;
  rating?: number;
  review?: string;
  mood?: string;
  location?: string;
  companions?: string[];
  rewatch: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MovieDiarySchema = new Schema<IMovieDiaryEntry>(
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
    watchedDate: {
      type: Date,
      required: true,
    },
    rating: {
      type: Number,
      min: 0.5,
      max: 5,
    },
    review: {
      type: String,
      maxlength: 5000,
    },
    mood: {
      type: String,
    },
    location: {
      type: String,
    },
    companions: [{
      type: String,
    }],
    rewatch: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

MovieDiarySchema.index({ userId: 1, watchedDate: -1 });
MovieDiarySchema.index({ userId: 1, movieId: 1 });

const MovieDiary: Model<IMovieDiaryEntry> =
  mongoose.models.MovieDiary || mongoose.model<IMovieDiaryEntry>('MovieDiary', MovieDiarySchema);

export default MovieDiary;

