const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  pageTitle: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true, // Unique index for faster URL routing and lookups
    trim: true,
    lowercase: true
  },
  code: {
    type: String,
    required: true,
    trim: true,
    index: true // Indexed for search queries
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL']
  },
  year: {
    type: String,
    required: true,
    enum: ['1st', '2nd', '3rd', '4th']
  },
  semester: {
    type: String,
    required: true,
    enum: ['1', '2', '3', '4', '5', '6', '7', '8']
  },
  regulation: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  syllabus_markdown: {
    type: String,
    default: ''
  },
  metaTitle: {
    type: String
  },
  metaDescription: {
    type: String
  },
  keywords: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  downloads: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true // Automatically manages createdAt and updatedAt fields
});

// Prevent model overwrite error in Next.js development (Hot Module Replacement)
module.exports = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);
