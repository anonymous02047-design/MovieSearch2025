import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuickList extends Document {
  userId: string;
  name: string;
  description?: string;
  movies: {
    movieId: number;
    movieTitle: string;
    posterPath?: string;
    addedAt: Date;
  }[];
  isPublic: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const QuickListSchema = new Schema<IQuickList>(
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
      maxlength: 500,
    },
    movies: [{
      movieId: {
        type: Number,
        required: true,
      },
      movieTitle: {
        type: String,
        required: true,
      },
      posterPath: String,
      addedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    isPublic: {
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

QuickListSchema.index({ userId: 1, createdAt: -1 });
QuickListSchema.index({ userId: 1, name: 1 });

const QuickList: Model<IQuickList> =
  mongoose.models.QuickList || mongoose.model<IQuickList>('QuickList', QuickListSchema);

export default QuickList;

