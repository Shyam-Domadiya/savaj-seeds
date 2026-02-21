import mongoose, { Document, Schema } from 'mongoose';

export interface IVisitor extends Document {
    ipAddress: string;
    userAgent?: string;
    visitedAt: Date;
    readableDateStr?: string; // e.g. "21-Feb-2026"
    readableTimeStr?: string; // e.g. "11:11 PM"
    totalVisits: number;
}

const visitorSchema = new Schema<IVisitor>({
    ipAddress: {
        type: String,
        required: true,
    },
    userAgent: {
        type: String,
    },
    visitedAt: {
        type: Date,
        default: Date.now,
    },
    readableDateStr: {
        type: String,
    },
    readableTimeStr: {
        type: String,
    },
    totalVisits: {
        type: Number,
        default: 1,
    }
}, {
    timestamps: true,
});

const Visitor = mongoose.model<IVisitor>('Visitor', visitorSchema);

export default Visitor;
