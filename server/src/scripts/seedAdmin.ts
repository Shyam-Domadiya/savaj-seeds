import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin';
import connectDB from '../config/db';

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminExists = await Admin.findOne({ email: 'admin@savajseeds.com' });

        if (adminExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const admin = await Admin.create({
            email: 'admin@savajseeds.com',
            password: 'password123', // Change this in production!
        });

        console.log('Admin user created:', admin.email);
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
