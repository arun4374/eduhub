const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  // Mongoose automatically adds an _id of type ObjectId.
  // If you are strictly using custom string IDs (like "doc_ohs352_qp1" in your mock data), 
  // you can uncomment the next line to override the default _id behavior:
  // _id: { type: String, required: true },
  
  subjectId: {
    type: String,
    required: true,
    index: true // Indexed for faster lookups when fetching documents for a specific subject
  },
  type: {
    type: String,
    enum: ['question_paper', 'notes', 'syllabus'],
    required: true
  },
  subject_name: {
    type: String,
    required: true,
    trim: true
  },
  file_url: {
    type: String,
    required: true
  },
  pdf_filename: {
    type: String,
    required: true
  },
  exam_period: {
    type: String,
    default: 'N/A'
  },
  regulation: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  addedDate: {
    type: String // Keeping as String to match your interface, though Date is also an option
  },
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
module.exports = mongoose.models.Document || mongoose.model('Document', documentSchema);
