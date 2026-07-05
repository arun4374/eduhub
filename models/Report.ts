import mongoose, { Schema, Document as MongooseDocument, models, model } from "mongoose"

export type ReportCategory = "bug" | "incorrect_data" | "suggestion" | "other"
export type ReportStatus = "pending" | "in_progress" | "resolved" | "closed"

export const REPORT_CATEGORIES: ReportCategory[] = ["bug", "incorrect_data", "suggestion", "other"]
export const REPORT_STATUSES: ReportStatus[] = ["pending", "in_progress", "resolved", "closed"]

export interface IStatusHistoryEntry {
    status: ReportStatus
    changedAt: Date
    note?: string
}

export interface IReport extends MongooseDocument {
    ticketId: string
    name?: string
    email?: string
    category: ReportCategory
    pageUrl: string
    description: string
    fileUrl?: string
    status: ReportStatus
    statusHistory: IStatusHistoryEntry[]
    createdAt: Date
    updatedAt: Date
}

const StatusHistorySchema = new Schema<IStatusHistoryEntry>(
    {
        status: { type: String, enum: REPORT_STATUSES, required: true },
        changedAt: { type: Date, default: Date.now },
        note: { type: String },
    },
    { _id: false }
)

const ReportSchema = new Schema<IReport>(
    {
        ticketId: { type: String, required: true, unique: true, index: true },
        name: { type: String, trim: true },
        email: { type: String, trim: true, lowercase: true, index: true },
        category: { type: String, enum: REPORT_CATEGORIES, required: true },
        pageUrl: { type: String, required: true },
        description: { type: String, required: true },
        fileUrl: { type: String },
        status: { type: String, enum: REPORT_STATUSES, default: "pending", index: true },
        statusHistory: { type: [StatusHistorySchema], default: [] },
    },
    { timestamps: true }
)

// Reuse the compiled model across hot reloads / serverless invocations.
export default (models.Report as mongoose.Model<IReport>) || model<IReport>("Report", ReportSchema)