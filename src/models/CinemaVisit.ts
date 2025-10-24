import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICinemaVisit extends Document {
  userId: string;
  movieId: number;
  movieTitle: string;
  cinemaName: string;
  location?: string;
  visitDate: Date;
  screenType?: string;
  companions?: string[];
  ticketPrice?: number;
  rating?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CinemaVisitSchema = new Schema<ICinemaVisit>(
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
    cinemaName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    visitDate: {
      type: Date,
      required: true,
    },
    screenType: {
      type: String,
      enum: ['regular', 'imax', '3d', '4dx', 'dolby', 'other'],
    },
    companions: [{
      type: String,
    }],
    ticketPrice: {
      type: Number,
    },
    rating: {
      type: Number,
      min: 0.5,
      max: 5,
    },
    notes: {
      type: String,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

CinemaVisitSchema.index({ userId: 1, visitDate: -1 });

const CinemaVisit: Model<ICinemaVisit> =
  mongoose.models.CinemaVisit || mongoose.model<ICinemaVisit>('CinemaVisit', CinemaVisitSchema);

export default CinemaVisit;

