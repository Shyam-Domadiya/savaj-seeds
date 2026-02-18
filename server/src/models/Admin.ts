import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
    email: string;
    password: string;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const adminSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

adminSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

adminSchema.pre<IAdmin>('save', async function (next: any) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Admin = mongoose.model<IAdmin>('Admin', adminSchema);

export default Admin;
