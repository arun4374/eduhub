const updateSchema = new mongoose.Schema({
  title: String,
  description: String,
  body: String,

  type: {
    type: String,
    enum: ['marks', 'news', 'results', 'notes', 'exams'],
    required: true,
  },

  imageUrl: String,

  isImportant: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
