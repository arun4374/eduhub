 import mongoose from "mongoose";

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

// ─── Indexes ────────────────────────────────────────────────────────────────

// Fast lookup by subject
documentSchema.index({ subjectId: 1 });

// Filter by code (e.g. fetch all papers for GE3751)
documentSchema.index({ code: 1 });

// Filter by dept + semester + regulation + type
documentSchema.index({ department: 1, semester: 1, regulation: 1, type: 1 });

// Filter by exam period (e.g. all ND-2025 papers)
documentSchema.index({ exam_period: 1 });

const Document = mongoose.model("Document", documentSchema);

export default Document;

