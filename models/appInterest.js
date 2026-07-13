const mongoose = require('mongoose');

const appInterestSchema = new mongoose.Schema({
  /**
   * A unique identifier for the feature or product the user is interested in.
   * Examples: 'mobile_app_launch', 'new_feature_x'
   */
  featureId: {
    type: String,
    required: true,
    trim: true,
    index: true, // Index for quick lookups of all interests for a specific feature
  },

  /**
   * Reference to the user who expressed interest. This requires the user to be logged in.
   * This ensures one user cannot inflate the count by clicking multiple times.
   */
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // This is not required to allow anonymous users to register interest.
    // If a userId is provided, the unique index will prevent duplicates.
    required: false,
  },

  /**
   * Identifier for an anonymous user, typically their IP address.
   * This is used to prevent a single anonymous user from registering interest multiple times.
   */
  anonymousId: {
    type: String,
    trim: true,
  },
}, {
  // We only care about when the interest was first registered.
  timestamps: { createdAt: true, updatedAt: false }
});

// Create a compound unique index to ensure a user can only express interest
// in a specific feature once. This is the key to preventing duplicate counts.
// This index is partial, so it only applies to documents that have a `userId`.
appInterestSchema.index({ userId: 1, featureId: 1 }, { unique: true, partialFilterExpression: { userId: { $exists: true, $ne: null } } });

// Create a compound unique index for anonymous users to prevent duplicate
// interest from the same source (e.g., IP address).
appInterestSchema.index({ anonymousId: 1, featureId: 1 }, { unique: true, partialFilterExpression: { anonymousId: { $exists: true, $ne: null } } });

// Prevent model overwrite error in Next.js development (Hot Module Replacement)
module.exports = mongoose.models.AppInterest || mongoose.model('AppInterest', appInterestSchema);