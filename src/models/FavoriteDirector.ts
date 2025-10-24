import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFavoriteDirector extends Document {
  userId: string;
  directorId: number;
  directorName: string;
  reason?: string;
  rank?: number;
  createdAt: Date;
}

const FavoriteDirectorSchema = new Schema<IFavoriteDirector>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    directorId: {
      type: Number,
      required: true,
    },
    directorName: {
      type: String,
      required: true,
      maxlength: 100,
    },
    reason: {
      type: String,
      maxlength: 500,
    },
    rank: {
      type: Number,
      min: 1,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

FavoriteDirectorSchema.index({ userId: 1, directorId: 1 }, { unique: true });

const FavoriteDirector: Model<IFavoriteDirector> =
  mongoose.models.FavoriteDirector || mongoose.model<IFavoriteDirector>('FavoriteDirector', FavoriteDirectorSchema);

export default FavoriteDirector;

