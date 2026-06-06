const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  // Google Authentication ID
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows this to be optional if you add other auth providers later
  },
  // Profile information
  profilePicture: {
    type: String,
    default: ''
  },
  // Credits/Points system
  credits: {
    type: Number,
    default: 100,
    min: 0
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Subscription details
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'canceled', 'past_due'],
      default: 'inactive'
    },
    startDate: Date,
    endDate: Date,
    paymentMethodId: String
  },
  // Additional utility fields
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  // Soft delete fields
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);
