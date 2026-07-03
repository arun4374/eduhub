 import mongoose from "mongoose";

// This utility is duplicated from `lib/documents.ts` to avoid import issues in a mixed JS/TS environment without a build step for backend files.
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

const documentSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["question_paper", "notes", "syllabus", "reference"],
      default: "question_paper",
    },
    slug: {
      type: String,
      unique: true,
      // Slugs are only required for question papers which have public pages.
      required: function() { return this.type === 'question_paper'; },
      index: true,
    },
    subject_name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    file_url: {
      type: String,
      required: true,
      trim: true,
    },
    pdf_filename: {
      type: String,
      required: true,
      trim: true,
    },
    exam_period: {
      type: String,
      trim: true,
      default: "",
      // e.g. "ND-2025", "AM-2025"
    },
    regulation: {
      type: String,
      required: true,
      trim: true,
      // e.g. "2021", "2017"
    },
    department: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      // e.g. "CSE", "ECE", "IT"
    },
    semester: {
      type: String,
      required: true,
      enum: ["1", "2", "3", "4", "5", "6", "7", "8"],
    },
    addedDate: {
      type: String,
      trim: true,
      default: "",
      // stored as "DD-MM-YYYY" string
    },
    views: {
      type: Number,
      default: 199,
      min: 100,
    },
    downloads: {
      type: Number,
      default: 199,
      min: 100,
    },
  },
  {
    timestamps: true, // auto-manages createdAt & updatedAt
  }
);

// Mongoose pre-save hook to automatically generate/update the slug.
documentSchema.pre('save', function(next) {
  // Only generate a slug if it's a question paper and relevant fields are modified, or if it's a new document.
  if (this.type === 'question_paper' && (this.isNew || this.isModified('subject_name') || this.isModified('code') || this.isModified('exam_period'))) {
    this.slug = slugify(`${this.subject_name}-${this.code}-${this.exam_period}`);
  }
  next();
});

// ─── Indexes ────────────────────────────────────────────────────────────────

// Fast lookup by subject
documentSchema.index({ subjectId: 1 });

// Filter by code (e.g. fetch all papers for GE3751)
documentSchema.index({ code: 1 });

// Filter by dept + semester + regulation + type
documentSchema.index({ department: 1, semester: 1, regulation: 1, type: 1 });

// Filter by exam period (e.g. all ND-2025 papers)
documentSchema.index({ exam_period: 1 });

// Prevent model overwrite error in Next.js development (Hot Module Replacement)
// and allow this model to be imported in scripts safely.
export default mongoose.models.Document || mongoose.model("Document", documentSchema);
