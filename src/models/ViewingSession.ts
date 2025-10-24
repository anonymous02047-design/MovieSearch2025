import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IViewingSession extends Document {
  userId: string;
  movieId: number;
  movieTitle: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  platform?: string;
  device?: string;
  completed: boolean;
  createdAt: Date;
}

const ViewingSessionSchema = new Schema<IViewingSession>(
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
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    duration: {
      type: Number,
      min: 0,
    },
    platform: {
      type: String,
      maxlength: 50,
    },
    device: {
      type: String,
      maxlength: 30,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

ViewingSessionSchema.index({ userId: 1, startTime: -1 });
ViewingSessionSchema.index({ userId: 1, movieId: 1 });

const ViewingSession: Model<IViewingSession> =
  mongoose.models.ViewingSession || mongoose.model<IViewingSession>('ViewingSession', ViewingSessionSchema);

export default ViewingSession;

