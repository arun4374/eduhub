import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  pageType: 'subject' | 'department';
  pageId: string;
  userId?: mongoose.Schema.Types.ObjectId; // Optional link to a logged-in user
  name: string; // From user session or guest input
  email: string; // From user session or guest input
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema: Schema = new Schema({
  pageType: {
    type: String,
    enum: ['subject', 'department'],
    required: true,
    index: true,
  },
  pageId: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // Allow guest comments
  },
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address.'],
  },
  message: {
    type: String,
    required: [true, 'Message cannot be empty.'],
    trim: true,
  },
}, {
  timestamps: true,
});

// Compound index for efficient querying of comments for a specific page
commentSchema.index({ pageType: 1, pageId: 1, createdAt: -1 });

// Prevent model overwrite error in Next.js
export default mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema);