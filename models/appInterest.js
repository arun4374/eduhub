const mongoose = require('mongoose');

const appInterestSchema = new mongoose.Schema({
  /**
   * A unique identifier for the feature or product the user is interested in.
   * Examples: 'mobile_app_launch', 'new_feature_x'
   */
  featureId: {
    type: String,
    required: true,
    unique: true, // Each feature has only one counter document.
    trim: true,
    index: true, // Index for quick lookups of all interests for a specific feature
  },

  /**
   * The total number of times interest has been registered for this feature.
   */
  count: {
    type: Number,
    required: true,
    default: 1347, // This sets the initial base count.
  }
}, {
  // Keep track of when the count was last updated.
  timestamps: true
});

// Prevent model overwrite error in Next.js development (Hot Module Replacement)
module.exports = mongoose.models.AppInterest || mongoose.model('AppInterest', appInterestSchema);