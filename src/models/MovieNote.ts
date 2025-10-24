import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMovieNote extends Document {
  userId: string;
  movieId: number;
  movieTitle: string;
  note: string;
  category?: string;
  tags?: string[];
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MovieNoteSchema = new Schema<IMovieNote>(
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
    note: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    category: {
      type: String,
      enum: ['analysis', 'quote', 'trivia', 'personal', 'review', 'other'],
      default: 'personal',
    },
    tags: [{
      type: String,
    }],
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

MovieNoteSchema.index({ userId: 1, movieId: 1 });
MovieNoteSchema.index({ userId: 1, createdAt: -1 });

const MovieNote: Model<IMovieNote> =
  mongoose.models.MovieNote || mongoose.model<IMovieNote>('MovieNote', MovieNoteSchema);

export default MovieNote;

