import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFavoriteActor extends Document {
  userId: string;
  actorId: number;
  actorName: string;
  reason?: string;
  rank?: number;
  createdAt: Date;
}

const FavoriteActorSchema = new Schema<IFavoriteActor>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    actorId: {
      type: Number,
      required: true,
    },
    actorName: {
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

FavoriteActorSchema.index({ userId: 1, actorId: 1 }, { unique: true });
FavoriteActorSchema.index({ userId: 1, rank: 1 });

const FavoriteActor: Model<IFavoriteActor> =
  mongoose.models.FavoriteActor || mongoose.model<IFavoriteActor>('FavoriteActor', FavoriteActorSchema);

export default FavoriteActor;

