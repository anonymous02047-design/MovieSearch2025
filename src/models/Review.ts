/**
 * Review Model for MongoDB
 * Stores user reviews for movies and TV shows
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId; // Reference to User
  clerkId: string; // Clerk user ID for quick lookup
  movieId: string; // TMDB movie ID
  movieTitle: string;
  moviePoster?: string;
  mediaType: 'movie' | 'tv';
  rating: number; // 0-10
  title: string;
  content: string;
  spoilers: boolean;
  helpful: number;
  notHelpful: number;
  reports: number;
  isVerified: boolean; // User has watched the movie
  isPinned: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    clerkId: {
      type: String,
      required: true,
      index: true,
    },
    movieId: {
      type: String,
      required: true,
      index: true,
    },
    movieTitle: {
      type: String,
      required: true,
    },
    moviePoster: {
      type: String,
    },
    mediaType: {
      type: String,
      enum: ['movie', 'tv'],
      default: 'movie',
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      minlength: 50,
      maxlength: 5000,
    },
    spoilers: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    notHelpful: {
      type: Number,
      default: 0,
    },
    reports: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'reviews',
  }
);

// Compound indexes
ReviewSchema.index({ movieId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, createdAt: -1 });
ReviewSchema.index({ clerkId: 1, movieId: 1 }, { unique: true }); // One review per movie per user

// Virtual for helpfulness ratio
ReviewSchema.virtual('helpfulnessRatio').get(function (this: IReview) {
  const total = this.helpful + this.notHelpful;
  return total > 0 ? this.helpful / total : 0;
});

// Method to increment helpful count
ReviewSchema.methods.markHelpful = function () {
  this.helpful += 1;
  return this.save();
};

// Method to increment not helpful count
ReviewSchema.methods.markNotHelpful = function () {
  this.notHelpful += 1;
  return this.save();
};

// Method to report review
ReviewSchema.methods.report = function () {
  this.reports += 1;
  return this.save();
};

// Static method to get reviews for a movie
ReviewSchema.statics.getByMovie = function (
  movieId: string,
  page: number = 1,
  limit: number = 10
) {
  return this.find({ movieId, isPublished: true })
    .sort({ isPinned: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('userId', 'firstName lastName username profilePhoto');
};

// Static method to get user reviews
ReviewSchema.statics.getByUser = function (
  clerkId: string,
  page: number = 1,
  limit: number = 10
) {
  return this.find({ clerkId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;

