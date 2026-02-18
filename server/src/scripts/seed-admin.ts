import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin';
import connectDB from '../config/db';

import path from 'path';

// Load .env from server root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedAdmin = async () => {
    try {
        await connectDB();

        const email = process.env.ADMIN_EMAIL || 'admin@savajseeds.com';
        const password = process.env.ADMIN_PASSWORD || 'password123';

        const adminExists = await Admin.findOne({ email });

        if (adminExists) {
            adminExists.password = password;
            await adminExists.save();
            console.log('Admin user updated with new password');
        } else {
            const admin = await Admin.create({
                email,
                password,
            });
            console.log('Admin user created:', admin.email);
        }

        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
