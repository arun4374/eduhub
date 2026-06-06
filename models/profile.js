const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Enforces a one-to-one relationship between User and Profile
  },
  department: {
    type: String,
    trim: true
  },
  semester: {
    type: String,
    trim: true
  },
  institute: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  }
}, {
  // Automatically creates createdAt and updatedAt fields to satisfy the timestamp requirement
  timestamps: true 
});

// Prevent model overwrite error in Next.js development (Hot Module Replacement)
module.exports = mongoose.models.Profile || mongoose.model('Profile', profileSchema);