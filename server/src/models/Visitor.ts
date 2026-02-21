import mongoose, { Document, Schema } from 'mongoose';

export interface IVisitor extends Document {
    ipAddress: string;
    userAgent?: string;
    visitedAt: Date;
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
}, {
    timestamps: true,
});

const Visitor = mongoose.model<IVisitor>('Visitor', visitorSchema);

export default Visitor;
