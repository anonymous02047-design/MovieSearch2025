import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGenrePreference extends Document {
  userId: string;
  genreId: number;
  genreName: string;
  preference: number; // 1-5 rating
  moviesWatched: number;
  createdAt: Date;
  updatedAt: Date;
}

const GenrePreferenceSchema = new Schema<IGenrePreference>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    genreId: {
      type: Number,
      required: true,
    },
    genreName: {
      type: String,
      required: true,
      maxlength: 50,
    },
    preference: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    moviesWatched: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

GenrePreferenceSchema.index({ userId: 1, genreId: 1 }, { unique: true });
GenrePreferenceSchema.index({ userId: 1, preference: -1 });

const GenrePreference: Model<IGenrePreference> =
  mongoose.models.GenrePreference || mongoose.model<IGenrePreference>('GenrePreference', GenrePreferenceSchema);

export default GenrePreference;

