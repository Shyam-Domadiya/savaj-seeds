import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import connectDB from './config/db';
import contactRoutes from './routes/contactRoutes';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Connect to Database
connectDB();

// Middleware
app.use(express.json());

const allowedOrigins = [
    'http://localhost:3000',
    'https://savaj-seeds.vercel.app',
    process.env.CLIENT_URL
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Session middleware — stores session data in MongoDB
app.use(session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI as string,
        collectionName: 'sessions',
        ttl: 30 * 24 * 60 * 60, // 30 days in seconds
    }),
    cookie: {
        httpOnly: true,
        secure: isProduction,               // HTTPS only in production
        sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-origin (Vercel <-> Render)
        maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days in ms
    },
    name: 'savaj.sid', // custom cookie name
}));

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
