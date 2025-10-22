import mongoose from 'mongoose';

const featureRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      required: true,
      enum: ['UI/UX', 'Search', 'Recommendations', 'Social', 'Performance', 'Mobile App', 'API', 'Other'],
    },
    priority: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      required: true,
      enum: ['submitted', 'in-review', 'planned', 'in-development', 'completed', 'rejected'],
      default: 'submitted',
    },
    votes: {
      type: Number,
      default: 0,
      min: 0,
    },
    votedBy: [{
      type: String, // User IDs who voted
    }],
    adminNotes: {
      type: String,
      trim: true,
    },
    implementedVersion: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
featureRequestSchema.index({ status: 1, createdAt: -1 });
featureRequestSchema.index({ userId: 1, createdAt: -1 });
featureRequestSchema.index({ votes: -1 });

export default mongoose.models.FeatureRequest || mongoose.model('FeatureRequest', featureRequestSchema);

