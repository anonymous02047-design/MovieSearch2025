/**
 * Collection Model for MongoDB
 * Stores user-created movie collections
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICollection extends Document {
  userId: mongoose.Types.ObjectId;
  clerkId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  movies: Array<{
    movieId: string;
    title: string;
    posterPath?: string;
    addedAt: Date;
    note?: string;
  }>;
  tags: string[];
  coverImage?: string;
  likes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema: Schema = new Schema(
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
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    movies: [{
      movieId: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      posterPath: String,
      addedAt: {
        type: Date,
        default: Date.now,
      },
      note: {
        type: String,
        maxlength: 200,
      },
    }],
    tags: [String],
    coverImage: String,
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'collections',
  }
);

CollectionSchema.index({ clerkId: 1, createdAt: -1 });
CollectionSchema.index({ isPublic: 1, likes: -1 });

const Collection: Model<ICollection> = mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema);

export default Collection;

