import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVisitorCount extends Document {
    identifier: string;
    count: number;
}

const VisitorCountSchema: Schema<IVisitorCount> = new Schema({
    identifier: {
        type: String,
        required: true,
        unique: true,
        default: 'global',
    },
    count: {
        type: Number,
        required: true,
        default: 0,
    },
});

const VisitorCount: Model<IVisitorCount> = mongoose.models.VisitorCount || mongoose.model<IVisitorCount>('VisitorCount', VisitorCountSchema);

export default VisitorCount;
