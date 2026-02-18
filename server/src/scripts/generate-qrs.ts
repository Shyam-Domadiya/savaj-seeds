
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import QRCode from 'qrcode';
import connectDB from '../config/db';
import Product from '../models/Product';

dotenv.config();

const generateQRCodes = async () => {
    try {
        await connectDB();

        const qrDir = path.join(__dirname, '../../../client/public/qrcodes');

        // Ensure output directory exists
        if (!fs.existsSync(qrDir)) {
            fs.mkdirSync(qrDir, { recursive: true });
            console.log(`Created directory: ${qrDir}`);
        }

        console.log('Fetching products from database...');
        const products = await Product.find({});
        console.log(`Found ${products.length} products. Generating QR codes...`);

        if (products.length === 0) {
            console.log('No products found to generate QR codes for.');
            process.exit(0);
        }

        let count = 0;
        for (const product of products) {
            const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://savajseeds.com'}/products/${product.slug || product._id}`;
            const filename = `${product.slug || product._id}-qr.png`;
            const filePath = path.join(qrDir, filename);

            await QRCode.toFile(filePath, productUrl, {
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                },
                width: 300,
                margin: 2
            });

            console.log(`Generated: ${filename}`);
            count++;
        }

        console.log(`\nSuccessfully generated ${count} QR codes in ${qrDir}`);
        process.exit(0);

    } catch (error) {
        console.error('Error generating QR codes:', error);
        process.exit(1);
    }
};

generateQRCodes();
