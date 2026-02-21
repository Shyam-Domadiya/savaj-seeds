import mongoose, { Document, Schema } from 'mongoose';

export interface IVisitor extends Document {
    ipAddress: string;
    userAgent?: string;
    os?: string; // e.g. "Windows 10" or "Android 12"
    browser?: string; // e.g. "Chrome"
    device?: string; // e.g. "Mobile" or "Desktop"
    visitedAt: Date;
    totalTimeSpent?: number; // Time spent on the site in seconds
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
    os: {
        type: String,
    },
    browser: {
        type: String,
    },
    device: {
        type: String,
    },
    totalTimeSpent: {
        type: Number,
        default: 0,
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
