const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  content: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ['news', 'results', 'notes', 'exams', 'marks'],
    required: true,
  },

  imageUrl: {
    type: String,
    default: '',
  },

  link: {
    type: String,
    default: '',
  },

  isImportant: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Update', updateSchema);
